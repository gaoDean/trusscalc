<script>
	import { settings } from '$lib/stores/trussStore';

	function handleSfChange(e) {
		settings.update(s => ({ ...s, safetyFactor: parseFloat(e.target.value) }));
	}
</script>

<div class="panel">
	<h3>Settings</h3>
	<div class="input-form">
		<label class="row">
			<small>SAFETY FACTOR (N):</small>
			<input type="number" step="0.1" min="1" value={$settings.safetyFactor} oninput={handleSfChange} />
		</label>
	</div>
</div>

