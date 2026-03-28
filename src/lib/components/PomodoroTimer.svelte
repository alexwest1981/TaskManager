<script lang="ts">
	import { onDestroy } from 'svelte';
	import AmbientMixer from './AmbientMixer.svelte';

	let timeLeft = $state(25 * 60); // 25 minutes
	let isRunning = $state(false);
	let mode = $state<'focus' | 'break'>('focus');
	let timer: ReturnType<typeof setInterval> | undefined;

	const totalSeconds = $derived(mode === 'focus' ? 25 * 60 : 5 * 60);
	const progress = $derived((timeLeft / totalSeconds) * 100);
	const rotation = $derived((timeLeft / totalSeconds) * 360);

	function toggleTimer() {
		isRunning = !isRunning;
		if (isRunning) {
			timer = setInterval(() => {
				if (timeLeft > 0) {
					timeLeft--;
				} else {
					completeSession();
				}
			}, 1000);
		} else {
			clearInterval(timer);
		}
	}

	function resetTimer() {
		clearInterval(timer);
		isRunning = false;
		timeLeft = totalSeconds;
	}

	function completeSession() {
		clearInterval(timer);
		isRunning = false;
		mode = mode === 'focus' ? 'break' : 'focus';
		timeLeft = mode === 'focus' ? 25 * 60 : 5 * 60;
		// Notification or sound could go here
	}

	function formatTime(seconds: number) {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<div class="premium-card p-6 flex flex-col items-center group">
	<h3 class="text-[9px] font-black uppercase tracking-[0.2em] mb-6 opacity-30 group-hover:opacity-100 transition-opacity">
		{mode === 'focus' ? 'Focus Session' : 'Short Break'}
	</h3>

	<!-- Mechanical Timer Visual -->
	<div 
		class="relative w-32 h-32 rounded-full border-[6px] border-slate-100 dark:border-slate-800 shadow-inner flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 transition-transform"
		style="transform: rotate({isRunning ? (rotation / 10) : 0}deg)"
	>
		<!-- Tick Marks -->
		{#each Array(12) as _, i (i)}
			<div 
				class="absolute w-0.5 h-2 bg-slate-300 dark:bg-slate-700" 
				style="transform: rotate({i * 30}deg) translateY(-58px)"
			></div>
		{/each}

		<!-- The Timer Dial -->
		<svg class="absolute inset-0 w-full h-full -rotate-90">
			<circle
				cx="64" cy="64" r="54"
				fill="none"
				stroke="currentColor"
				stroke-width="8"
				class="text-red-500/10 dark:text-red-500/5"
			/>
			<circle
				cx="64" cy="64" r="54"
				fill="none"
				stroke="currentColor"
				stroke-width="8"
				stroke-dasharray="339.292"
				stroke-dashoffset={339.292 - (339.292 * progress) / 100}
				class="text-red-500 transition-all duration-1000"
				stroke-linecap="round"
			/>
		</svg>

		<!-- Center Time -->
		<div class="z-10 flex flex-col items-center">
			<span class="text-2xl font-black tracking-tighter text-bold-heavy leading-none">{formatTime(timeLeft)}</span>
		</div>
	</div>

	<!-- Controls -->
	<div class="grid grid-cols-2 gap-3 mt-8 w-full">
		<button 
			onclick={toggleTimer}
			class="premium-button py-2 text-[10px] uppercase font-black tracking-widest {isRunning ? 'text-red-500' : 'text-blue-600'}"
		>
			{isRunning ? 'Pausa' : 'Starta'}
		</button>
		<button 
			onclick={resetTimer}
			class="premium-button py-2 text-[10px] uppercase font-black tracking-widest opacity-50 hover:opacity-100"
		>
			Reset
		</button>
	</div>

	<AmbientMixer />
</div>
