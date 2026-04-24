<script>
	import { settings } from '$lib/stores/trussStore';

	function handleSfChange(e) {
		settings.update(s => ({ ...s, safetyFactor: parseFloat(e.target.value) }));
	}

	function handleRatioChange(key, value) {
		settings.update(s => ({ ...s, [key]: parseFloat(value) }));
	}
</script>

<div class="panel">
	<h3>Settings</h3>
	<div class="input-form">
		<label class="row">
			<small>SAFETY FACTOR (N):</small>
			<input type="number" step="0.1" min="1" value={$settings.safetyFactor} oninput={handleSfChange} />
		</label>
		<div class="row items-center gap-2">
			<small>I-BEAM W/H (N:M):</small>
			<div class="flex items-center gap-1">
				<input type="number" step="0.1" min="0.1" class="w-16" value={$settings.aspectRatioN} oninput={(e) => handleRatioChange('aspectRatioN', e.target.value)} />
				<span>:</span>
				<input type="number" step="0.1" min="0.1" class="w-16" value={$settings.aspectRatioM} oninput={(e) => handleRatioChange('aspectRatioM', e.target.value)} />
			</div>
		</div>
		<label class="row">
			<small>THICKNESS (mm):</small>
			<input type="number" step="0.5" min="0.5" value={$settings.baseThickness} oninput={(e) => handleRatioChange('baseThickness', e.target.value)} />
		</label>
	</div>
</div>

