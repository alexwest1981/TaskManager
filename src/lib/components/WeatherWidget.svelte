<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let time = $state(new Date());
	let weather = $state<{ temp: number, code: number } | null>(null);
	let loading = $state(true);

	const weatherIcons: Record<number, string> = {
		0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
		45: '🌫️', 48: '🌫️',
		51: '🌦️', 53: '🌦️', 55: '🌧️',
		61: '🌧️', 63: '🌧️', 65: '⛈️',
		71: '🌨️', 73: '🌨️', 75: '❄️',
		80: '🌦️', 81: '🌧️', 82: '⛈️',
		95: '⛈️', 96: '⛈️', 99: '⛈️'
	};

	onMount(() => {
		const timer = setInterval(() => { time = new Date(); }, 1000);
		fetchWeather();
		return () => clearInterval(timer);
	});

	async function fetchWeather() {
		try {
			const lat = 59.3293; const lon = 18.0686;
			const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
			const data = await res.json();
			if (data.current_weather) {
				weather = { temp: Math.round(data.current_weather.temperature), code: data.current_weather.weathercode };
			}
		} catch (e) { console.error(e); } finally { loading = false; }
	}
</script>

<div class="premium-card p-6 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform" transition:fade>
	<div class="flex flex-col items-center gap-0.5">
		<span class="text-3xl font-black tracking-tighter text-bold-heavy">
			{time.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
		</span>
		<span class="text-[9px] font-black uppercase tracking-[0.25em] opacity-30 group-hover:opacity-60 transition-opacity">
			{time.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'short' })}
		</span>
	</div>
	
	<div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-center gap-4">
		{#if loading}
			<div class="w-3 h-3 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
		{:else if weather}
			<div class="flex items-center gap-2">
				<span class="text-xl">{weatherIcons[weather.code] || '🌡️'}</span>
				<span class="text-sm font-black">{weather.temp}°C</span>
			</div>
		{:else}
			<span class="text-[8px] font-bold opacity-20 uppercase tracking-widest">Context Offline</span>
		{/if}
	</div>
</div>
