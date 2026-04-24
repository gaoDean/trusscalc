<script>
	import { loads, vertices } from '$lib/stores/trussStore';

	let nodeId = $state('');
	let fx = $state(0);
	let fy = $state(0);

	function addLoad() {
		if (!nodeId) return;
		const id = `load-${Date.now()}`;
		loads.update(l => [...l, { id, nodeId, fx: parseFloat(fx), fy: parseFloat(fy) }]);
		fx = 0;
		fy = 0;
	}

	function removeLoad(id) {
		loads.update(l => l.filter(load => load.id !== id));
	}
</script>

<div class="panel">
	<h3>Loads</h3>
	<div class="input-form">
		<div class="field">
			<label for="loadNode">Node</label>
			<select id="loadNode" bind:value={nodeId}>
				<option value="">Select Node</option>
				{#each $vertices as v}
					<option value={v.id}>({v.x}mm, {v.y}mm)</option>
				{/each}
			</select>
		</div>
		<div class="field">
			<label for="loadFx">Fx</label>
			<input id="loadFx" type="number" step="1000" bind:value={fx} placeholder="Fx" /> <small>N</small>
		</div>
		<div class="field">
			<label for="loadFy">Fy</label>
			<input id="loadFy" type="number" step="1000" bind:value={fy} placeholder="Fy" /> <small>N</small>
		</div>
		<button class="mt-2" onclick={addLoad}>ADD LOAD</button>
	</div>
	
	<ul>
		{#each $loads as l}
			<li>
				<span>
					{#if $vertices.find(v => v.id === l.nodeId)}
						({$vertices.find(v => v.id === l.nodeId).x}, {$vertices.find(v => v.id === l.nodeId).y}): 
					{:else}
						Unknown: 
					{/if}
					({l.fx}N, {l.fy}N)
				</span>
				<button onclick={() => removeLoad(l.id)}>X</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.field { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; width: 100%; }
	.field label { flex-shrink: 0; width: 45px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: #555; user-select: none; }
	.field select, .field input { flex-grow: 1; min-width: 0; }
</style>

