<script lang="ts">
	import { fade } from 'svelte/transition';
	import StickyNote from './StickyNote.svelte';
	import { xpService } from '$lib/xp.svelte';

	let { stickyNotes = $bindable() }: { stickyNotes: string[] } = $props();

	function addNote() {
		stickyNotes = [...stickyNotes, ''];
		xpService.addXp(5); // Reward for brainstorming!
	}
</script>

<div in:fade={{ duration: 300 }} class="flex flex-col h-full">
	<header class="flex justify-between items-center mb-10">
		<div>
			<h2 class="text-3xl font-black text-bold-heavy tracking-tighter">Pappersväggen</h2>
			<p class="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Samla dina tankar i rutnätet</p>
		</div>
		<button 
			onclick={addNote}
			class="premium-button flex items-center gap-2 bg-amber-500 text-white! border-amber-600! shadow-lg shadow-amber-500/20 active:scale-95"
		>
			<span class="text-xl">+</span>
			<span class="text-[10px] uppercase tracking-widest">Ny Lapp</span>
		</button>
	</header>

	{#if stickyNotes.length === 0}
		<div class="flex-1 flex flex-col items-center justify-center opacity-20 py-20">
			<span class="text-6xl mb-4">📌</span>
			<p class="text-xs font-black uppercase tracking-widest">Väggen är tom. Börja fästa dina idéer!</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
			{#each stickyNotes as note, i (i)}
				<div class="flex justify-center">
					<StickyNote 
						{note} 
						onUpdate={(val) => stickyNotes[i] = val} 
						onDelete={() => stickyNotes = stickyNotes.filter((_, idx) => idx !== i)} 
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>
