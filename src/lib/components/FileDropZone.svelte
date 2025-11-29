<script>
	import { Upload } from 'lucide-svelte';

	export let files;
	export let id;
	export let accept = 'image/*';
	export let required = false;

	let input;
	let isDragging = false;

	function handleDragOver(e) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(e) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			input.files = e.dataTransfer.files;
			files = input.files;
		}
	}

	function handleClick() {
		input.click();
	}

	function handleChange(e) {
		files = e.target.files;
	}
</script>

<div
	role="button"
	tabindex="0"
	on:dragover={handleDragOver}
	on:dragleave={handleDragLeave}
	on:drop={handleDrop}
	on:click={handleClick}
	on:keypress={(e) => e.key === 'Enter' && handleClick()}
	class="flex min-h-[60px] flex-1 cursor-pointer flex-col items-center justify-center border border-black p-4 text-center transition-colors
         {isDragging ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'} focus:outline-none"
>
	<input
		{id}
		type="file"
		{accept}
		{required}
		class="hidden"
		bind:this={input}
		on:change={handleChange}
	/>

	{#if files && files.length > 0}
		<div class="flex items-center gap-2 overflow-hidden">
			<p class="max-w-full truncate text-sm font-bold">{files[0].name}</p>
		</div>
		<p class="mt-1 text-[10px] uppercase opacity-60">Click or Drag to replace</p>
	{:else}
		<Upload size={20} class="mb-2" />
		<p class="text-xs font-bold uppercase">Drag & Drop or Click</p>
	{/if}
</div>
