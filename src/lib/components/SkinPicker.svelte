<script lang="ts">
	import { onMount } from 'svelte';

	interface Skin {
		id: string;
		name: string;
		icon: string;
		bg: string;
		texture: string;
		shadow: string;
	}

	const skins: Skin[] = [
		{ 
			id: 'classic', 
			name: 'Standard', 
			icon: '📘', 
			bg: 'var(--folder-bg)', 
			texture: 'none', 
			shadow: 'inset 0 0 50px rgba(0,0,0,0.05)' 
		},
		{ 
			id: 'leather', 
			name: 'Läder', 
			icon: '💼', 
			bg: 'var(--skin-leather-bg)', 
			texture: 'var(--skin-leather-texture)', 
			shadow: 'var(--skin-leather-shadow)' 
		},
		{ 
			id: 'carbon', 
			name: 'Obsidian', 
			icon: '🌑', 
			bg: 'var(--skin-carbon-bg)', 
			texture: 'var(--skin-carbon-texture)', 
			shadow: 'var(--skin-carbon-shadow)' 
		},
		{ 
			id: 'marble', 
			name: 'Marmor', 
			icon: '🏛️', 
			bg: 'var(--skin-marble-bg)', 
			texture: 'var(--skin-marble-texture)', 
			shadow: 'var(--skin-marble-shadow)' 
		}
	];

	let activeSkinId = $state('classic');

	onMount(() => {
		const saved = localStorage.getItem('binder_skin');
		if (saved) {
			applySkin(saved);
		}
	});

	function applySkin(id: string) {
		const skin = skins.find(s => s.id === id) || skins[0];
		activeSkinId = skin.id;
		
		const root = document.documentElement;
		root.style.setProperty('--binder-bg', skin.bg);
		root.style.setProperty('--binder-texture', skin.texture);
		root.style.setProperty('--binder-shadow', skin.shadow);
		
		localStorage.setItem('binder_skin', id);
	}
</script>

<div class="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50">
	<h4 class="text-[9px] font-black uppercase tracking-[0.25em] mb-6 opacity-30">Pärm-Skin</h4>
	
	<div class="grid grid-cols-2 gap-3">
		{#each skins as skin (skin.id)}
			<button 
				onclick={() => applySkin(skin.id)}
				class="flex items-center gap-3 p-3 rounded-xl border transition-all text-left group
				{activeSkinId === skin.id 
					? 'bg-white dark:bg-slate-800 border-blue-500 shadow-md ring-2 ring-blue-500/10' 
					: 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}"
			>
				<div 
					class="w-10 h-10 rounded-lg shadow-inner flex items-center justify-center text-xl overflow-hidden relative"
					style="background-color: {skin.bg === 'var(--folder-bg)' ? '#fff' : skin.bg}; background-image: {skin.texture}; box-shadow: {skin.shadow}"
				>
					<span class="z-10 {activeSkinId === skin.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform">{skin.icon}</span>
				</div>
				<span class="text-[10px] font-bold uppercase tracking-widest {activeSkinId === skin.id ? 'text-blue-600 dark:text-blue-400' : 'opacity-60'}">
					{skin.name}
				</span>
			</button>
		{/each}
	</div>
</div>
