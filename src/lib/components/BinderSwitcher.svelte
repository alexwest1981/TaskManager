<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Binder {
		id: number;
		name: string;
		color: string;
	}

	let { binders, activeBinderId }: { binders: Binder[], activeBinderId: number } = $props();
	let showAdd = $state(false);
	let newName = $state('');
	let newColor = $state('blue');

	const colors = [
		{ name: 'Blå', value: 'blue', bg: 'bg-blue-500' },
		{ name: 'Grön', value: 'green', bg: 'bg-emerald-500' },
		{ name: 'Röd', value: 'red', bg: 'bg-rose-500' },
		{ name: 'Amber', value: 'amber', bg: 'bg-amber-500' },
		{ name: 'Lila', value: 'purple', bg: 'bg-purple-500' }
	];

	function switchBinder(id: number) {
		document.cookie = `active_binder_id=${id}; path=/; max-age=31536000`;
		window.location.reload();
	}
</script>

<div class="mb-8">
	<div class="flex flex-wrap gap-2 mb-4">
		{#each binders as binder (binder.id)}
			<button 
				onclick={() => switchBinder(binder.id)}
				class="group relative px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
				{activeBinderId === binder.id 
					? 'bg-white dark:bg-slate-700 shadow-sm text-bold-heavy translate-y-[-2px]' 
					: 'opacity-40 hover:opacity-100 hover:bg-white/50 dark:hover:bg-slate-800/50'}"
			>
				<div class="flex items-center gap-2">
					<div class="w-1.5 h-1.5 rounded-full bg-{binder.color}-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
					{binder.name}
				</div>
				{#if activeBinderId === binder.id}
					<div class="absolute -bottom-1 left-1.2 right-1.2 h-0.5 bg-{binder.color}-500 rounded-full"></div>
				{/if}
			</button>
		{/each}
		
		<button 
			onclick={() => showAdd = !showAdd}
			class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all"
		>
			+ Ny Pärm
		</button>
	</div>

	{#if showAdd}
		<div in:fade={{ duration: 200 }} class="premium-card p-4 bg-white/50 dark:bg-slate-900/30 border-dashed border-2 border-slate-200 dark:border-slate-800">
			<form method="POST" action="?/addBinder" onsubmit={() => setTimeout(() => showAdd = false, 100)}>
				<input 
					bind:value={newName}
					name="name" 
					placeholder="Pärmens namn..." 
					class="w-full bg-transparent border-b border-slate-200 dark:border-slate-800 py-2 text-xs font-bold outline-none mb-3"
					required
				/>
				<div class="flex items-center justify-between mb-4">
					<div class="flex gap-2">
						{#each colors as color (color.value)}
							<button 
								type="button"
								aria-label="Välj färg: {color.name}"
								onclick={() => newColor = color.value}
								class="w-4 h-4 rounded-full {color.bg} transition-transform {newColor === color.value ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'opacity-60 hover:opacity-100'}"
							></button>
						{/each}
						<input type="hidden" name="color" value={newColor} />
					</div>
					<button type="submit" class="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Spara</button>
				</div>
			</form>
		</div>
	{/if}
</div>
