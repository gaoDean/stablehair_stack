<script>
	import AdvancedConfig from './AdvancedConfig.svelte';
	import { createEventDispatcher } from 'svelte';
	import { Eye, X } from 'lucide-svelte';

	export let targetFiles;
	export let referenceFiles;
	export let params;
	export let processing = false;
	export let error = null;

	let useAdvanced = false;
	const dispatch = createEventDispatcher();

	let targetPreview = null;
	let referencePreview = null;
	let activePreview = null;

	$: if (targetFiles && targetFiles.length > 0) {
		if (targetPreview) URL.revokeObjectURL(targetPreview);
		targetPreview = URL.createObjectURL(targetFiles[0]);
	} else {
		targetPreview = null;
	}

	$: if (referenceFiles && referenceFiles.length > 0) {
		if (referencePreview) URL.revokeObjectURL(referencePreview);
		referencePreview = URL.createObjectURL(referenceFiles[0]);
	} else {
		referencePreview = null;
	}

	function handleSubmit() {
		dispatch('submit');
	}
</script>

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
				<div class="flex gap-2">
					<input
						type="file"
						id="target"
						accept="image/*"
						bind:files={targetFiles}
						required
						class="block w-full flex-1 cursor-pointer border border-black p-3 text-sm file:mr-4 file:border
	                                   file:border-black file:bg-black file:px-2 file:py-1 file:text-xs
	                                   file:text-white hover:file:bg-white hover:file:text-black focus:outline-none"
					/>
					{#if targetPreview}
						<button
							type="button"
							on:click={() => (activePreview = targetPreview)}
							class="flex items-center justify-center border border-black p-3 transition-colors hover:bg-black hover:text-white"
							title="View Preview"
						>
							<Eye size={20} />
						</button>
					{/if}
				</div>
			</div>

			<!-- REFERENCE IMAGE -->
			<div class="group">
				<label
					for="reference"
					class="mb-2 block text-xs font-bold uppercase group-hover:underline"
				>
					[02] Reference Style
				</label>
				<div class="flex gap-2">
					<input
						type="file"
						id="reference"
						accept="image/*"
						bind:files={referenceFiles}
						required
						class="block w-full flex-1 cursor-pointer border border-black p-3 text-sm file:mr-4 file:border
	                                   file:border-black file:bg-black file:px-2 file:py-1 file:text-xs
	                                   file:text-white hover:file:bg-white hover:file:text-black focus:outline-none"
					/>
					{#if referencePreview}
						<button
							type="button"
							on:click={() => (activePreview = referencePreview)}
							class="flex items-center justify-center border border-black p-3 transition-colors hover:bg-black hover:text-white"
							title="View Preview"
						>
							<Eye size={20} />
						</button>
					{/if}
				</div>
			</div>

			<!-- OPTIONAL PARAMETERS -->
			<div class="border-t border-black pt-6">
				<button
					type="button"
					class="mb-4 flex w-full items-center justify-between text-xs font-bold uppercase hover:text-gray-600"
					on:click={() => (useAdvanced = !useAdvanced)}
				>
					<span>[03] Advanced Configuration</span>
					<span>{useAdvanced ? '[-]' : '[+]'}</span>
				</button>

				{#if useAdvanced}
					<AdvancedConfig {params} />
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

	{#if activePreview}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
			on:click={() => (activePreview = null)}
		>
			<div class="relative max-h-[90vh] max-w-[90vw]" on:click|stopPropagation>
				<button
					class="absolute -top-10 right-0 text-white hover:text-gray-300"
					on:click={() => (activePreview = null)}
				>
					<X size={24} />
				</button>
				<img
					src={activePreview}
					alt="Preview"
					class="max-h-[80vh] w-auto border border-white object-contain shadow-2xl"
				/>
			</div>
		</div>
	{/if}
</section>
