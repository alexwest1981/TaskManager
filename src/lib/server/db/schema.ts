import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	text: text('text').notNull(),
	done: integer('done', { mode: 'boolean' }).notNull().default(false),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: integer('created_at').notNull().default(Date.now()),
	priority: text('priority').notNull().default('medium'),
	category: text('category').notNull().default('Övrigt'),
	dueDate: integer('due_date'),
	updatedAt: integer('updated_at').notNull().default(Date.now())
});

export const activities = sqliteTable('activity_log', {
	id: text('id').primaryKey(), // Using UUID or similar
	type: text('type').notNull(),
	taskText: text('task_text').notNull(),
	timestamp: integer('timestamp').notNull().default(Date.now())
});
