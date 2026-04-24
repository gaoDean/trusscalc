<script>
	import { materials } from '$lib/stores/trussStore';

	let name = $state('');
	let youngs = $state(200000);
	let yieldStr = $state(250);
	let editingId = $state(null);

	function saveMaterial() {
		if (!name) return;
		
		if (editingId) {
			materials.update(m => m.map(mat => mat.id === editingId ? {
				...mat,
				name,
				youngsModulus: parseFloat(youngs),
				yieldStrength: parseFloat(yieldStr)
			} : mat));
			editingId = null;
		} else {
			const id = `mat-${Date.now()}`;
			materials.update(m => [...m, { 
				id, 
				name, 
				youngsModulus: parseFloat(youngs), 
				yieldStrength: parseFloat(yieldStr) 
			}]);
		}
		
		name = '';
		youngs = 200000;
		yieldStr = 250;
	}

	function editMaterial(m) {
		editingId = m.id;
		name = m.name;
		youngs = m.youngsModulus;
		yieldStr = m.yieldStrength;
	}

	function cancelEdit() {
		editingId = null;
		name = '';
		youngs = 200000;
		yieldStr = 250;
	}

	function removeMaterial(id) {
		materials.update(m => m.filter(mat => mat.id !== id));
		if (editingId === id) cancelEdit();
		// TODO: Clean up members using this material
	}
</script>

<div class="panel">
	<h3>Materials</h3>
	<div class="input-form">
		<div class="field">
			<label for="matName">Name</label>
			<input id="matName" type="text" bind:value={name} placeholder="Material Name" />
		</div>
		<div class="field">
			<label for="matE" title="Young's Modulus">E</label>
			<input id="matE" type="number" step="1000" bind:value={youngs} placeholder="E" title="Young's Modulus" /> <small>MPa</small>
		</div>
		<div class="field">
			<label for="matFy" title="Yield Strength">Fy</label>
			<input id="matFy" type="number" step="10" bind:value={yieldStr} placeholder="Yield" title="Yield Strength" /> <small>MPa</small>
		</div>
		<div class="action-buttons mt-2">
			<button onclick={saveMaterial}>{editingId ? 'UPDATE' : 'ADD'}</button>
			{#if editingId}
				<button onclick={cancelEdit}>CANCEL</button>
			{/if}
		</div>
	</div>
	
	<ul>
		{#each $materials as m}
			<li>
				<span>{m.name}</span>
				<div class="list-buttons">
					<button onclick={() => editMaterial(m)}>EDIT</button>
					<button onclick={() => removeMaterial(m.id)}>X</button>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.field { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; width: 100%; }
	.field label { flex-shrink: 0; width: 45px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: #555; user-select: none; cursor: help; }
	.field input { flex-grow: 1; min-width: 0; }
</style>

