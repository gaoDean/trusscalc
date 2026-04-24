import { create, all } from 'mathjs';

const math = create(all);

export function solveTruss(vertices, materials, members, supports, loads, settings) {
	if (vertices.length === 0 || members.length === 0) return { error: 'No geometry' };

	const N = vertices.length;
	// Create a map from vertex ID to index
	const vMap = {};
	vertices.forEach((v, i) => { vMap[v.id] = i; });

	// Initialize Global Stiffness Matrix (2N x 2N)
	let K = math.zeros(2 * N, 2 * N).toArray();
	// Initialize Global Force Vector (2N x 1)
	let F = math.zeros(2 * N).toArray();

	// Apply loads
	loads.forEach(load => {
		const idx = vMap[load.nodeId];
		if (idx !== undefined) {
			F[2 * idx] += load.fx;
			F[2 * idx + 1] += load.fy;
		}
	});

	// Helper to get material
	const getMaterial = (id) => materials.find(m => m.id === id) || materials[0];

	// Helper to get baseline Area and Inertia for an I-beam
	// I-beam profile: height (d), width (bf), thickness (t) for both flange and web
	// Area = 2 * bf * t + (d - 2t) * t
	// I (strong axis) = 2 * [ (bf*t^3)/12 + (bf*t)*(d/2 - t/2)^2 ] + (t*(d-2t)^3)/12
	const getBaselineProperties = (profile) => {
		const d = profile.height;
		const bf = profile.width;
		const t = profile.thickness;
		const A = 2 * bf * t + (d - 2 * t) * t;
		const I = 2 * ((bf * Math.pow(t, 3)) / 12 + (bf * t) * Math.pow(d / 2 - t / 2, 2)) + (t * Math.pow(d - 2 * t, 3)) / 12;
		return { A, I };
	};

	// Assemble Global Stiffness Matrix
	members.forEach((member) => {
		const idxA = vMap[member.nodeA];
		const idxB = vMap[member.nodeB];
		if (idxA === undefined || idxB === undefined) return;

		const vA = vertices[idxA];
		const vB = vertices[idxB];
		const mat = getMaterial(member.materialId);

		const dx = vB.x - vA.x;
		const dy = vB.y - vA.y;
		const L = Math.sqrt(dx * dx + dy * dy);
		if (L === 0) return;
		const c = dx / L;
		const s = dy / L;

		// Use baseline profile for initial stiffness
		const { A } = getBaselineProperties(member.profile);
		// Convert MPa to N/mm^2 (they are equivalent, so we just use the raw value)
		const E = mat.youngsModulus;
		const k = (E * A) / L;

		const dofs = [2 * idxA, 2 * idxA + 1, 2 * idxB, 2 * idxB + 1];
		
		const k_local = [
			[c * c, c * s, -c * c, -c * s],
			[c * s, s * s, -c * s, -s * s],
			[-c * c, -c * s, c * c, c * s],
			[-c * s, -s * s, c * s, s * s]
		];

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				K[dofs[i]][dofs[j]] += k * k_local[i][j];
			}
		}
		member._L = L;
		member._c = c;
		member._s = s;
		member._E = E;
		member._A = A;
		member._yield = mat.yieldStrength;
	});

	// Apply Boundary Conditions
	const constrainedDOFs = new Set();
	supports.forEach(sup => {
		const idx = vMap[sup.nodeId];
		if (idx !== undefined) {
			if (sup.fixX) constrainedDOFs.add(2 * idx);
			if (sup.fixY) constrainedDOFs.add(2 * idx + 1);
		}
	});

	// Modify K and F to enforce zero displacement at constrained DOFs
	for (let i = 0; i < 2 * N; i++) {
		if (constrainedDOFs.has(i)) {
			// Zero out row and column
			for (let j = 0; j < 2 * N; j++) {
				K[i][j] = 0;
				K[j][i] = 0;
			}
			K[i][i] = 1;
			F[i] = 0;
		}
	}
	
	// Add tiny pseudo-stiffness to unconstrained diagonals to prevent singular matrices
	// for isolated/unconnected vertices
	for (let i = 0; i < 2 * N; i++) {
		if (K[i][i] === 0) {
			K[i][i] = 1e-9;
		}
	}

	// Solve for displacements: U = K^-1 * F
	let U;
	try {
		U = math.multiply(math.inv(K), F);
	} catch (e) {
		return { error: 'Truss is unstable or mechanism.' };
	}

	// Calculate Internal Forces and Size Members
	const sf = settings.safetyFactor;
	const results = { members: {}, nodes: U };

	members.forEach(member => {
		const idxA = vMap[member.nodeA];
		const idxB = vMap[member.nodeB];
		if (idxA === undefined || idxB === undefined) return;

		const u = [
			U[2 * idxA], U[2 * idxA + 1],
			U[2 * idxB], U[2 * idxB + 1]
		];

		const c = member._c;
		const s = member._s;
		
		// v = [-c, -s, c, s] * u
		const elongation = -c * u[0] - s * u[1] + c * u[2] + s * u[3];
		let force = (member._E * member._A / member._L) * elongation; // >0 is Tension, <0 is Compression

		if (isNaN(force) || !isFinite(force)) {
			force = 0;
		}

		// Sizing
		let requiredA = 0;
		let requiredI = 0;
		const absForce = Math.abs(force);

		// N, mm, MPa consistency:
		// yield is in MPa (N/mm^2)
		// force is in N
		// L is in mm
		// E is in MPa (N/mm^2)
		// A will be in mm^2
		// I will be in mm^4

		if (force >= 0) {
			// Tension: A = F * N / yield
			requiredA = (absForce * sf) / member._yield;
		} else {
			// Compression: Yield & Buckling
			requiredA = (absForce * sf) / member._yield;
			// P_cr = pi^2 * E * I / L^2  => I_req = P * N * L^2 / (pi^2 * E)
			requiredI = (absForce * sf * Math.pow(member._L, 2)) / (Math.pow(Math.PI, 2) * member._E);
		}

		// Find the scale factor for the profile to meet both A and I requirements
		// If we scale the whole profile proportionally by factor `s`:
		// new_A = A_base * s^2
		// new_I = I_base * s^4
		
		// Adjust profile based on global settings
		const aspectRatio = (settings.aspectRatioN || 1) / (settings.aspectRatioM || 2);
		const currentProfile = { 
			...member.profile, 
			width: member.profile.height * aspectRatio,
			thickness: settings.baseThickness || 5
		};

		const { A: baseA, I: baseI } = getBaselineProperties(currentProfile);
		
		const scaleForA = Math.sqrt(requiredA / baseA);
		const scaleForI = Math.pow(requiredI / baseI, 0.25);
		const scale = Math.max(scaleForA, scaleForI, 0.01); // min scale to prevent vanishing lines

		results.members[member.id] = {
			force,
			type: force > 1e-6 ? 'Tension' : force < -1e-6 ? 'Compression' : 'Zero',
			scale,
			requiredA,
			requiredI,
			profile: {
				height: currentProfile.height * scale,
				width: currentProfile.width * scale,
				thickness: currentProfile.thickness * scale
			}
		};
	});

	return { results, error: null };
}
