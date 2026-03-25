import { db } from '$lib/server/db';
import { tasks } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';
import { eq, asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Hämtar alla tasks från databasen när sidan laddas
	const allTasks = await db.select().from(tasks).orderBy(asc(tasks.sortOrder));
	return { tasks: allTasks };
};

export const actions: Actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const text = data.get('text') as string;
		if (text) {
			await db.insert(tasks).values({ text });
		}
	},
	toggle: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const currentDone = data.get('done') === 'true';
		await db.update(tasks).set({ done: !currentDone }).where(eq(tasks.id, id));
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		await db.delete(tasks).where(eq(tasks.id, id));
	},
	reorder: async ({ request }) => {
		const data = await request.formData();
		const ids = JSON.parse(data.get('ids') as string) as number[];

		// Uppdatera varje task med dess nya index som sortOrder
		for (let i = 0; i < ids.length; i++) {
			await db.update(tasks).set({ sortOrder: i }).where(eq(tasks.id, ids[i]));
		}
		return { success: true };
	}
};
