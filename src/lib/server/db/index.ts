import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

import { appendFileSync } from 'node:fs';
if (!env.DATABASE_URL) {
	appendFileSync('/tmp/error.log', 'DB INIT ERROR: DATABASE_URL is not set\n');
}

const url = env.DATABASE_URL || 'file:local.db';
const client = createClient({ url });

export const db = drizzle(client, { schema });
