<script lang="ts">
	let { currentPage = $bindable(), totalPages }: { currentPage: number, totalPages: number } = $props();
</script>

{#if totalPages > 1}
	<nav class="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
		<button 
			onclick={() => currentPage--}
			disabled={currentPage === 1}
			class="premium-button text-xs uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
		>
			← Föregående
		</button>
		
		<div class="flex items-center gap-2">
			{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page (page)}
				<button
					onclick={() => currentPage = page}
					class="w-8 h-8 rounded-lg text-xs font-black transition-all 
					{currentPage === page ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'opacity-40 hover:opacity-100'}"
				>
					{page}
				</button>
			{/each}
		</div>

		<button 
			onclick={() => currentPage++}
			disabled={currentPage === totalPages}
			class="premium-button text-xs uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
		>
			Nästa →
		</button>
	</nav>
{/if}
