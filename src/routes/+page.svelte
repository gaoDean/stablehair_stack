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

		const formData = new FormData();
		formData.append('target_image', targetFiles[0]);
		formData.append('reference_image', referenceFiles[0]);

		// Append optional parameters
		for (const [key, value] of Object.entries(params)) {
			if (typeof value === 'number') {
				formData.append(key, value.toString());
			} else {
				formData.append(key, value);
			}
		}

		try {
			// Step 1: Submit Job
			const response = await fetch('/api/process', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errText = await response.text();
				throw new Error(errText || `SERVER_ERR: ${response.status}`);
			}

			const { job_id } = await response.json();
			
			// Step 2: Poll Status
			const pollInterval = 1000;
			let isPolling = true;

			const poll = async () => {
				if (!isPolling) return;

				try {
					const statusRes = await fetch(`/api/status/${job_id}`);
					if (!statusRes.ok) throw new Error(`STATUS_ERR: ${statusRes.status}`);
					
					const statusData = await statusRes.json();

					if (statusData.status === 'completed') {
						// Step 3: Get Result
						progress = 100;
						const resultRes = await fetch(`/api/result/${job_id}`);
						if (!resultRes.ok) throw new Error(`RESULT_ERR: ${resultRes.status}`);
						
						const blob = await resultRes.blob();
						resultImage = URL.createObjectURL(blob);
						isPolling = false;
						processing = false;
					} else if (statusData.status === 'processing') {
						progress = 75; // Processing state
						setTimeout(poll, pollInterval);
					} else if (statusData.status === 'queued') {
						// Rough indication of queue depth
						// If queue_position is available, we could use it, but for now fixed 'queued' state
						progress = 25; 
						setTimeout(poll, pollInterval);
					} else {
						// Unknown status, keep polling
						setTimeout(poll, pollInterval);
					}
				} catch (e) {
					throw e; // Pass to outer catch
				}
			};

			// Start polling
			poll();

		} catch (e) {
			console.error(e);
			error = e.message;
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
