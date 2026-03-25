<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Task } from '$lib/types';

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

	let { show = $bindable(), total, completed, stats, timeAgo, onExport, onImport }: { 
		show: boolean, 
		total: number, 
		completed: number, 
		stats: Stats,
		timeAgo: (ms: number | null) => string,
		onExport: () => void,
		onImport: (e: Event) => void
	} = $props();
</script>

{#if show}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		role="button"
		tabindex="0"
		onclick={() => show = false}
		onkeydown={(e) => e.key === 'Escape' && (show = false)}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="premium-card w-full max-w-md p-8 !bg-white dark:!bg-slate-900 border border-slate-200 dark:border-slate-800"
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

			<div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
				<button
					onclick={onExport}
					class="premium-button text-[10px] uppercase tracking-widest"
				>
					📥 Exportera
				</button>
				<label class="premium-button text-[10px] uppercase tracking-widest cursor-pointer text-center">
					📤 Importera
					<input type="file" accept=".json" onchange={onImport} class="hidden" />
				</label>
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
