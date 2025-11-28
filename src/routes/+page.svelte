<script>
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import InputForm from '$lib/components/InputForm.svelte';
	import OutputDisplay from '$lib/components/OutputDisplay.svelte';

	let processing = false;
	let progress = 0;
	let resultImage = null;
	let error = null;
	let systemStatus = 'CHECKING...';

	let targetFiles;
	let referenceFiles;

	// Default parameters for advanced configuration
	let params = {
		remover_steps: 15,
		remover_strength: 0.8,
		remover_cfg: 2.0,
		transfer_steps: 25,
		transfer_cfg: 1.5,
		transfer_control_strength: 1.0,
		transfer_adapter_strength: 1
	};

	onMount(async () => {
		await checkHealth();
	});

	async function checkHealth() {
		try {
			const res = await fetch('/api/health');
			if (res.ok) {
				systemStatus = 'ONLINE';
			} else {
				systemStatus = 'OFFLINE';
			}
		} catch (e) {
			console.error('Health check failed:', e);
			systemStatus = 'UNREACHABLE';
		}
	}

	async function handleSubmit() {
		if (
			!targetFiles ||
			targetFiles.length === 0 ||
			!referenceFiles ||
			referenceFiles.length === 0
		) {
			error = 'ERR: MISSING_INPUTS';
			return;
		}

		processing = true;
		progress = 0;
		error = null;
		resultImage = null;

		// Progress simulation (11.5s est)
		const startTime = Date.now();
		const duration = 13500;
		const progressInterval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			let p = (elapsed / duration) * 98;
			if (p > 98) p = 98;
			progress = p;
		}, 100);

		const formData = new FormData();
		formData.append('target_image', targetFiles[0]);
		formData.append('reference_image', referenceFiles[0]);

		// Append optional parameters
		// Note: We always append them now, assuming defaults are fine.
		// The original code only appended if useAdvanced was true, but here params are always present.
		// If we want to strictly follow original logic we would need to know if advanced was "used",
		// but usually sending defaults is fine.
		// However, to be safe, I will just append them.
		for (const [key, value] of Object.entries(params)) {
			if (typeof value === 'number') {
				formData.append(key, value.toString());
			} else {
				formData.append(key, value);
			}
		}

		try {
			const response = await fetch('/api/process', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errText = await response.text();
				throw new Error(errText || `SERVER_ERR: ${response.status}`);
			}

			const blob = await response.blob();
			resultImage = URL.createObjectURL(blob);
		} catch (e) {
			console.error(e);
			error = e.message;
		} finally {
			clearInterval(progressInterval);
			processing = false;
		}
	}
</script>

<div class="flex min-h-screen flex-col bg-white p-6 font-mono text-black md:p-12">
	<Header />

	<main class="grid flex-grow grid-cols-1 gap-12 lg:grid-cols-2">
		<InputForm
			bind:targetFiles
			bind:referenceFiles
			bind:params
			{processing}
			{error}
			on:submit={handleSubmit}
		/>

		<OutputDisplay {resultImage} {processing} {progress} />
	</main>

	<Footer {systemStatus} />
</div>
