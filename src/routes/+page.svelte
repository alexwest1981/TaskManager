<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { dndzone } from 'svelte-dnd-action';
	import { invalidateAll } from '$app/navigation';
	import { flip } from 'svelte/animate';

	let { data } = $props();
	const flipDurationMs = 300;

	// --- REAKTIVT TILLSTÅND ---
	let searchTerm = $state('');
	let filterStatus = $state<'all' | 'active' | 'done'>('all');
	let localTasks = $state([...data.tasks]);
	let isDark = $state(false);

	// Synka lokal lista när databasen ändras (t.ex. vid Add/Delete)
	$effect(() => { localTasks = [...data.tasks]; });

	// Filtrering (Realtid)
	let filteredTasks = $derived(
		localTasks.filter(t => {
			const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase());
			if (filterStatus === 'active') return matchesSearch && !t.done;
			if (filterStatus === 'done') return matchesSearch && t.done;
			return matchesSearch;
		})
	);

	// Statistik
	let total = $derived(localTasks.length);
	let completed = $derived(localTasks.filter(t => t.done).length);
	let progress = $derived(total === 0 ? 0 : Math.round((completed / total) * 100));

	// --- FUNKTIONER ---
	function handleDndConsider(e: CustomEvent<any>) { localTasks = e.detail.items; }

	async function handleDndFinalize(e: CustomEvent<any>) {
		localTasks = e.detail.items;
		const ids = localTasks.map(t => t.id);
		const formData = new FormData();
		formData.append('ids', JSON.stringify(ids));
		await fetch('?/reorder', { method: 'POST', body: formData });
		await invalidateAll();
	}

	function handleCheck(e: Event) {
		(e.target as HTMLInputElement).form?.requestSubmit();
	}

	function toggleTheme() {
		isDark = !isDark;
		applyTheme();
	}

	function applyTheme() {
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}

	onMount(() => {
		const saved = localStorage.getItem('theme');
		isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
		applyTheme();
	});
</script>

<div class="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-500 py-10 px-4">
	<main class="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl transition-colors duration-500">

		<section class="mb-8 bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
			<div class="flex justify-between items-start mb-6">
				<div>
					<h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Project Tasks</h1>
					<p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Status: <span class="text-blue-500 font-bold">Live Demo</span></p>
				</div>
				<button
					type="button"
					onclick={() => toggleTheme()}
					class="p-3 rounded-xl bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 hover:scale-110 transition-all text-xl"
				>
					{isDark ? '☀️' : '🌙'}
				</button>
			</div>

			<div class="flex justify-between items-center mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
				<span>Progress</span>
				<span class="text-blue-500">{progress}%</span>
			</div>
			<div class="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
				<div class="bg-blue-500 h-full transition-all duration-1000 ease-out" style="width: {progress}%"></div>
			</div>
		</section>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
			<input
				bind:value={searchTerm}
				placeholder="Search tasks..."
				class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 ring-blue-500 outline-none transition-all"
			/>
			<div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
				{#each ['all', 'active', 'done'] as status}
					<button
						onclick={() => filterStatus = status as any}
						class="flex-1 py-2 rounded-md text-xs font-bold capitalize transition-all {filterStatus === status ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white' : 'text-slate-400 hover:text-slate-600'}"
					>
						{status}
					</button>
				{/each}
			</div>
		</div>

		<form method="POST" action="?/add" use:enhance class="flex gap-2 mb-8">
			<input
				name="text"
				required
				placeholder="Add new task..."
				class="flex-1 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
			/>
			<button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-blue-500/20">
				Add
			</button>
		</form>

		<ul
			use:dndzone={{
    items: filteredTasks,
    flipDurationMs,
    dropTargetStyle: { outline: 'none' }
  }}
			onconsider={handleDndConsider}
			onfinalize={handleDndFinalize}
			class="space-y-3 min-h-[50px]"
		>
			{#each filteredTasks as task (task.id)}
				<li
					animate:flip={{ duration: flipDurationMs }}
					class="group flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
				>
					<form method="POST" action="?/toggle" use:enhance class="flex">
						<input type="hidden" name="id" value={task.id} />
						<input type="hidden" name="done" value={task.done} />
						<input type="checkbox" checked={task.done} onchange={handleCheck} class="w-6 h-6 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-0 cursor-pointer" />
					</form>

					<span class="flex-1 font-medium transition-colors {task.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}">
						{task.text}
					</span>

					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={task.id} />
						<button class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all">🗑️</button>
					</form>
				</li>
			{/each}
		</ul>

		{#if filteredTasks.length === 0}
			<div class="text-center py-12 text-slate-400 italic" in:fade>
				No tasks found...
			</div>
		{/if}
		<footer class="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
			<div class="flex items-center gap-2">
				<span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
				System Stable
			</div>
			<div>
				v1.2.4-stable // March 2026
			</div>
			<span class="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] ml-2">
  			SVELTE 5 READY
			</span>
		</footer>
	</main>
</div>