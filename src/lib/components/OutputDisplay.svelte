<script>
	export let resultImage;
	export let processing;
	export let progress;
</script>

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
