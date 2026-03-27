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

	const colorMap: Record<string, string> = {
		blue: 'bg-blue-500',
		green: 'bg-emerald-500',
		red: 'bg-rose-500',
		amber: 'bg-amber-500',
		purple: 'bg-purple-500'
	};

	const colors = [
		{ name: 'Blå', value: 'blue' },
		{ name: 'Grön', value: 'green' },
		{ name: 'Röd', value: 'red' },
		{ name: 'Amber', value: 'amber' },
		{ name: 'Lila', value: 'purple' }
	];

	function switchBinder(id: number) {
		document.cookie = `active_binder_id=${id}; path=/; max-age=31536000`;
		window.location.reload();
	}
</script>

<div class="binder-tabs-container">
	{#each binders as binder (binder.id)}
		<button 
			onclick={() => switchBinder(binder.id)}
			class="binder-tab {activeBinderId === binder.id ? 'binder-tab-active' : ''}"
		>
			<div class="w-1.5 h-1.5 rounded-full {colorMap[binder.color] || 'bg-slate-400'} shadow-sm"></div>
			{binder.name}
		</button>
	{/each}
	
	<button 
		onclick={() => showAdd = !showAdd}
		class="binder-tab opacity-50 hover:opacity-100"
	>
		+
	</button>

	{#if showAdd}
		<div in:fade={{ duration: 200 }} class="absolute top-12 left-0 z-50 premium-card p-4 min-w-[240px] shadow-2xl">
			<form method="POST" action="?/addBinder" onsubmit={() => setTimeout(() => showAdd = false, 100)}>
				<div class="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
					<span class="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Ny Pärm</span>
					<button type="button" onclick={() => showAdd = false} class="opacity-20 hover:opacity-100">✕</button>
				</div>
				<input 
					bind:value={newName}
					name="name" 
					placeholder="Namn..." 
					class="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-lg py-2 px-3 text-xs font-bold outline-none mb-4"
					required
				/>
				<div class="flex items-center justify-between">
					<div class="flex gap-2">
						{#each colors as color (color.value)}
							<button 
								type="button"
								aria-label="Välj färg: {color.name}"
								onclick={() => newColor = color.value}
								class="w-4 h-4 rounded-full {colorMap[color.value]} transition-transform {newColor === color.value ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'opacity-60 hover:opacity-100'}"
							></button>
						{/each}
						<input type="hidden" name="color" value={newColor} />
					</div>
					<button type="submit" class="premium-button py-1 px-3 text-[9px] uppercase tracking-widest">Spara</button>
				</div>
			</form>
		</div>
	{/if}
</div>
