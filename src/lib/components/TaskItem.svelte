<script lang="ts">
	import type { Task } from '$lib/types';
	import { enhance } from '$app/forms';

	let { task }: { task: Task } = $props();

	let isEditing = $state(false);
	/* svelte-ignore state_referenced_locally */
	let editText = $state(task.text);
	/* svelte-ignore state_referenced_locally */
	let taskCategory = $state(task.category || 'Övrigt');
	/* svelte-ignore state_referenced_locally */
	let taskPriority = $state(task.priority || 'low');

	$effect(() => {
		editText = task.text;
		taskCategory = task.category || 'Övrigt';
		taskPriority = task.priority || 'low';
	});

	const categories = ['Övrigt', 'Arbete', 'Privat', 'Inköp', 'Hälsa'];
	const priorities = ['low', 'medium', 'high'];

	let isOverdue = $derived(!task.done && task.dueDate && task.dueDate < Date.now());
	function getGoogleCalendarUrl(task: Task) {
		if (!task.dueDate) return '';
		const dateObj = new Date(task.dueDate);
		const dateStr = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '').split('T')[0];
		// Create a 1-hour event
		const start = `${dateStr}T090000Z`;
		const end = `${dateStr}T100000Z`;
		
		const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
		const params = new URLSearchParams({
			text: `Task: ${task.text}`,
			dates: `${start}/${end}`,
			details: `Kategori: ${task.category || 'Övrigt'}\nSkapad i TaskManager`,
			trp: 'true'
		});
		return `${baseUrl}&${params.toString()}`;
	}

	function onCheck(event: Event) {
		const form = (event.target as HTMLInputElement).form;
		if (form) form.requestSubmit();
	}

	function autofocus(node: HTMLElement) { node.focus(); }
</script>

<li class="premium-card group flex items-center gap-4 p-5 cursor-grab active:cursor-grabbing">
	<form method="POST" action="?/toggle" use:enhance class="flex">
		<input type="hidden" name="id" value={task.id} />
		<input type="hidden" name="done" value={task.done} />
		<input 
			type="checkbox" 
			checked={task.done} 
			onchange={onCheck} 
			class="w-6 h-6 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-0 cursor-pointer" 
		/>
	</form>

	{#if isEditing}
		<form method="POST" action="?/edit" use:enhance={() => { return async ({ update }) => { await update(); isEditing = false; }; }} class="flex-1 flex flex-col gap-2">
			<input type="hidden" name="id" value={task.id} />
			<input name="text" bind:value={editText} class="premium-input flex-1 font-bold" use:autofocus />
			<div class="flex gap-2">
				<select name="priority" bind:value={taskPriority} class="premium-input text-xs font-bold py-1">
					{#each priorities as p (p)}<option value={p}>{p}</option>{/each}
				</select>
				<select name="category" bind:value={taskCategory} class="premium-input text-xs font-bold py-1">
					{#each categories as cat (cat)}<option value={cat}>{cat}</option>{/each}
				</select>
				<button type="submit" class="premium-button text-[10px] uppercase tracking-widest bg-blue-600 !text-white !border-blue-600">Spara</button>
				<button type="button" onclick={() => isEditing = false} class="premium-button text-[10px] uppercase tracking-widest">Avbryt</button>
			</div>
		</form>
	{:else}
		<div class="flex-1 flex flex-col min-w-0">
			<div class="flex items-center gap-2">
				<span class="text-base font-bold tracking-tight transition-colors {task.done ? 'line-through opacity-40' : ''}">
					{task.text}
				</span>
				{#if isOverdue}
					<span class="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900/50">⚠️ Försenad</span>
				{/if}
			</div>
			
			<div class="flex items-center gap-2 mt-1">
				{#if task.category && task.category !== 'Övrigt'}
					<span class="px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 rounded-md border border-blue-100 dark:border-blue-900/50">{task.category}</span>
				{/if}
				{#if task.dueDate}
					<div class="flex items-center gap-2">
						<span class="text-[10px] font-bold opacity-60 flex items-center gap-1">
							<span class="text-base">📅</span> {new Date(task.dueDate).toLocaleDateString('sv-SE')}
						</span>
						<button 
							onclick={() => window.open(getGoogleCalendarUrl(task), '_blank', 'noopener,noreferrer')} 
							class="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
						>
							Sync ⚡
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<div class="flex items-center gap-2">
		{#if !isEditing}
			<button onclick={() => { isEditing = true; editText = task.text; }} class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-blue-600 transition-all text-sm">✏️</button>
		{/if}
		<span class="w-2.5 h-2.5 rounded-full {task.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : ''} {task.priority === 'medium' ? 'bg-amber-500' : ''} {task.priority === 'low' ? 'bg-green-500' : ''}"></span>
	</div>

	<form method="POST" action="?/delete" use:enhance>
		<input type="hidden" name="id" value={task.id} />
		<button class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 transition-all">🗑️</button>
	</form>
</li>
