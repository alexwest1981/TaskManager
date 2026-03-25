<script lang="ts">
	import { enhance } from '$app/forms';
	
	let { taskPriority = $bindable() }: { taskPriority: 'low' | 'medium' | 'high' } = $props();
	let taskCategory = $state('Övrigt');
	let dueDate = $state('');
	let taskText = $state('');
	let isListening = $state(false);

	const categories = ['Arbete', 'Hem', 'Fritid', 'Hälsa', 'Övrigt'];

	function startListening() {
		// @ts-ignore - SpeechRecognition is not standard in all TS envs but works in modern browsers
		const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
		
		if (!SpeechRecognition) {
			alert('Tyvärr, din webbläsare stöder inte röstigenkänning.');
			return;
		}

		const recognition = new SpeechRecognition();
		recognition.lang = 'sv-SE';
		recognition.start();
		isListening = true;

		// @ts-ignore
		recognition.onresult = (event) => {
			const transcript = event.results[0][0].transcript;
			taskText = transcript;
			isListening = false;
		};

		recognition.onerror = () => {
			isListening = false;
		};

		recognition.onend = () => {
			isListening = false;
		};
	}
</script>

<form method="POST" action="?/add" use:enhance={() => {
	return async ({ update }) => {
		await update();
		taskPriority = 'medium';
		taskCategory = 'Övrigt';
		dueDate = '';
		taskText = '';
	};
}} class="premium-form space-y-4 mb-8">
	<div class="flex gap-2">
		<div class="flex-1 relative">
			<input
				name="text"
				required
				bind:value={taskText}
				placeholder={isListening ? 'Lyssnar...' : 'Vad behöver göras?'}
				class="premium-input w-full font-bold pr-12 {isListening ? 'ring-2 ring-red-500/50' : ''}"
			/>
			<button 
				type="button"
				onclick={startListening}
				class="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:scale-110 active:scale-95 transition-transform"
				title="Prata in uppgift"
			>
				{#if isListening}
					<span class="flex h-3 w-3 relative">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
					</span>
				{:else}
					🎙️
				{/if}
			</button>
		</div>
		<button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
			Lägg till
		</button>
	</div>
	
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="space-y-2">
			<span class="text-[10px] font-black uppercase tracking-widest opacity-60">Prioritet</span>
			<div class="flex gap-2">
				<input type="hidden" name="priority" value={taskPriority} />
				{#each ['low', 'medium', 'high'] as p (p)}
					<button
						type="button"
						onclick={() => taskPriority = p as 'low' | 'medium' | 'high'}
						class="flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border-2
						{p === 'low' ? (taskPriority === 'low' ? 'bg-green-600 border-green-600 text-white' : 'border-green-500/30 text-green-600 hover:bg-green-500/10') : ''}
						{p === 'medium' ? (taskPriority === 'medium' ? 'bg-amber-600 border-amber-600 text-white' : 'border-amber-500/30 text-amber-600 hover:bg-amber-500/10') : ''}
						{p === 'high' ? (taskPriority === 'high' ? 'bg-red-600 border-red-600 text-white' : 'border-red-500/30 text-red-600 hover:bg-red-500/10') : ''}"
					>
						{p}
					</button>
				{/each}
			</div>
		</div>

		<div class="space-y-2">
			<span class="text-[10px] font-black uppercase tracking-widest opacity-60">Kategori</span>
			<select name="category" bind:value={taskCategory} class="premium-input w-full text-xs font-bold py-2">
				{#each categories as cat (cat)}<option value={cat}>{cat}</option>{/each}
			</select>
		</div>

		<div class="space-y-2">
			<span class="text-[10px] font-black uppercase tracking-widest opacity-60">Deadline</span>
			<input type="date" name="dueDate" bind:value={dueDate} class="premium-input w-full text-xs font-bold py-2" />
		</div>
	</div>
</form>
