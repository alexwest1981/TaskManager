<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { dndzone } from 'svelte-dnd-action';
	import { invalidateAll } from '$app/navigation';
	import { flip } from 'svelte/animate';
	
	import TaskItem from '$lib/components/TaskItem.svelte';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import StatsModal from '$lib/components/StatsModal.svelte';
	import AboutView from '$lib/components/AboutView.svelte';
	import ActivityLog from '$lib/components/ActivityLog.svelte';
	import WeatherWidget from '$lib/components/WeatherWidget.svelte';
	import StickyNote from '$lib/components/StickyNote.svelte';
	import CalendarView from '$lib/components/CalendarView.svelte';
	import PaperThemePicker from '$lib/components/PaperThemePicker.svelte';
	import HabitTracker from '$lib/components/HabitTracker.svelte';
	import AIBriefing from '$lib/components/AIBriefing.svelte';
	import PomodoroTimer from '$lib/components/PomodoroTimer.svelte';
	import type { Task, Activity } from '$lib/types';
	import { exportTasks, importTasks } from '$lib/utils/tasks';

	// Theme States
	let paperTheme = $state('plain');
	let binderTheme = $state('default');

	let { data }: { data: { tasks: Task[], activities: Activity[] } } = $props();
	const flipDurationMs = 300;

	let searchTerm = $state('');
	let filterStatus = $state<'all' | 'active' | 'done'>('all');
	/* svelte-ignore state_referenced_locally */
	let localTasks = $state(data.tasks);
	let isDark = $state(false);
	let showStats = $state(false);
	let taskPriority = $state<'low' | 'medium' | 'high'>('medium');
	let currentPage = $state(1);
	const itemsPerPage = 5;
	let activeFolder = $state('Alla');
	let activeTab = $state<'tasks' | 'about' | 'calendar' | 'habits' | 'stats' | 'briefing' | 'focus' | 'log'>('tasks');
	let stickyNotes = $state<string[]>(['Välkommen till din nya pärm! 📁', 'Klicka för att ändra mig...']);

	let categories = $derived([...new Set(localTasks.map(t => t.category || 'Övrigt'))].sort());
	let folders = $derived(['Alla', ...categories]);

	$effect(() => { localTasks = data.tasks; });
	
	onMount(() => {
		const saved = localStorage.getItem('sticky_notes');
		if (saved) stickyNotes = JSON.parse(saved);
	});

	$effect(() => {
		localStorage.setItem('sticky_notes', JSON.stringify(stickyNotes));
	});

	let filteredTasks = $derived(
		localTasks.filter(t => {
			const matchesFolder = activeFolder === 'Alla' || (t.category || 'Övrigt') === activeFolder;
			const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase());
			
			let matchesStatus = true;
			if (filterStatus === 'active') matchesStatus = !t.done;
			else if (filterStatus === 'done') matchesStatus = t.done;

			return matchesFolder && matchesSearch && matchesStatus;
		})
	);

	let totalPages = $derived(Math.max(1, Math.ceil(filteredTasks.length / itemsPerPage)));
	let paginatedTasks = $derived(filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	let total = $derived(localTasks.length);
	let completed = $derived(localTasks.filter(t => t.done).length);
	let progress = $derived(total === 0 ? 0 : Math.round((completed / total) * 100));

	let stats = $derived({
		active: total - completed,
		oldestActive: localTasks.filter(t => !t.done).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))[0],
		avgAge: localTasks.filter(t => !t.done).length ? Math.round(localTasks.filter(t => !t.done).reduce((acc, t) => acc + (Date.now() - (t.createdAt || Date.now())), 0) / localTasks.filter(t => !t.done).length / (1000 * 60)) : 0,
		byPriority: { high: localTasks.filter(t => t.priority === 'high').length, medium: localTasks.filter(t => t.priority === 'medium').length, low: localTasks.filter(t => t.priority === 'low').length }
	});

	function timeAgo(ms: number | null) {
		if (!ms) return 'nyss';
		const diff = Date.now() - ms;
		const mins = Math.floor(diff / (1000 * 60));
		const hours = Math.floor(mins / 60);
		if (hours > 0) return `${hours}h sedan`;
		if (mins > 0) return `${mins}m sedan`;
		return 'nyss';
	}

	function handleDndConsider(e: CustomEvent<{ items: Task[] }>) { localTasks = e.detail.items; }
	async function handleDndFinalize(e: CustomEvent<{ items: Task[] }>) {
		localTasks = e.detail.items;
		const ids = localTasks.map(t => t.id);
		const formData = new FormData();
		formData.append('ids', JSON.stringify(ids));
		await fetch('?/reorder', { method: 'POST', body: formData });
		await invalidateAll();
	}

	function toggleTheme() { isDark = !isDark; applyTheme(); }
	function applyTheme() {
		if (isDark) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
		else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
	}

	onMount(() => {
		const saved = localStorage.getItem('theme');
		isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
		applyTheme();
	});

	async function handleImport(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		try { const tasksToImport = await importTasks(file); alert(`Hittade ${tasksToImport.length} uppgifter.`); }
		catch { alert('Kunde inte läsa filen.'); }
	}
</script>

<div class="min-h-screen pt-10 pb-20 px-4 md:px-8 transition-colors duration-500 {binderTheme !== 'default' ? 'binder-' + binderTheme : ''}">
	<div class="max-w-7xl mx-auto flex items-start">
		
		<!-- Left Side Tabs (Folder Labels) -->
		<aside class="hidden lg:flex flex-col gap-0.5 pt-12 z-20 max-h-[90vh] overflow-y-auto no-scrollbar pr-0 relative mr-[-1px]">
			{#each [
				{ id: 'tasks', label: 'Uppgifter' },
				{ id: 'calendar', label: 'Kalender' },
				{ id: 'habits', label: 'Vanor' },
				{ id: 'stats', label: 'Statistik' },
				{ id: 'briefing', label: 'Briefing' },
				{ id: 'focus', label: 'Focus' },
				{ id: 'log', label: 'Logg' },
				{ id: 'about', label: 'Info' }
			] as tab (tab.id)}
				<button 
					onclick={() => activeTab = tab.id as typeof activeTab}
					class="folder-tab {activeTab === tab.id ? 'folder-tab-active' : 'folder-tab-inactive'}"
				>
					<span class="folder-tab-label">{tab.label}</span>
				</button>
			{/each}
		</aside>

		<!-- Main Page (Folder Content) -->
		<main class="flex-1 folder-main p-6 md:p-10 min-h-[850px] z-10 relative {paperTheme !== 'plain' ? 'paper-' + paperTheme : ''}">
			<header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-slate-100 dark:border-slate-800/50">
				<div>
					<h1 class="text-4xl text-bold-heavy tracking-tighter">TaskManager</h1>
					<p class="opacity-60 text-xs font-bold uppercase tracking-widest mt-1">Organisera mera • 2026</p>
				</div>
				<div class="flex gap-3">
					<PaperThemePicker 
						currentPaper={paperTheme} 
						currentBinder={binderTheme}
						onPaperChange={(v) => paperTheme = v}
						onBinderChange={(v) => binderTheme = v}
					/>
					<button onclick={toggleTheme} class="premium-button text-xl px-2.5">{isDark ? '☀️' : '🌙'}</button>
				</div>
			</header>

			<!-- Mobile Tabs -->
			<div class="lg:hidden flex flex-col gap-4 mb-8">
				<div class="flex interactive-surface p-1 w-fit overflow-x-auto no-scrollbar">
					{#each ['tasks', 'calendar', 'habits', 'about'] as tab (tab)}
						<button 
							onclick={() => activeTab = tab as 'tasks' | 'calendar' | 'habits' | 'about'} 
							class="px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap {activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-white' : 'text-slate-500 dark:text-slate-400'}"
						>
							{#if tab === 'tasks'}Uppgifter{:else if tab === 'calendar'}Kalender{:else if tab === 'habits'}Vanor{:else}Info{/if}
						</button>
					{/each}
				</div>

				{#if activeTab === 'tasks'}
					<div class="flex gap-2 overflow-x-auto no-scrollbar pb-2">
						{#each folders as folder (folder)}
							<button 
								onclick={() => activeFolder = folder}
								class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all
								{activeFolder === folder ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}"
							>
								{folder}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			{#if activeTab === 'tasks'}
				<div in:fade={{ duration: 300 }}>
					<TaskForm bind:taskPriority />

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
						<div class="interactive-surface flex items-center px-4 py-3 group focus-within:ring-2 ring-blue-500/20">
							<span class="mr-3 opacity-40">🔍</span>
							<input bind:value={searchTerm} placeholder="Sök bland dina uppgifter..." class="bg-transparent border-none outline-none w-full text-sm font-medium" />
						</div>
						<div class="interactive-surface flex p-1">
							{#each ['all', 'active', 'done'] as status (status)}
								<button onclick={() => filterStatus = status as 'all' | 'active' | 'done'} class="flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all {filterStatus === status ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-white' : 'opacity-50 hover:opacity-100'}">{status}</button>
							{/each}
						</div>
					</div>

					<ul use:dndzone={{ items: paginatedTasks, flipDurationMs }} onconsider={handleDndConsider} onfinalize={handleDndFinalize} class="space-y-4">
						{#each paginatedTasks as task (task.id)}
							<div animate:flip={{ duration: flipDurationMs }}>
								<TaskItem {task} />
							</div>
						{/each}
					</ul>

					<div class="mt-12 flex justify-center">
						<Pagination bind:currentPage {totalPages} />
					</div>
				</div>
			{:else if activeTab === 'calendar'}
				<div in:fade={{ duration: 300 }}>
					<CalendarView tasks={localTasks} />
				</div>
			{:else if activeTab === 'habits'}
				<div in:fade={{ duration: 300 }}>
					<HabitTracker />
				</div>
			{:else if activeTab === 'stats'}
				<div in:fade={{ duration: 300 }}>
					<StatsModal 
						{total} 
						{completed} 
						{stats} 
						{timeAgo} 
						onExport={() => exportTasks(localTasks)} 
						onImport={async (e) => {
							const target = e.target as HTMLInputElement;
							const file = target.files?.[0];
							if (file) {
								const imported = await importTasks(file);
								if (imported) localTasks = [...localTasks, ...imported as Task[]];
							}
						}} 
						standalone={true} 
					/>
				</div>
			{:else if activeTab === 'briefing'}
				<div in:fade={{ duration: 300 }} class="max-w-2xl mx-auto">
					<AIBriefing tasks={localTasks} />
				</div>
			{:else if activeTab === 'focus'}
				<div in:fade={{ duration: 300 }} class="max-w-sm mx-auto pt-10">
					<PomodoroTimer />
				</div>
			{:else if activeTab === 'log'}
				<div in:fade={{ duration: 300 }}>
					<h3 class="text-[10px] font-black uppercase tracking-[0.25em] opacity-30 mb-8 ml-1">Fullständig Aktivitetslogg</h3>
					<ActivityLog activities={data.activities} />
				</div>
			{:else}
				<div in:fade={{ duration: 300 }}>
					<AboutView onBack={() => activeTab = 'tasks'} />
				</div>
			{/if}
		</main>

		<!-- Activity & Sticky Notes Sidebar -->
		<aside class="hidden xl:flex flex-col gap-16 w-80 sticky top-10 ml-16">
			<WeatherWidget />

			<div>
				<div class="flex justify-between items-center mb-6 px-1">
					<h3 class="text-[10px] font-black uppercase tracking-[0.25em] opacity-30 flex items-center gap-2">
						Sticky Notes
					</h3>
					<button 
						onclick={() => stickyNotes = [...stickyNotes, '']}
						class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-[10px] font-black hover:scale-110 transition-transform shadow-sm"
					>
						+
					</button>
				</div>
				
				<div class="space-y-6">
					{#each stickyNotes as note, i (i)}
						<StickyNote 
							{note} 
							onUpdate={(val) => stickyNotes[i] = val} 
							onDelete={() => stickyNotes = stickyNotes.filter((_, idx) => idx !== i)} 
						/>
					{/each}
				</div>
			</div>

			<div class="premium-card p-6 border-l-4 border-l-blue-600 shadow-xl opacity-90">
				<h3 class="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-4">Mål-uppfyllnad</h3>
				<div class="flex items-baseline gap-1 mb-2">
					<span class="text-4xl font-black text-bold-heavy">{progress}</span>
					<span class="text-xs font-bold opacity-30">%</span>
				</div>
				<div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
					<div class="bg-blue-600 h-full transition-all duration-1000 ease-out" style="width: {progress}%"></div>
				</div>
				<p class="text-[9px] font-black uppercase tracking-widest opacity-30">{completed} av {total} avklarade</p>
			</div>
		</aside>
	</div>
</div>

<StatsModal 
	bind:show={showStats} 
	{total} {completed} {stats} {timeAgo} 
	onExport={() => exportTasks(localTasks)}
	onImport={handleImport}
/>

<style>
	:global(body) { overflow-x: hidden; }
</style>