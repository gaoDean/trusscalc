<script>
	import { supports, vertices } from '$lib/stores/trussStore';

	let nodeId = $state('');
	let fixX = $state(true);
	let fixY = $state(true);

	function addSupport() {
		if (!nodeId) return;
		
		supports.update(s => {
			// Remove existing support for this node if any
			const filtered = s.filter(sup => sup.nodeId !== nodeId);
			return [...filtered, { nodeId, fixX, fixY }];
		});
	}

	function removeSupport(nId) {
		supports.update(s => s.filter(sup => sup.nodeId !== nId));
	}
</script>

<div class="panel">
	<h3>Supports</h3>
	<div class="input-form">
		<div class="field">
			<label for="supNode">Node</label>
			<select id="supNode" bind:value={nodeId}>
				<option value="">Select Node</option>
				{#each $vertices as v}
					<option value={v.id}>({v.x}mm, {v.y}mm)</option>
				{/each}
			</select>
		</div>
		<div class="checkbox-group">
			<label class="cb-label"><input type="checkbox" bind:checked={fixX}> FIX X</label>
			<label class="cb-label"><input type="checkbox" bind:checked={fixY}> FIX Y</label>
		</div>
		<button class="mt-2" onclick={addSupport}>SET SUPPORT</button>
	</div>
	
	<ul>
		{#each $supports as s}
			<li>
				<span>Node {s.nodeId.substring(0,6)}: [X:{s.fixX ? 'L' : 'F'}, Y:{s.fixY ? 'L' : 'F'}]</span>
				<button onclick={() => removeSupport(s.nodeId)}>X</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.field { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; width: 100%; }
	.field label { flex-shrink: 0; width: 45px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: #555; user-select: none; }
	.field select { flex-grow: 1; min-width: 0; }
	.checkbox-group { display: flex; gap: 16px; margin-bottom: 8px; margin-left: 53px; }
	.cb-label { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: #555; user-select: none; }
</style>

