<script>
	export let systemStatus = 'CHECKING...';
</script>

<footer class="mt-12 flex justify-between border-t border-black pt-4 text-[10px]">
	<span
		class:text-green-500={systemStatus === 'ONLINE'}
		class:text-red-500={systemStatus === 'OFFLINE' || systemStatus === 'UNREACHABLE'}
		class:text-gray-400={systemStatus === 'CHECKING...'}>SYS.STATUS: {systemStatus}</span
	>
	<span>STABLEHAIR_STACK_V0.0.1</span>
</footer>
