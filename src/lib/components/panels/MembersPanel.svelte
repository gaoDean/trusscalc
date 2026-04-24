<script>
	import { members, vertices, materials } from '$lib/stores/trussStore';

	let nodeA = $state('');
	let nodeB = $state('');
	let materialId = $state('');

	function addMember() {
		if (!nodeA || !nodeB || !materialId || nodeA === nodeB) return;
		const id = `mem-${Date.now()}`;
		members.update(m => [...m, { 
			id, 
			nodeA, 
			nodeB, 
			materialId,
			profile: { height: 100, width: 50, thickness: 5 } // default I-beam shape in mm
		}]);
	}

	function removeMember(id) {
		members.update(m => m.filter(mem => mem.id !== id));
	}
</script>

<div class="panel">
	<h3>Members</h3>
	<div class="input-form">
		<div class="field">
			<label for="nodeA">Start</label>
			<select id="nodeA" bind:value={nodeA}>
				<option value="">Select Node A</option>
				{#each $vertices as v}
					<option value={v.id}>({v.x}mm, {v.y}mm)</option>
				{/each}
			</select>
		</div>
		<div class="field">
			<label for="nodeB">End</label>
			<select id="nodeB" bind:value={nodeB}>
				<option value="">Select Node B</option>
				{#each $vertices as v}
					<option value={v.id}>({v.x}mm, {v.y}mm)</option>
				{/each}
			</select>
		</div>
		<div class="field">
			<label for="mat">Material</label>
			<select id="mat" bind:value={materialId}>
				<option value="">Select Material</option>
				{#each $materials as m}
					<option value={m.id}>{m.name}</option>
				{/each}
			</select>
		</div>
		<button onclick={addMember}>ADD MEMBER</button>
	</div>
	
	<ul>
		{#each $members as m}
			<li>
				<span>
					{#if $vertices.find(v => v.id === m.nodeA)}
						({$vertices.find(v => v.id === m.nodeA).x}, {$vertices.find(v => v.id === m.nodeA).y}) 
					{:else}
						Unknown
					{/if}
					&harr; 
					{#if $vertices.find(v => v.id === m.nodeB)}
						({$vertices.find(v => v.id === m.nodeB).x}, {$vertices.find(v => v.id === m.nodeB).y})
					{:else}
						Unknown
					{/if}
				</span>
				<button onclick={() => removeMember(m.id)}>X</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.field { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; width: 100%; }
	.field label { flex-shrink: 0; width: 60px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: #555; user-select: none; }
	.field select { flex-grow: 1; min-width: 0; }
</style>

