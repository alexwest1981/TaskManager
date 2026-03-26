<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Task } from '$lib/types';

	let { tasks }: { tasks: Task[] } = $props();

	const activeTasks = $derived(tasks.filter(t => !t.done));
	const highPriority = $derived(activeTasks.filter(t => t.priority === 'high'));
	const dueToday = $derived(activeTasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()));

	const briefing = $derived.by(() => {
		if (activeTasks.length === 0) return "Du har inga aktiva uppgifter. Passa på att vila eller planera framåt! ☕";
		
		if (highPriority.length > 0) {
			return `Prioritera ${highPriority[0].text}. Det är din viktigaste uppgift just nu. 💪`;
		}

		if (dueToday.length > 0) {
			return `Idag fokuserar vi på att slutföra ${dueToday.length} uppgifter som har deadline. 📅`;
		}

		return `Du har ${activeTasks.length} uppgifter i pärmen. Det ser ut som en bra dag att beta av listan! ✨`;
	});
</script>

<div class="premium-card p-6 bg-linear-to-br from-blue-50/50 to-white dark:from-slate-800/50 dark:to-slate-900 overflow-hidden relative group" transition:fade>
	<!-- Decorative AI Glow -->
	<div class="absolute -top-12 -right-12 w-24 h-24 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all"></div>
	
	<div class="flex items-center gap-3 mb-4">
		<span class="text-xl">🤖</span>
		<h3 class="text-[10px] font-black uppercase tracking-[0.25em] opacity-40">AI Briefing</h3>
	</div>

	<p class="text-[13px] font-bold leading-relaxed text-bold-heavy">
		{briefing}
	</p>

	<div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
		<span class="text-[8px] font-bold uppercase tracking-widest opacity-20 italic">Generated based on current binder state</span>
		<div class="flex gap-1">
			<div class="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
			<div class="w-1 h-1 rounded-full bg-blue-500 animate-pulse [animation-delay:200ms]"></div>
			<div class="w-1 h-1 rounded-full bg-blue-500 animate-pulse [animation-delay:400ms]"></div>
		</div>
	</div>
</div>
