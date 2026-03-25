import { db } from '$lib/server/db';
import { tasks, activities } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

import { appendFileSync } from 'node:fs';

export const load = async () => {
	try {
		const allTasks = await db.select().from(tasks).orderBy(desc(tasks.sortOrder), desc(tasks.createdAt));
		const allActivities = await db.select().from(activities).orderBy(desc(activities.timestamp)).limit(20);
		return { tasks: allTasks, activities: allActivities };
	} catch (e: any) {
		appendFileSync('/tmp/error.log', `LOAD ERROR: ${e.message}\n${e.stack}\n`);
		throw e;
	}
};

async function logActivity(type: 'add' | 'delete' | 'toggle' | 'edit' | 'reorder', taskText: string) {
	try {
		await db.insert(activities).values({
			id: randomUUID(),
			type,
			taskText,
			timestamp: Date.now()
		});
	} catch (e) {
		console.error('Failed to log activity:', e);
	}
}

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const text = data.get('text') as string;
		const priority = (data.get('priority') as string) || 'medium';
		const category = (data.get('category') as string) || 'Övrigt';
		const dueDateStr = data.get('dueDate') as string;
		const dueDate = dueDateStr ? new Date(dueDateStr).getTime() : null;

		if (text) {
			await db.insert(tasks).values({ 
				text, 
				createdAt: Date.now(), 
				updatedAt: Date.now(),
				priority: priority as any,
				category,
				dueDate
			});
			await logActivity('add', text);
		}
	},
	toggle: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const done = data.get('done') === 'true';
		
		const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
		if (task) {
			await db.update(tasks).set({ done: !done, updatedAt: Date.now() }).where(eq(tasks.id, id));
			await logActivity('toggle', task.text);
		}
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		
		const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
		if (task) {
			await db.delete(tasks).where(eq(tasks.id, id));
			await logActivity('delete', task.text);
		}
	},
	edit: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const text = data.get('text') as string;
		const priority = data.get('priority') as string;
		const category = data.get('category') as string;
		
		if (text) {
			await db.update(tasks).set({ 
				text, 
				priority: priority as any, 
				category, 
				updatedAt: Date.now() 
			}).where(eq(tasks.id, id));
			await logActivity('edit', text);
		}
	},
	reorder: async ({ request }) => {
		const data = await request.formData();
		const ids = JSON.parse(data.get('ids') as string) as number[];
		
		for (let i = 0; i < ids.length; i++) {
			await db.update(tasks).set({ sortOrder: ids.length - i }).where(eq(tasks.id, ids[i]));
		}
		await logActivity('reorder', `${ids.length} uppgifter`);
		return { success: true };
	}
};
