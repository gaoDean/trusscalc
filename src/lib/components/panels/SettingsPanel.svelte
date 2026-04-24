<script>
	import { vertices, materials, members, supports, loads, settings } from '$lib/stores/trussStore';
	import { get } from 'svelte/store';

	function handleSfChange(e) {
		settings.update(s => ({ ...s, safetyFactor: parseFloat(e.target.value) }));
	}

	function handleRatioChange(key, value) {
		settings.update(s => ({ ...s, [key]: parseFloat(value) }));
	}

	function exportData() {
		const data = {
			vertices: get(vertices),
			materials: get(materials),
			members: get(members),
			supports: get(supports),
			loads: get(loads),
			settings: get(settings),
			exportDate: new Date().toISOString()
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `truss_data_${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
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
		<label class="row">
			<small>DISPLAY SCALE:</small>
			<input type="range" min="0.1" max="10" step="0.1" value={$settings.displayScale} oninput={(e) => handleRatioChange('displayScale', e.target.value)} />
			<span>{$settings.displayScale}</span>
		</label>
		<button onclick={exportData} class="export-btn">EXPORT JSON</button>
	</div>
</div>

<style>
	.export-btn {
		margin-top: 16px;
		background: #111;
		color: #fff;
		width: 100%;
		border: none;
		padding: 8px;
		font-weight: bold;
		cursor: pointer;
		text-transform: uppercase;
		box-shadow: 4px 4px 0 #888;
	}
	.export-btn:active {
		transform: translate(2px, 2px);
		box-shadow: 2px 2px 0 #888;
	}
</style>

