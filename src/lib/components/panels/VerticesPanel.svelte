<script>
	import { vertices } from '$lib/stores/trussStore';

	let newX = $state(0);
	let newY = $state(0);

	function addVertex() {
		const id = `v-${Date.now()}`;
		vertices.update(v => [...v, { id, x: parseFloat(newX), y: parseFloat(newY) }]);
		newX = 0;
		newY = 0;
	}

	function removeVertex(id) {
		vertices.update(v => v.filter(vert => vert.id !== id));
		// TODO: Clean up connected members, loads, supports
	}
</script>

<div class="panel">
	<h3>Vertices</h3>
	<div class="input-group row">
		<div class="field"><label for="newX">X</label><input id="newX" type="number" step="100" bind:value={newX} placeholder="0" /> <small>mm</small></div>
		<div class="field"><label for="newY">Y</label><input id="newY" type="number" step="100" bind:value={newY} placeholder="0" /> <small>mm</small></div>
		<button onclick={addVertex}>ADD</button>
	</div>
	
	<ul>
		{#each $vertices as v}
			<li>
				<span>({v.x}mm, {v.y}mm)</span>
				<button onclick={() => removeVertex(v.id)}>X</button>
			</li>
		{/each}
	</ul>
</div>

	<style>
		.panel {
			border: 1px solid #111;
			padding: 12px;
			background: #fff;
			box-shadow: 2px 2px 0 #111;
		}
		h3 { margin-top: 0; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #111; padding-bottom: 6px; margin-bottom: 12px; letter-spacing: -0.02em; }
		.input-group { display: flex; gap: 8px; margin-bottom: 10px; align-items: center; }
		.field { display: flex; align-items: center; gap: 4px; flex: 1; min-width: 0; }
		.field label { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: #555; user-select: none; margin-right: 2px; }
		.field input { width: 100%; padding: 4px 6px; min-width: 40px; }
		small { color: #555; font-size: 0.85rem; font-weight: 600; flex-shrink: 0; text-transform: uppercase; }
		ul { list-style: none; padding: 0; margin: 0; border-top: 1px solid #111; }
		li { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e5e5e5; font-size: 0.85rem; }
	</style>