<script lang="ts">
	import { onMount } from 'svelte';
	import { audioEngine } from '$lib/audioEngine';

	interface Sound {
		id: string;
		label: string;
		icon: string;
		volume: number;
	}

	let sounds = $state<Sound[]>([
		{ id: 'rain', label: 'Regn', icon: '🌧️', volume: 0 },
		{ id: 'forest', label: 'Skog', icon: '🌲', volume: 0 },
		{ id: 'cafe', label: 'Kafé', icon: '☕', volume: 0 },
		{ id: 'white', label: 'Brus', icon: '🌫️', volume: 0 }
	]);

	let isMasterOn = $state(false);

	onMount(() => {
		// Load from localStorage
		const savedVolumes = JSON.parse(localStorage.getItem('ambient_volumes') || '{}');
		sounds = sounds.map(s => ({
			...s,
			volume: savedVolumes[s.id] ?? 0
		}));

		// Check initial state
		isMasterOn = audioEngine.isMuted === false;
	});

	async function handleToggleMaster() {
		await audioEngine.toggleMaster();
		isMasterOn = !audioEngine.isMuted;
	}

	function updateVolume(id: string, newVol: number) {
		const sound = sounds.find(s => s.id === id);
		if (sound) {
			sound.volume = newVol;
			audioEngine.setVolume(id, newVol);
			
			// If we turn up air, and it's muted, we should probably stay muted until master is on?
			// Actually, let's keep it simple: if you move a slider, you want sound. 
			// But the user asked for a master switch.
			
			// Save to localStorage
			const savedVolumes = JSON.parse(localStorage.getItem('ambient_volumes') || '{}');
			savedVolumes[id] = newVol;
			localStorage.setItem('ambient_volumes', JSON.stringify(savedVolumes));
		}
	}
</script>

<div class="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/50 w-full max-w-xs mx-auto">
	<div class="flex items-center justify-between mb-8">
		<h4 class="text-[9px] font-black uppercase tracking-[0.25em] opacity-30">Ambient Mixer</h4>
		<button 
			onclick={handleToggleMaster}
			class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group"
		>
			<span class="text-[9px] font-black uppercase tracking-widest {isMasterOn ? 'text-blue-600' : 'text-rose-500'}">
				{isMasterOn ? 'Pausa' : 'Spela'}
			</span>
			<span class="text-xs group-active:scale-90 transition-transform">{isMasterOn ? '🔈' : '🔇'}</span>
		</button>
	</div>
	
	<div class="space-y-6 {isMasterOn ? '' : 'opacity-40 pointer-events-none grayscale-[0.5] transition-all'}">
		{#each sounds as sound (sound.id)}
			<div class="flex items-center gap-4 group">
				<div 
					class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-lg transition-all
					{sound.volume > 0 ? 'shadow-inner scale-95 opacity-100' : 'opacity-40 group-hover:opacity-70'}"
				>
					<span class="{sound.volume > 0 ? 'animate-pulse' : ''}">{sound.icon}</span>
				</div>
				
				<div class="flex-1 flex flex-col gap-1.5">
					<div class="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
						<span>{sound.label}</span>
						<span>{sound.volume}%</span>
					</div>
					<input 
						type="range" 
						min="0" 
						max="100" 
						value={sound.volume} 
						oninput={(e) => updateVolume(sound.id, Number(e.currentTarget.value))}
						class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-600 transition-all hover:accent-blue-500"
					/>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 0.75rem; 
		height: 0.75rem;
		background-color: white;
		border-radius: 9999px;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		border: 1px solid #e2e8f0;
	}
	
	:global(.dark) input[type='range']::-webkit-slider-thumb {
		background-color: #e2e8f0;
		border-color: #334155;
	}
</style>
