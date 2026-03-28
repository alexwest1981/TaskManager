<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Task, Activity } from '$lib/types';
	import SkinPicker from './SkinPicker.svelte';

	interface Stats {
		active: number;
		avgAge: number;
		byPriority: {
			low: number;
			medium: number;
			high: number;
		};
		oldestActive: Task | null;
	}

	let { 
		show = $bindable(false), 
		total, 
		completed, 
		stats, 
		timeAgo, 
		onExport, 
		onImport,
		activities = [],
		standalone = false
	}: { 
		show?: boolean, 
		total: number, 
		completed: number, 
		stats: Stats,
		timeAgo: (ms: number | null) => string,
		onExport: () => void,
		onImport: (e: Event) => void,
		activities?: Activity[],
		standalone?: boolean
	} = $props();

	// Calculate Weekly Velocity
	const weeklyVelocity = $derived.by(() => {
		const result = Array(7).fill(0);
		const now = Date.now();
		const dayMs = 24 * 60 * 60 * 1000;
		
		activities.forEach(a => {
			if (a.type === 'toggle') { 
				const age = (now - a.timestamp) / dayMs;
				if (age < 7) {
					result[6 - Math.floor(age)]++;
				}
			}
		});
		return result;
	});

	const days = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
	const todayIdx = new Date().getDay(); // 0 is Sun
</script>

{#if standalone}
	<div class="max-w-2xl mx-auto py-10" in:fade>
		<header class="flex justify-between items-center mb-10">
			<h2 class="text-3xl font-black text-bold-heavy tracking-tighter">Statistik</h2>
		</header>

		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
			<div class="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
				<p class="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Totalt</p>
				<p class="text-2xl font-black text-slate-900 dark:text-white">{total}</p>
			</div>
			<div class="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30">
				<p class="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Klara</p>
				<p class="text-2xl font-black text-slate-900 dark:text-white">{completed}</p>
			</div>
			<div class="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100/50 dark:border-purple-800/30">
				<p class="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1">Kvota</p>
				<p class="text-2xl font-black text-slate-900 dark:text-white">{total > 0 ? Math.round((completed/total)*100) : 0}%</p>
			</div>
			<div class="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100/50 dark:border-amber-800/30">
				<p class="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Aktiva</p>
				<p class="text-2xl font-black text-slate-900 dark:text-white">{stats.active}</p>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
			<div class="premium-card p-6">
				<div class="flex justify-between items-center mb-8">
					<h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Veckans Velocity</h3>
					<div class="text-[8px] font-black uppercase text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">Senaste 7 dagarna</div>
				</div>

				<div class="h-32 flex items-end justify-between gap-1 px-2">
					{#each weeklyVelocity as count, i (i)}
						<div class="flex-1 flex flex-col items-center group relative">
							<div 
								class="w-full bg-blue-500/20 group-hover:bg-blue-500/40 rounded-t-sm transition-all duration-500 flex flex-col justify-end"
								style="height: {Math.max((count/Math.max(...weeklyVelocity, 5)) * 100, 5)}%"
							>
								<div class="w-full bg-blue-600 rounded-t-sm" style="height: {count > 0 ? '4px' : '0'}"></div>
							</div>
							<span class="text-[7px] font-black uppercase opacity-20 mt-2">{days[(todayIdx + i + 1) % 7]}</span>
							
							{#if count > 0}
								<div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
									{count}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<div class="premium-card p-6">
				<h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-8">Prioritetsfördelning</h3>
				<div class="flex justify-around items-end h-32 pb-4">
					{#each [
						{ label: 'Hög', count: stats.byPriority.high, color: 'bg-red-500' },
						{ label: 'Medel', count: stats.byPriority.medium, color: 'bg-amber-500' },
						{ label: 'Låg', count: stats.byPriority.low, color: 'bg-emerald-500' }
					] as p (p.label)}
						<div class="flex flex-col items-center gap-2">
							<div class="text-[10px] font-black">{p.count}</div>
							<div class="w-3 {p.color} rounded-full" style="height: {Math.max((p.count/Math.max(total, 1)) * 100, 10)}%"></div>
							<div class="text-[8px] font-black uppercase opacity-30 mt-1">{p.label}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="premium-card p-6">
				<h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">Datahantering</h3>
				<div class="flex flex-col gap-3">
					<button onclick={onExport} class="premium-button text-left flex items-center gap-3">
						<span class="bg-blue-50 dark:bg-blue-900/30 w-8 h-8 rounded-lg flex items-center justify-center">📤</span>
						<div>
							<div class="text-[10px] font-black uppercase">Exportera Pärm</div>
							<div class="text-[8px] opacity-40">Spara allt som .json</div>
						</div>
					</button>
					<label class="premium-button text-left flex items-center gap-3 cursor-pointer">
						<span class="bg-emerald-50 dark:bg-emerald-900/30 w-8 h-8 rounded-lg flex items-center justify-center">📥</span>
						<div class="flex-1">
							<div class="text-[10px] font-black uppercase">Importera Pärm</div>
							<div class="text-[8px] opacity-40">Läs in från .json</div>
							<input type="file" accept=".json" onchange={onImport} class="hidden" />
						</div>
					</label>
				</div>
			</div>

			<SkinPicker />
		</div>
	</div>
{:else if show}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		role="button"
		tabindex="0"
		onclick={() => show = false}
		onkeydown={(e) => e.key === 'Escape' && (show = false)}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="premium-card w-full max-w-md p-8 bg-white! dark:bg-slate-900! border border-slate-200 dark:border-slate-800"
			role="presentation"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl text-bold-heavy">Statistik</h2>
				<button onclick={() => show = false} class="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
			</div>

			<div class="grid grid-cols-2 gap-4 mb-8">
				<div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
					<p class="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Totala</p>
					<p class="text-3xl font-black text-slate-900 dark:text-white">{total}</p>
				</div>
				<div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800">
					<p class="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">Klara</p>
					<p class="text-3xl font-black text-slate-900 dark:text-white">{completed}</p>
				</div>
			</div>

			<div class="space-y-4">
				<div class="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
					<span class="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Aktiva uppgifter</span>
					<span class="font-black text-slate-900 dark:text-white">{stats.active}</span>
				</div>
				<div class="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
					<span class="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Snittålder (aktiva)</span>
					<span class="font-black text-slate-900 dark:text-white">{stats.avgAge} min</span>
				</div>

				<div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
					<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Fördelning per prioritet</p>
					<div class="flex justify-around items-center">
						<div class="flex flex-col items-center">
							<span class="w-3 h-3 rounded-full bg-red-500 mb-2"></span>
							<span class="text-xs font-black dark:text-white">{stats.byPriority.high}</span>
						</div>
						<div class="flex flex-col items-center">
							<span class="w-3 h-3 rounded-full bg-amber-500 mb-2"></span>
							<span class="text-xs font-black dark:text-white">{stats.byPriority.medium}</span>
						</div>
						<div class="flex flex-col items-center">
							<span class="w-3 h-3 rounded-full bg-green-500 mb-2"></span>
							<span class="text-xs font-black dark:text-white">{stats.byPriority.low}</span>
						</div>
					</div>
				</div>

				{#if stats.oldestActive}
					<div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
						<p class="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">Äldsta aktiva uppgift</p>
						<div class="flex justify-between items-center">
							<span class="text-slate-900 dark:text-white font-bold truncate max-w-[150px]">{stats.oldestActive.text}</span>
							<span class="text-[9px] bg-white dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-md font-black uppercase shadow-sm">
								{timeAgo(stats.oldestActive.createdAt)}
							</span>
						</div>
					</div>
				{/if}
			</div>

			<div class="grid grid-cols-1 gap-6 mt-8">
				<div class="premium-card p-6">
					<h4 class="text-[9px] font-black uppercase tracking-[0.25em] mb-6 opacity-30">Exportering</h4>
					<div class="flex flex-col gap-4">
						<button onclick={onExport} class="premium-button w-full flex items-center justify-center gap-2">
							<span>📤</span> Exportera .json
						</button>
						<label class="premium-button w-full flex items-center justify-center gap-2 cursor-pointer text-center">
							<span>📥</span> Importera .json
							<input type="file" accept=".json" onchange={onImport} class="hidden" />
						</label>
					</div>
				</div>

				<SkinPicker />
			</div>

			<button
				onclick={() => show = false}
				class="w-full mt-4 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg"
			>
				Stäng Statistiken
			</button>
		</div>
	</div>
{/if}
