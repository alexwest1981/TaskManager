import { db } from './src/lib/server/db/index.js';
import { binders } from './src/lib/server/db/schema.js';

async function seed() {
	console.log('Seeding default binder...');
	await db.insert(binders).values({
		id: 1,
		name: 'Huvudpärm',
		color: 'blue'
	}).onConflictDoNothing();
	console.log('Seed complete.');
	process.exit(0);
}

seed().catch(err => {
	console.error('Seed failed:', err);
	process.exit(1);
});
