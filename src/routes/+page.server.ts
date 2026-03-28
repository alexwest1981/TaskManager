import { db } from '$lib/server/db';
import { tasks, activities, binders } from '$lib/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

import { appendFileSync } from 'node:fs';

export const load = async ({ cookies }) => {
	try {
		const binderId = Number(cookies.get('active_binder_id') || '1');
		const allBinders = await db.select().from(binders).orderBy(binders.createdAt);
		const currentBinderTasks = await db.select().from(tasks)
			.where(eq(tasks.binderId, binderId))
			.orderBy(desc(tasks.sortOrder), desc(tasks.createdAt));
		const currentBinderActivities = await db.select().from(activities)
			.where(eq(activities.binderId, binderId))
			.orderBy(desc(activities.timestamp))
			.limit(20);

		return { 
			tasks: currentBinderTasks, 
			activities: currentBinderActivities,
			binders: allBinders,
			activeBinderId: binderId
		};
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		appendFileSync('/tmp/error.log', `LOAD ERROR: ${msg}\n`);
		throw e;
	}
};

async function logActivity(binderId: number, type: 'add' | 'delete' | 'toggle' | 'edit' | 'reorder', taskText: string) {
	try {
		await db.insert(activities).values({
			id: randomUUID(),
			binderId,
			type,
			taskText,
			timestamp: Date.now()
		});
	} catch (e) {
		console.error('Failed to log activity:', e);
	}
}

export const actions = {
	add: async ({ request, cookies }) => {
		const binderId = Number(cookies.get('active_binder_id') || '1');
		const data = await request.formData();
		const text = data.get('text') as string;
		const priority = (data.get('priority') as string) || 'medium';
		const category = (data.get('category') as string) || 'Övrigt';
		const dueDateStr = data.get('dueDate') as string;
		const dueDate = dueDateStr ? new Date(dueDateStr).getTime() : null;

		if (text) {
			await db.insert(tasks).values({ 
				binderId,
				text, 
				createdAt: Date.now(), 
				updatedAt: Date.now(),
				priority: priority as 'low' | 'medium' | 'high',
				category,
				dueDate
			});
			await logActivity(binderId, 'add', text);
		}
	},
	toggle: async ({ request, cookies }) => {
		const binderId = Number(cookies.get('active_binder_id') || '1');
		const data = await request.formData();
		const id = Number(data.get('id'));
		const done = data.get('done') === 'true';
		
		const [task] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.binderId, binderId)));
		if (task) {
			await db.update(tasks).set({ done: !done, updatedAt: Date.now() }).where(eq(tasks.id, id));
			await logActivity(binderId, 'toggle', task.text);
		}
	},
	delete: async ({ request, cookies }) => {
		const binderId = Number(cookies.get('active_binder_id') || '1');
		const data = await request.formData();
		const id = Number(data.get('id'));
		
		const [task] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.binderId, binderId)));
		if (task) {
			await db.delete(tasks).where(eq(tasks.id, id));
			await logActivity(binderId, 'delete', task.text);
		}
	},
	edit: async ({ request, cookies }) => {
		const binderId = Number(cookies.get('active_binder_id') || '1');
		const data = await request.formData();
		const id = Number(data.get('id'));
		const text = data.get('text') as string;
		const priority = data.get('priority') as string;
		const category = data.get('category') as string;
		
		if (text) {
			await db.update(tasks).set({ 
				text, 
				priority: priority as 'low' | 'medium' | 'high', 
				category, 
				updatedAt: Date.now() 
			}).where(and(eq(tasks.id, id), eq(tasks.binderId, binderId)));
			await logActivity(binderId, 'edit', text);
		}
	},
	reorder: async ({ request, cookies }) => {
		const binderId = Number(cookies.get('active_binder_id') || '1');
		const data = await request.formData();
		const ids = JSON.parse(data.get('ids') as string) as number[];
		
		for (let i = 0; i < ids.length; i++) {
			await db.update(tasks).set({ sortOrder: ids.length - i }).where(and(eq(tasks.id, ids[i]), eq(tasks.binderId, binderId)));
		}
		await logActivity(binderId, 'reorder', `${ids.length} uppgifter`);
		return { success: true };
	},
	addBinder: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const color = data.get('color') as string || 'blue';

		if (name) {
			await db.insert(binders).values({ name, color, createdAt: Date.now() });
		}
	},
	deleteBinder: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const activeId = Number(cookies.get('active_binder_id') || '1');

		// 1. Safety check: Count binders
		const all = await db.select().from(binders);
		if (all.length <= 1) return { error: 'Kan inte ta bort den sista pärmen.' };

		// 2. Cascading delete (manual due to schema)
		await db.delete(activities).where(eq(activities.binderId, id));
		await db.delete(tasks).where(eq(tasks.binderId, id));
		await db.delete(binders).where(eq(binders.id, id));

		// 3. Cookie management
		if (id === activeId) {
			const remaining = await db.select().from(binders).limit(1);
			if (remaining.length > 0) {
				cookies.set('active_binder_id', remaining[0].id.toString(), { path: '/', maxAge: 31536000 });
			}
		}

		return { success: true };
	}
};
