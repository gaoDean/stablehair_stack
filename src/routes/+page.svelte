<script>
	import { onMount } from 'svelte';

	let processing = false;
	let progress = 0;
	let resultImage = null;
	let error = null;
	let systemStatus = 'CHECKING...';

	let targetFiles;
	let referenceFiles;
	
	let showAdvanced = false;

	// Default parameters for advanced configuration
	const params = {
		remover_steps: 30,
		remover_strength: 0.8,
		remover_cfg: 3.0,
		transfer_steps: 30,
		transfer_cfg: 1.0,
		transfer_control_strength: 1.0,
		transfer_adapter_strength: 1.0
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
		const duration = 11500;
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
	<header class="mb-12 border-b border-black pb-4">
		<h1 class="text-xl font-bold tracking-tight uppercase md:text-2xl">StableHair_Protocol_v1</h1>
	</header>

	<main class="grid flex-grow grid-cols-1 gap-12 lg:grid-cols-2">
		<!-- INPUT SECTION -->
		<section class="flex flex-col gap-8">
			<div class="space-y-2">
				<h2 class="border-l-4 border-black pl-2 text-sm font-bold uppercase">Input Parameters</h2>
				<p class="text-xs text-gray-500">Select source files for processing.</p>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="space-y-8">
				<div class="space-y-6">
					<!-- TARGET IMAGE -->
					<div class="group">
						<label
							for="target"
							class="mb-2 block text-xs font-bold uppercase group-hover:underline"
						>
							[01] Target Face
						</label>
						<input
							type="file"
							id="target"
							accept="image/*"
							bind:files={targetFiles}
							required
							class="block w-full cursor-pointer border border-black p-3 text-sm file:mr-4 file:border
                                   file:border-black file:bg-black file:px-2 file:py-1 file:text-xs
                                   file:text-white hover:file:bg-white hover:file:text-black focus:outline-none"
						/>
					</div>

					<!-- REFERENCE IMAGE -->
					<div class="group">
						<label
							for="reference"
							class="mb-2 block text-xs font-bold uppercase group-hover:underline"
						>
							[02] Reference Style
						</label>
						<input
							type="file"
							id="reference"
							accept="image/*"
							bind:files={referenceFiles}
							required
							class="block w-full cursor-pointer border border-black p-3 text-sm file:mr-4 file:border
                                   file:border-black file:bg-black file:px-2 file:py-1 file:text-xs
                                   file:text-white hover:file:bg-white hover:file:text-black focus:outline-none"
						/>
					</div>

					<!-- OPTIONAL PARAMETERS -->
					<div class="border-t border-black pt-6">
						<button
							type="button"
							class="mb-4 flex w-full items-center justify-between text-xs font-bold uppercase hover:text-gray-600"
							on:click={() => (showAdvanced = !showAdvanced)}
						>
							<span>[03] Advanced Configuration</span>
							<span>{showAdvanced ? '[-]' : '[+]'}</span>
						</button>

						{#if showAdvanced}
							<div class="space-y-6">
								<!-- REMOVER SETTINGS -->
								<div class="space-y-3">
									<h4 class="text-[10px] font-bold text-gray-500 uppercase">Remover Settings</h4>
									<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
										<div class="space-y-1">
											<label for="remover_steps" class="block text-[10px] uppercase"
												>Steps ({params.remover_steps})</label
											>
											<input
												type="range"
												id="remover_steps"
												min="1"
												max="100"
												bind:value={params.remover_steps}
												class="h-1 w-full appearance-none bg-gray-200 outline-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-black"
											/>
										</div>
										<div class="space-y-1">
											<label for="remover_strength" class="block text-[10px] uppercase"
												>Strength ({params.remover_strength})</label
											>
											<input
												type="range"
												id="remover_strength"
												min="0"
												max="1"
												step="0.05"
												bind:value={params.remover_strength}
												class="h-1 w-full appearance-none bg-gray-200 outline-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-black"
											/>
										</div>
										<div class="space-y-1">
											<label for="remover_cfg" class="block text-[10px] uppercase"
												>CFG ({params.remover_cfg})</label
											>
											<input
												type="number"
												id="remover_cfg"
												step="0.1"
												bind:value={params.remover_cfg}
												class="w-full border border-black px-2 py-1 text-xs focus:outline-none"
											/>
										</div>
									</div>
								</div>

								<!-- TRANSFER SETTINGS -->
								<div class="space-y-3">
									<h4 class="text-[10px] font-bold text-gray-500 uppercase">Transfer Settings</h4>
									<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div class="space-y-1">
											<label for="transfer_steps" class="block text-[10px] uppercase"
												>Steps ({params.transfer_steps})</label
											>
											<input
												type="range"
												id="transfer_steps"
												min="1"
												max="100"
												bind:value={params.transfer_steps}
												class="h-1 w-full appearance-none bg-gray-200 outline-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-black"
											/>
										</div>
										<div class="space-y-1">
											<label for="transfer_cfg" class="block text-[10px] uppercase"
												>CFG ({params.transfer_cfg})</label
											>
											<input
												type="number"
												id="transfer_cfg"
												step="0.1"
												bind:value={params.transfer_cfg}
												class="w-full border border-black px-2 py-1 text-xs focus:outline-none"
											/>
										</div>
										<div class="space-y-1">
											<label for="transfer_control_strength" class="block text-[10px] uppercase"
												>Control Strength ({params.transfer_control_strength})</label
											>
											<input
												type="range"
												id="transfer_control_strength"
												min="0"
												max="2"
												step="0.05"
												bind:value={params.transfer_control_strength}
												class="h-1 w-full appearance-none bg-gray-200 outline-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-black"
											/>
										</div>
										<div class="space-y-1">
											<label for="transfer_adapter_strength" class="block text-[10px] uppercase"
												>Adapter Strength ({params.transfer_adapter_strength})</label
											>
											<input
												type="range"
												id="transfer_adapter_strength"
												min="0"
												max="2"
												step="0.05"
												bind:value={params.transfer_adapter_strength}
												class="h-1 w-full appearance-none bg-gray-200 outline-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-black"
											/>
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- ACTION -->
				<div class="pt-4">
					<button
						type="submit"
						disabled={processing}
						class="w-full border border-black bg-black py-4 text-sm font-bold tracking-wider
                               text-white uppercase transition-colors hover:bg-white hover:text-black
                               disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400"
					>
						{#if processing}
							<span class="animate-pulse">>>> INITIALIZING...</span>
						{:else}
							EXECUTE_TRANSFER
						{/if}
					</button>
				</div>
			</form>

			{#if error}
				<div class="mt-4 border border-red-600 p-4 text-xs text-red-600">
					<p class="font-bold">ERROR_LOG:</p>
					<p>{error}</p>
				</div>
			{/if}
		</section>

		<!-- OUTPUT SECTION -->
		<section class="flex flex-col gap-8">
			<div class="space-y-2">
				<h2 class="border-l-4 border-black pl-2 text-sm font-bold uppercase">Output Terminal</h2>
				<p class="text-xs text-gray-500">Generated artifacts will appear below.</p>
			</div>

			<div
				class="relative flex min-h-[400px] flex-grow flex-col items-center justify-center overflow-hidden border border-black bg-gray-50"
			>
				{#if resultImage}
					<img
						src={resultImage}
						alt="Processed Result"
						class="z-10 max-h-[600px] max-w-full object-contain"
					/>
					<a
						href={resultImage}
						download="stablehair_output.png"
						class="absolute right-0 bottom-0 left-0 z-20 bg-black py-3 text-center text-xs font-bold text-white uppercase transition-colors hover:bg-gray-800"
					>
						Download_Artifact
					</a>
				{:else if processing}
					<div class="w-full max-w-xs space-y-2 text-center">
						<div class="w-full border border-black p-1">
							<div
								class="h-4 bg-black transition-all duration-200 ease-linear"
								style="width: {progress}%"
							></div>
						</div>
						<p class="animate-pulse text-xs">COMPUTING_TRANSFER... {Math.floor(progress)}%</p>
					</div>
				{:else}
					<div class="text-center text-gray-400">
						<p class="text-xs">STATUS: IDLE</p>
						<p class="text-xs">AWAITING_INPUT</p>
					</div>
				{/if}
			</div>
		</section>
	</main>

	<footer class="mt-12 flex justify-between border-t border-black pt-4 text-[10px]">
		<span
			class:text-green-500={systemStatus === 'ONLINE'}
			class:text-red-500={systemStatus === 'OFFLINE' || systemStatus === 'UNREACHABLE'}
			class:text-gray-400={systemStatus === 'CHECKING...'}>SYS.STATUS: {systemStatus}</span
		>
		<span>STABLEHAIR_STACK_V0.0.1</span>
	</footer>
</div>
