<script lang="ts">
	import { slide } from 'svelte/transition';

	let { 
		currentPaper, 
		currentBinder, 
		onPaperChange, 
		onBinderChange 
	}: { 
		currentPaper: string, 
		currentBinder: string,
		onPaperChange: (val: string) => void,
		onBinderChange: (val: string) => void
	} = $props();

	let isOpen = $state(false);

	const papers = [
		{ id: 'plain', label: 'Blankt', icon: '📄' },
		{ id: 'ruled', label: 'Linjerat', icon: '📝' },
		{ id: 'grid', label: 'Rutat', icon: '📊' }
	];

	const binders = [
		{ id: 'default', label: 'Standard', icon: '📁' },
		{ id: 'leather', label: 'Läder', icon: '💼' },
		{ id: 'fabric', label: 'Tyg', icon: '🧵' },
		{ id: 'carbon', label: 'Carbon', icon: '🏁' }
	];
</script>

<div class="relative">
	<button 
		onclick={() => isOpen = !isOpen}
		class="premium-button flex items-center gap-2 text-[10px] uppercase tracking-widest"
	>
		🎨 Tema
	</button>

	{#if isOpen}
		<div 
			class="absolute top-12 right-0 w-64 premium-card p-4 z-[200] shadow-2xl space-y-6"
			transition:slide={{ duration: 200 }}
		>
			<div>
				<h4 class="text-[9px] font-black uppercase tracking-widest opacity-40 mb-3">Papperstextur</h4>
				<div class="grid grid-cols-3 gap-2">
					{#each papers as p (p.id)}
						<button 
							onclick={() => onPaperChange(p.id)}
							class="flex flex-col items-center gap-1 p-2 rounded-lg transition-all border-2 {currentPaper === p.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}"
						>
							<span class="text-lg">{p.icon}</span>
							<span class="text-[8px] font-bold uppercase tracking-tighter">{p.label}</span>
						</button>
					{/each}
				</div>
			</div>

			<div>
				<h4 class="text-[9px] font-black uppercase tracking-widest opacity-40 mb-3">Pärmomslag</h4>
				<div class="grid grid-cols-2 gap-2">
					{#each binders as b (b.id)}
						<button 
							onclick={() => onBinderChange(b.id)}
							class="flex items-center gap-2 p-2 rounded-lg transition-all border-2 {currentBinder === b.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}"
						>
							<span class="text-sm">{b.icon}</span>
							<span class="text-[9px] font-black uppercase tracking-widest">{b.label}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

{#if isOpen}
	<button 
		class="fixed inset-0 z-[190] cursor-default bg-transparent"
		onclick={() => isOpen = false}
		aria-label="Close menu"
	></button>
{/if}
