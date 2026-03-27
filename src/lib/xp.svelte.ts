import { browser } from '$app/environment';

export interface IXpService {
	totalXp: number;
	level: number;
	xpToNextLevel: number;
	progress: number;
	addXp: (amount: number) => void;
}

const createXpService = (): IXpService => {
	let totalXp = $state(0);
	
	const getActiveBinderId = () => {
		if (!browser) return 1;
		const match = document.cookie.match(/active_binder_id=(\d+)/);
		return match ? parseInt(match[1], 10) : 1;
	};

	if (browser) {
		const saved = localStorage.getItem(`binder_xp_${getActiveBinderId()}`);
		if (saved) totalXp = parseInt(saved, 10);
	}

	const level = $derived(Math.floor(totalXp / 100) + 1);
	const xpInCurrentLevel = $derived(totalXp % 100);
	const progress = $derived(xpInCurrentLevel);

	return {
		get totalXp() { return totalXp; },
		get level() { return level; },
		get progress() { return progress; },
		get xpToNextLevel() { return 100 - progress; },
		addXp(amount: number) {
			totalXp += amount;
			if (browser) {
				localStorage.setItem(`binder_xp_${getActiveBinderId()}`, totalXp.toString());
			}
		}
	};
};

export const xpService = createXpService();
