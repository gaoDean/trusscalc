<script>
	import VerticesPanel from './panels/VerticesPanel.svelte';
	import MaterialsPanel from './panels/MaterialsPanel.svelte';
	import MembersPanel from './panels/MembersPanel.svelte';
	import SupportsPanel from './panels/SupportsPanel.svelte';
	import LoadsPanel from './panels/LoadsPanel.svelte';
	import SettingsPanel from './panels/SettingsPanel.svelte';
</script>

<div class="sidebar">
<h2 class="text-sm font-semibold uppercase tracking-tight border-b border-black pb-2 mb-4">Truss Controls</h2>
	<VerticesPanel />
	<MaterialsPanel />
	<MembersPanel />
	<SupportsPanel />
	<LoadsPanel />
	<SettingsPanel />
</div>

<style>
	.sidebar {
		width: 400px;
		background-color: #dfdfdf;
		border-right: 4px solid #111;
		padding: 24px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 24px;
		font-family: monospace;
	}
</style>
