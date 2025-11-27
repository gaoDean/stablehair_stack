<script>
	export let params;
</script>

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
