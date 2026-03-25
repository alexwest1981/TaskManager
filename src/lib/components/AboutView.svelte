<script lang="ts">
	import { fade } from 'svelte/transition';
	let { onBack }: { onBack: () => void } = $props();
</script>

<div in:fade={{ duration: 300 }} class="flex flex-col h-full max-w-2xl px-2">
	<section class="mb-10">
		<h1 class="text-4xl font-black text-bold-heavy tracking-tighter mb-3">Om Projektet</h1>
		<p class="text-muted-clean text-base">En modern Task Manager byggd med fokus på användarvänlighet och estetik.</p>
	</section>

	<div class="space-y-10">
		<article>
			<h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400 mb-4 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 w-fit rounded-md border border-blue-100 dark:border-blue-800/50">Projektets Syfte</h3>
			<p class="text-[15px] leading-relaxed text-bold-heavy">
				Denna applikation är skapad som ett exempel på hur modern webbutveckling ser ut år 2026. Den använder Svelte 5 för reaktivitet, Tailwind 4 för design och Drizzle ORM för persistent lagring.
			</p>
		</article>

		<article>
			<h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400 mb-4 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 w-fit rounded-md border border-blue-100 dark:border-blue-800/50">Teknisk Stack</h3>
			<ul class="grid grid-cols-2 gap-3">
				{#each ['Svelte 5 (Runes)', 'Tailwind CSS 4', 'Web Speech API', 'Open-Meteo API', 'Drizzle ORM', 'SQLite (LibSQL)'] as tech (tech)}
					<li class="premium-button text-center flex items-center justify-center min-h-[50px] text-xs font-black">
						{tech}
					</li>
				{/each}
			</ul>
		</article>

		<article>
			<h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400 mb-4 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 w-fit rounded-md border border-blue-100 dark:border-blue-800/50">Huvudfunktioner</h3>
			<div class="space-y-3 text-[14px] text-bold-heavy">
				<p class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span> 🎙️ Röstinmatning (Web Speech API)</p>
				<p class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span> 📅 Visuell Månadskalender</p>
				<p class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span> ☀️ Realtidsklimat & Klocka</p>
				<p class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span> 📁 Premium Binder UI (Takilt gränssnitt)</p>
				<p class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span> 📝 Digitala 'Sticky Notes' för snabba råd</p>
			</div>
		</article>
	</div>

	<div class="mt-auto pt-12 text-center">
		<button 
			onclick={onBack}
			class="premium-button text-xs uppercase tracking-widest text-blue-700 dark:text-blue-400 font-black"
		>
			Tillbaka till uppgifter
		</button>
	</div>
</div>
