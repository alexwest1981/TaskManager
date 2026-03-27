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
				<p class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span> 📁 Folder Navigation (Flik-system)</p>
				<p class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span> 🤖 AI Briefing (Smart sammanfattning)</p>
				<p class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span> ⏱️ Focus Session (Pomodoro-timer)</p>
				<p class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span> 📜 Aktivitetslogg & Historik</p>
				<p class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span> 🎙️ Röstinmatning & Väder-insikter</p>
			</div>
		</article>

		<article class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-dotted border-slate-200 dark:border-slate-800">
			<h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">Roadmap 2026</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
				<div class="flex items-start gap-3">
					<span class="text-sm">🎮</span>
					<div>
						<h4 class="text-[12px] font-black leading-none">Gamification & XP <span class="text-green-500 ml-1">KLAR!</span></h4>
						<p class="text-[10px] opacity-40 mt-1 uppercase tracking-tighter">Leveling & Skins</p>
					</div>
				</div>
				<div class="flex items-start gap-3">
					<span class="text-sm">📌</span>
					<div>
						<h4 class="text-[12px] font-black leading-none">Post-it Väggen <span class="text-green-500 ml-1">NYTT!</span></h4>
						<p class="text-[10px] opacity-40 mt-1 uppercase tracking-tighter">Dedikerad workspace</p>
					</div>
				</div>
				<div class="flex items-start gap-3">
					<span class="text-sm">🗂️</span>
					<div>
						<h4 class="text-[12px] font-black leading-none">Multi-Binder</h4>
						<p class="text-[10px] opacity-40 mt-1 uppercase tracking-tighter">Segmenterad lagring</p>
					</div>
				</div>
				<div class="flex items-start gap-3">
					<span class="text-sm">🎵</span>
					<div>
						<h4 class="text-[12px] font-black leading-none">Ambient Focus</h4>
						<p class="text-[10px] opacity-40 mt-1 uppercase tracking-tighter">Lo-Fi Soundscapes</p>
					</div>
				</div>
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
