<script>
	import { vertices, materials, members, supports, loads, settings } from '$lib/stores/trussStore';
	import { solveTruss } from '$lib/solver';

	let result = $derived(solveTruss($vertices, $materials, $members, $supports, $loads, $settings));
	let resultsData = $derived(result.results || { members: {}, nodes: [] });
	let error = $derived(result.error);
	
	$effect(() => {
		console.log("Solver result:", result);
	});

	// Viewbox calculations
	let minX = $derived($vertices.length ? Math.min(...$vertices.map(v => v.x)) : 0);
	let maxX = $derived($vertices.length ? Math.max(...$vertices.map(v => v.x)) : 10);
	let minY = $derived($vertices.length ? Math.min(...$vertices.map(v => v.y)) : 0);
	let maxY = $derived($vertices.length ? Math.max(...$vertices.map(v => v.y)) : 10);
	
	let spanX = $derived(Math.max(maxX - minX, 1));
	let spanY = $derived(Math.max(maxY - minY, 1));
	let padX = $derived(spanX * 0.2);
	let padY = $derived(spanY * 0.2);

	let viewBox = $derived(`${minX - padX} ${-(maxY + padY)} ${spanX + padX*2} ${spanY + padY*2}`);

	// Mapping Y to SVG Y (SVG y goes down)
	const yMap = (y) => -y;

	function getVertex(id) {
		return $vertices.find(v => v.id === id);
	}

	// Tooltip state
	let hoveredMember = $state(null);
	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMouse(e, member, memResult) {
		hoveredMember = { member, result: memResult };
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	function clearHover() {
		hoveredMember = null;
	}
</script>

<div class="canvas-container" onmousemove={(e) => { mouseX = e.clientX; mouseY = e.clientY; }}>
	{#if error}
		<div class="error-banner">Solver Error: {error}</div>
	{/if}

	<svg width="100%" height="100%" {viewBox}>
		<defs>
			<marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
				<path d="M 0 0 L 10 5 L 0 10 z" fill="#ffff00" />
			</marker>
		</defs>

		<!-- Base background rect not needed in viewBox, container is colored -->

		<!-- Draw Members -->
		{#each $members as m}
			{@const vA = getVertex(m.nodeA)}
			{@const vB = getVertex(m.nodeB)}
			{@const mRes = resultsData.members[m.id] || { type: 'Zero', force: 0, profile: m.profile }}
			
			{#if vA && vB}
				<!-- Background invisible thick line for easy hovering -->
				<line
					x1={vA.x} y1={yMap(vA.y)}
					x2={vB.x} y2={yMap(vB.y)}
					stroke="transparent"
					stroke-width={spanX * 0.05}
					onmouseenter={(e) => handleMouse(e, m, mRes)}
					onmouseleave={clearHover}
				/>
				<!-- Actual visible line -->
				<!-- Stroke width proportional to scaled thickness * width to approximate visual heft, or just use scaled height directly -->
				<!-- The visual thickness should scale with the calculated thickness. Let's use the required height since it's the dominant dimension of an I-beam -->
				<line
					x1={vA.x} y1={yMap(vA.y)}
					x2={vB.x} y2={yMap(vB.y)}
					stroke={mRes.type === 'Tension' ? '#0000ff' : (mRes.type === 'Compression' ? '#ff0000' : '#888888')}
					stroke-width={Math.max(mRes.profile.height, spanX * 0.005)}
					stroke-linecap="square"
					style="pointer-events: none;"
				/>
			{/if}
		{/each}

		<!-- Draw Supports -->
		{#each $supports as sup}
			{@const v = getVertex(sup.nodeId)}
			{#if v}
				<polygon 
					points="{v.x},{yMap(v.y)} {v.x - spanX*0.03},{yMap(v.y) + spanX*0.05} {v.x + spanX*0.03},{yMap(v.y) + spanX*0.05}" 
					fill="#00ff00" stroke="#111" stroke-width={spanX*0.003}
				/>
				{#if sup.fixX && !sup.fixY}
					<!-- Roller X -->
					<circle cx={v.x} cy={yMap(v.y) + spanX*0.06} r={spanX*0.01} fill="#00ff00" stroke="#111" stroke-width={spanX*0.003} />
				{/if}
			{/if}
		{/each}

		<!-- Draw Loads -->
		{#each $loads as l}
			{@const v = getVertex(l.nodeId)}
			{#if v}
				{@const loadLen = spanX * 0.1}
				{@const mag = Math.sqrt(l.fx*l.fx + l.fy*l.fy)}
				{@const dx = (l.fx / mag) * loadLen}
				{@const dy = -(l.fy / mag) * loadLen} <!-- Negative because SVG y is inverted -->
				
				<line 
					x1={v.x - dx} y1={yMap(v.y) - dy} 
					x2={v.x} y2={yMap(v.y)} 
					stroke="#ffff00" 
					stroke-width={spanX * 0.01} 
					marker-end="url(#arrow)" 
				/>
			{/if}
		{/each}

		<!-- Draw Vertices -->
		{#each $vertices as v}
			<rect x={v.x - spanX * 0.015} y={yMap(v.y) - spanX * 0.015} width={spanX * 0.03} height={spanX * 0.03} fill="#111" stroke="#fff" stroke-width={spanX * 0.005} />
		{/each}
	</svg>

	{#if hoveredMember}
		<div class="tooltip" style="left: {mouseX + 15}px; top: {mouseY + 15}px;">
			<strong>Member {hoveredMember.member.id.substring(0,8)}</strong><br>
			State: {hoveredMember.result.type}<br>
			Force: {(Math.abs(hoveredMember.result.force) / 1000).toFixed(2)} kN<br>
			Req. H: {hoveredMember.result.profile.height.toFixed(1)} mm<br>
			Req. W: {hoveredMember.result.profile.width.toFixed(1)} mm<br>
			Req. t: {hoveredMember.result.profile.thickness.toFixed(1)} mm<br>
		</div>
	{/if}
</div>

<style>
	.canvas-container {
		flex: 1;
		background-color: #dfdfdf;
		background-image: 
			linear-gradient(#ccc 1px, transparent 1px),
			linear-gradient(90deg, #ccc 1px, transparent 1px);
		background-size: 20px 20px;
		overflow: hidden;
		position: relative;
	}
	svg {
		display: block;
		filter: drop-shadow(4px 4px 0 rgba(0,0,0,0.5));
	}
	.error-banner {
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
		background: #ff0000;
		color: #fff;
		border: 4px solid #111;
		padding: 8px 16px;
		font-weight: bold;
		text-transform: uppercase;
		font-family: monospace;
		box-shadow: 4px 4px 0 #111;
		z-index: 10;
	}
	.tooltip {
		position: fixed;
		background: #fff;
		color: #111;
		padding: 12px;
		border: 3px solid #111;
		box-shadow: 4px 4px 0 #111;
		pointer-events: none;
		z-index: 20;
		font-size: 0.95rem;
		font-family: monospace;
		font-weight: bold;
		min-width: 180px;
		text-transform: uppercase;
	}
	.tooltip strong {
		display: block;
		background: #111;
		color: #fff;
		padding: 4px 8px;
		margin: -12px -12px 8px -12px;
		font-size: 1.1rem;
	}
</style>
