<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { SvelteDate } from 'svelte/reactivity';

	interface Habit {
		id: string;
		name: string;
		icon: string;
		history: Record<string, boolean>;
	}

	let { activeBinderId }: { activeBinderId: number } = $props();

	let habits = $state<Habit[]>([
		{ id: 'water', name: 'Dricka Vatten', icon: '💧', history: {} },
		{ id: 'exercise', name: 'Träning', icon: '🏃', history: {} },
		{ id: 'reading', name: 'Läsning', icon: '📚', history: {} },
		{ id: 'meditation', name: 'Meditation', icon: '🧘', history: {} }
	]);

	const storageKey = $derived(`habit_history_${activeBinderId}`);

	onMount(() => {
		const saved = localStorage.getItem(storageKey);
		if (saved) {
			const parsed = JSON.parse(saved);
			habits.forEach(h => {
				h.history = parsed[h.id] || {};
			});
		}
	});

	$effect(() => {
		const toSave: Record<string, Record<string, boolean>> = {};
		habits.forEach(h => {
			toSave[h.id] = h.history;
		});
		localStorage.setItem(storageKey, JSON.stringify(toSave));
	});

	// Get last 7 days inclusive today
	const days = $derived.by(() => {
		const result = [];
		for (let i = 6; i >= 0; i--) {
			const d = new SvelteDate();
			d.setDate(d.getDate() - i);
			result.push({
				dateStr: d.toDateString(),
				display: d.toLocaleDateString('sv-SE', { weekday: 'short' }),
				isToday: i === 0
			});
		}
		return result;
	});

	function toggleHabit(habitId: string, dateStr: string) {
		const habit = habits.find(h => h.id === habitId);
		if (habit) {
			habit.history[dateStr] = !habit.history[dateStr];
		}
	}
</script>

<div in:fade={{ duration: 300 }} class="max-w-4xl mx-auto">
	<header class="mb-10 text-center">
		<h2 class="text-3xl font-black text-bold-heavy tracking-tighter mb-2">Daily Habits</h2>
		<p class="text-muted-clean text-sm italic">"We are what we repeatedly do. Excellence, then, is not an act, but a habit."</p>
	</header>

	<div class="premium-card p-8 bg-white dark:bg-slate-900/50 shadow-xl relative overflow-hidden">
		<!-- Background Grid Lines (Paper Feel) -->
		<div class="absolute inset-0 paper-ruled opacity-20 pointer-events-none"></div>

		<div class="relative z-10 overflow-x-auto no-scrollbar">
			<table class="w-full border-collapse">
				<thead>
					<tr>
						<th class="p-4 text-left text-[10px] font-black uppercase tracking-widest opacity-40">Habit</th>
						{#each days as day (day.dateStr)}
							<th class="p-4 text-center">
								<div class="flex flex-col items-center">
									<span class="text-[10px] font-black uppercase tracking-widest {day.isToday ? 'text-blue-600' : 'opacity-40'}">{day.display}</span>
									{#if day.isToday}
										<div class="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>
									{/if}
								</div>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">
					{#each habits as habit (habit.id)}
						<tr class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
							<td class="p-4">
								<div class="flex items-center gap-3">
									<span class="text-xl">{habit.icon}</span>
									<span class="text-sm font-bold text-bold-heavy">{habit.name}</span>
								</div>
							</td>
							{#each days as day (day.dateStr)}
								<td class="p-4 text-center">
									<button 
										onclick={() => toggleHabit(habit.id, day.dateStr)}
										class="relative w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center
										{habit.history[day.dateStr] 
											? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
											: 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}"
									>
										{#if habit.history[day.dateStr]}
											<svg class="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
												<path class="animate-check" d="M20 6L9 17l-5-5" />
											</svg>
										{/if}
									</button>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Stats Summary -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
		{#each habits.slice(0, 3) as habit (habit.id)}
			<div class="premium-card p-6 flex flex-col items-center">
				<span class="text-2xl mb-2">{habit.icon}</span>
				<h4 class="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">{habit.name}</h4>
				<div class="text-2xl font-black text-bold-heavy">
					{Object.values(habit.history).filter(v => v).length} <span class="text-[10px] opacity-40">klara</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.animate-check {
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		animation: dash 0.4s ease-out forwards;
	}

	@keyframes dash {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
