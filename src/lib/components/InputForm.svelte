<script>
	import AdvancedConfig from './AdvancedConfig.svelte';
	import { createEventDispatcher } from 'svelte';

	export let targetFiles;
	export let referenceFiles;
	export let params;
	export let processing = false;
	export let error = null;

	let useAdvanced = false;
	const dispatch = createEventDispatcher();

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
</section>
