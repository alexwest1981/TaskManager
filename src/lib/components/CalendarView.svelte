<script lang="ts">
	import type { Task } from '$lib/types';
	import { fade } from 'svelte/transition';

	let { tasks }: { tasks: Task[] } = $props();

	let now = new Date();
	let currentMonth = $state(now.getMonth());
	let currentYear = $state(now.getFullYear());

	const monthNames = [
		'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
		'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
	];

	let calendarData = $derived.by(() => {
		const firstDay = new Date(currentYear, currentMonth, 1);
		const lastDay = new Date(currentYear, currentMonth + 1, 0);
		
		const startOffset = (firstDay.getDay() + 6) % 7; // Monday start
		const totalDays = lastDay.getDate();
		
		const days = [];
		// Previous month padding
		for (let i = 0; i < startOffset; i++) {
			days.push({ day: null, date: null });
		}
		// Current month days
		for (let i = 1; i <= totalDays; i++) {
			const date = new Date(currentYear, currentMonth, i);
			const dateStr = date.toISOString().split('T')[0];
			const dayTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate).toISOString().split('T')[0] === dateStr);
			days.push({ day: i, date, tasks: dayTasks });
		}
		
		return days;
	});

	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
	}

	function prevMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
	}
</script>

<div class="premium-card p-6 min-h-[600px] flex flex-col" in:fade>
	<header class="flex justify-between items-center mb-8">
		<h2 class="text-2xl font-black text-bold-heavy uppercase tracking-widest">
			{monthNames[currentMonth]} <span class="opacity-30">{currentYear}</span>
		</h2>
		<div class="flex gap-2">
			<button onclick={prevMonth} class="premium-button px-3">←</button>
			<button onclick={nextMonth} class="premium-button px-3">→</button>
		</div>
	</header>

	<div class="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-inner">
		{#each ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'] as day (day)}
			<div class="bg-slate-50 dark:bg-slate-900/50 p-3 text-[10px] font-black uppercase tracking-widest text-center opacity-40">
				{day}
			</div>
		{/each}

		{#each calendarData as cell, i (i)}
			<div class="bg-white dark:bg-slate-900 min-h-[100px] p-2 flex flex-col gap-1 {cell.day === null ? 'opacity-20' : ''}">
				{#if cell.day}
					<span class="text-xs font-black opacity-30">{cell.day}</span>
					<div class="flex flex-col gap-1">
						{#each cell.tasks || [] as task (task.id)}
							<div 
								class="text-[9px] font-bold p-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 truncate"
								title={task.text}
							>
								• {task.text}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<footer class="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-center">
		<p class="text-[10px] font-bold uppercase tracking-widest opacity-40">Klicka på en dag för att se detaljer</p>
		<div class="flex gap-4">
			<div class="flex items-center gap-2">
				<div class="w-2 h-2 rounded-full bg-blue-500"></div>
				<span class="text-[9px] font-black uppercase tracking-widest opacity-60">Uppgift</span>
			</div>
		</div>
	</footer>
</div>
