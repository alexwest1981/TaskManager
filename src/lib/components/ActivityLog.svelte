<script lang="ts">
	import type { Activity } from '$lib/types';
	
	let { activities }: { activities: Activity[] } = $props();

	function timeAgo(ms: number) {
		const diff = Date.now() - ms;
		if (diff < 60000) return 'nyss';
		const mins = Math.floor(diff / 60000);
		return `${mins}m sedan`;
	}

	const iconMap = {
		add: '➕',
		delete: '🗑️',
		toggle: '✅',
		edit: '✏️',
		reorder: '↕️'
	};
</script>

<div class="premium-card p-6">
	<div class="space-y-6">
		{#each activities.slice(0, 5) as activity (activity.id)}
			<div class="flex items-start gap-4">
				<div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-xs border border-transparent dark:border-slate-800/50 grayscale opacity-70">
					{iconMap[activity.type] || '📝'}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-[11px] leading-tight font-bold">
						<span class="opacity-40 uppercase tracking-widest block mb-0.5 text-[8px]">{activity.type}</span>
						<span class="truncate block {activity.type === 'delete' ? 'opacity-30' : ''}">{activity.taskText}</span>
					</p>
					<span class="text-[8px] opacity-30 font-black uppercase tracking-[0.15em] mt-1.5 block">{timeAgo(activity.timestamp)}</span>
				</div>
			</div>
		{:else}
			<div class="py-4 text-center">
				<p class="text-[9px] font-black opacity-20 uppercase tracking-widest italic">Väntar på aktivitet...</p>
			</div>
		{/each}
	</div>
</div>
