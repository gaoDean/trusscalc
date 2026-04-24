<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Canvas from '$lib/components/Canvas.svelte';
	import '../app.css';
</script>

<div class="app-container">
	<Sidebar />
	<Canvas />
</div>

<style>
	:global(body, html) {
		margin: 0;
		padding: 0;
		height: 100%;
		font-family: sans-serif;
		background-color: #f0f0f0;
		color: #111;
	}
	.app-container {
		display: flex;
		height: 100vh;
		width: 100vw;
	}
</style>
