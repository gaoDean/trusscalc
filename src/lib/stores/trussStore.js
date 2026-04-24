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
  { "id": "v-1777002722342", "x": 0, "y": 0 },
  { "id": "v-1777003768934", "x": 0, "y": 130 },
  { "id": "v-1777003781716", "x": 113, "y": 68 },
  { "id": "v-1777003787066", "x": 236, "y": 168 },
  { "id": "v-1777003795932", "x": 345, "y": 102 },
  { "id": "v-1777003800533", "x": 410, "y": 214 },
  { "id": "v-1777003836633", "x": 175, "y": 0 },
  { "id": "v-1777003929800", "x": -300, "y": 0 },
  { "id": "v-1777003932350", "x": -200, "y": 0 },
  { "id": "v-1777003934599", "x": -100, "y": 0 },
  { "id": "v-1777004032081", "x": -50, "y": 60 },
  { "id": "v-1777004038398", "x": -150, "y": 60 },
  { "id": "v-1777004042664", "x": -250, "y": 60 },
  { "id": "v-1777004047565", "x": -50, "y": 0 },
  { "id": "v-1777004051065", "x": -150, "y": 0 },
  { "id": "v-1777004053781", "x": -250, "y": 0 },
  { "id": "v-1777004107949", "x": -100, "y": 60 },
  { "id": "v-1777004111998", "x": -200, "y": 60 },
  { "id": "v-1777004380832", "x": -400, "y": 0 },
  { "id": "v-1777004386316", "x": -350, "y": 0 },
  { "id": "v-1777004392681", "x": -350, "y": 60 },
  { "id": "v-1777004398650", "x": -300, "y": 60 }
];

export const vertices = createLocalStore('truss_vertices', defaultVertices);

export const materials = createLocalStore('truss_materials', [
  { "id": "mat-1777002743289", "name": "PLA", "youngsModulus": 2400, "yieldStrength": 58 }
]);

const defaultMembers = [
  { "id": "mem-1777003815666", "nodeA": "v-1777002722342", "nodeB": "v-1777003768934", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777003844766", "nodeA": "v-1777002722342", "nodeB": "v-1777003836633", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777003848599", "nodeA": "v-1777002722342", "nodeB": "v-1777003781716", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777003851867", "nodeA": "v-1777003768934", "nodeB": "v-1777003781716", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777003854800", "nodeA": "v-1777003768934", "nodeB": "v-1777003787066", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777003860934", "nodeA": "v-1777003781716", "nodeB": "v-1777003787066", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777003863699", "nodeA": "v-1777003781716", "nodeB": "v-1777003836633", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777003868983", "nodeA": "v-1777003836633", "nodeB": "v-1777003787066", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777003880099", "nodeA": "v-1777003836633", "nodeB": "v-1777003795932", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777003887417", "nodeA": "v-1777003787066", "nodeB": "v-1777003795932", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777003890817", "nodeA": "v-1777003787066", "nodeB": "v-1777003800533", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777003892766", "nodeA": "v-1777003795932", "nodeB": "v-1777003800533", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004066632", "nodeA": "v-1777003929800", "nodeB": "v-1777004053781", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004072431", "nodeA": "v-1777003929800", "nodeB": "v-1777004042664", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004080131", "nodeA": "v-1777004053781", "nodeB": "v-1777004042664", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004086331", "nodeA": "v-1777004053781", "nodeB": "v-1777003932350", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004135281", "nodeA": "v-1777004111998", "nodeB": "v-1777004038398", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004143297", "nodeA": "v-1777004042664", "nodeB": "v-1777004111998", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004150098", "nodeA": "v-1777004042664", "nodeB": "v-1777003932350", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004159215", "nodeA": "v-1777004111998", "nodeB": "v-1777003932350", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004166180", "nodeA": "v-1777004051065", "nodeB": "v-1777003932350", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004171631", "nodeA": "v-1777004051065", "nodeB": "v-1777004038398", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004184797", "nodeA": "v-1777003932350", "nodeB": "v-1777004038398", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004194214", "nodeA": "v-1777004107949", "nodeB": "v-1777004038398", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004200447", "nodeA": "v-1777003934599", "nodeB": "v-1777004038398", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004207564", "nodeA": "v-1777003934599", "nodeB": "v-1777004051065", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004213847", "nodeA": "v-1777003934599", "nodeB": "v-1777004107949", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004218098", "nodeA": "v-1777003934599", "nodeB": "v-1777004032081", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004222115", "nodeA": "v-1777003934599", "nodeB": "v-1777004047565", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004230263", "nodeA": "v-1777004032081", "nodeB": "v-1777004047565", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004233914", "nodeA": "v-1777002722342", "nodeB": "v-1777004047565", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004248731", "nodeA": "v-1777004032081", "nodeB": "v-1777004107949", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004253899", "nodeA": "v-1777004032081", "nodeB": "v-1777003768934", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004259447", "nodeA": "v-1777004032081", "nodeB": "v-1777002722342", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004416519", "nodeA": "v-1777004398650", "nodeB": "v-1777003929800", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004420530", "nodeA": "v-1777004398650", "nodeB": "v-1777004392681", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004436448", "nodeA": "v-1777004398650", "nodeB": "v-1777004042664", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004458299", "nodeA": "v-1777003929800", "nodeB": "v-1777004392681", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004467730", "nodeA": "v-1777003929800", "nodeB": "v-1777004386316", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004472430", "nodeA": "v-1777004392681", "nodeB": "v-1777004386316", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004477464", "nodeA": "v-1777004380832", "nodeB": "v-1777004386316", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } },
  { "id": "mem-1777004480347", "nodeA": "v-1777004380832", "nodeB": "v-1777004392681", "materialId": "mat-1777002743289", "profile": { "height": 100, "width": 50, "thickness": 5 } }
];

export const members = createLocalStore('truss_members', defaultMembers);

const defaultSupports = [
  { "nodeId": "v-1777002722342", "fixX": false, "fixY": true },
  { "nodeId": "v-1777004380832", "fixX": true, "fixY": true }
];

export const supports = createLocalStore('truss_supports', defaultSupports);

const defaultLoads = [
  { "id": "load-1777004292780", "nodeId": "v-1777003800533", "fx": 0, "fy": -12.25 }
];

export const loads = createLocalStore('truss_loads', defaultLoads);
export const settings = createLocalStore('truss_settings', {
  "safetyFactor": 2,
  "aspectRatioN": 0.2,
  "aspectRatioM": 1,
  "baseThickness": 2,
  "displayScale": 5.6
});
