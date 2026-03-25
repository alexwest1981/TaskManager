<script lang="ts">
	import { scale } from 'svelte/transition';
	
	let { note, onUpdate, onDelete }: { 
		note: string, 
		onUpdate: (val: string) => void, 
		onDelete: () => void 
	} = $props();

	let isEditing = $state(false);
	/* svelte-ignore state_referenced_locally */
	let localVal = $state(note);

	function handleBlur() {
		isEditing = false;
		onUpdate(localVal);
	}

	function focus(node: HTMLTextAreaElement) {
		node.focus();
	}
</script>

<div 
	class="relative group w-32 h-32 p-3 bg-amber-50 dark:bg-[#2c2010] border border-amber-200/40 dark:border-amber-900/40 shadow-sm rotate-[-1deg] hover:rotate-0 transition-all flex flex-col shrink-0"
	transition:scale={{ duration: 150, start: 0.98 }}
>
	<!-- Pin visual -->
	<div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500/60 shadow-sm z-10"></div>

	<button 
		onclick={(e) => { e.stopPropagation(); onDelete(); }}
		class="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 text-[8px] text-amber-900/20 dark:text-amber-100/20 hover:text-red-500 transition-opacity z-20"
	>
		✕
	</button>

	{#if isEditing}
		<textarea
			bind:value={localVal}
			onblur={handleBlur}
			class="w-full h-full bg-transparent border-none outline-none resize-none text-[10px] font-bold leading-tight text-amber-950 dark:text-amber-100 placeholder:opacity-20 scrollbar-hide"
			use:focus
			placeholder="..."
		></textarea>
	{:else}
		<button 
			onclick={() => isEditing = true}
			class="w-full h-full text-left bg-transparent border-none outline-none p-0 m-0 align-top overflow-hidden"
		>
			<p class="text-[10px] font-bold leading-tight text-amber-950/70 dark:text-amber-100/70 overflow-y-auto no-scrollbar whitespace-pre-wrap">
				{note || 'Skriv...'}
			</p>
		</button>
	{/if}
</div>
