import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createLocalStore(key, initialValue) {
	let value = initialValue;
	if (browser) {
		const storedValue = window.localStorage.getItem(key);
		if (storedValue) {
			try {
				value = JSON.parse(storedValue);
			} catch (e) {
				console.error(`Error parsing localStorage for ${key}`, e);
			}
		}
	}

	const store = writable(value);

	if (browser) {
		store.subscribe((val) => {
			window.localStorage.setItem(key, JSON.stringify(val));
		});
	}

	return store;
}

const defaultVertices = [
	{ id: 'v-1', x: 0, y: 0 },
	{ id: 'v-2', x: 5000, y: 0 },
	{ id: 'v-3', x: 10000, y: 0 },
	{ id: 'v-4', x: 2500, y: 3000 },
	{ id: 'v-5', x: 7500, y: 3000 }
];

export const vertices = createLocalStore('truss_vertices', defaultVertices);

export const materials = createLocalStore('truss_materials', [{
	id: 'mat-1', name: 'Structural Steel', youngsModulus: 200000, yieldStrength: 250
}]);

const defaultMembers = [
	{ id: 'm-1', nodeA: 'v-1', nodeB: 'v-2', materialId: 'mat-1', profile: { height: 100, width: 50, thickness: 5 } },
	{ id: 'm-2', nodeA: 'v-2', nodeB: 'v-3', materialId: 'mat-1', profile: { height: 100, width: 50, thickness: 5 } },
	{ id: 'm-3', nodeA: 'v-1', nodeB: 'v-4', materialId: 'mat-1', profile: { height: 100, width: 50, thickness: 5 } },
	{ id: 'm-4', nodeA: 'v-4', nodeB: 'v-2', materialId: 'mat-1', profile: { height: 100, width: 50, thickness: 5 } },
	{ id: 'm-5', nodeA: 'v-4', nodeB: 'v-5', materialId: 'mat-1', profile: { height: 100, width: 50, thickness: 5 } },
	{ id: 'm-6', nodeA: 'v-2', nodeB: 'v-5', materialId: 'mat-1', profile: { height: 100, width: 50, thickness: 5 } },
	{ id: 'm-7', nodeA: 'v-5', nodeB: 'v-3', materialId: 'mat-1', profile: { height: 100, width: 50, thickness: 5 } }
];

export const members = createLocalStore('truss_members', defaultMembers);

const defaultSupports = [
	{ nodeId: 'v-1', fixX: true, fixY: true }, // Pinned
	{ nodeId: 'v-3', fixX: false, fixY: true } // Roller
];

export const supports = createLocalStore('truss_supports', defaultSupports);

const defaultLoads = [
	{ id: 'l-1', nodeId: 'v-4', fx: 0, fy: -10000 },
	{ id: 'l-2', nodeId: 'v-5', fx: 0, fy: -10000 }
];

export const loads = createLocalStore('truss_loads', defaultLoads);
export const settings = createLocalStore('truss_settings', { safetyFactor: 2.0, aspectRatioN: 1, aspectRatioM: 2, baseThickness: 5 });
