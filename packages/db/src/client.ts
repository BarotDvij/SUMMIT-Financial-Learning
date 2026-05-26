import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

export type Database = ReturnType<typeof createDatabase>;

export function createDatabase(connectionString: string) {
  const queryClient = postgres(connectionString, {
    prepare: false,
    max: 10,
    idle_timeout: 30,
  });
  return drizzle(queryClient, { schema, casing: 'snake_case' });
}

let cached: Database | null = null;
export function getDb(connectionString = process.env.DATABASE_URL): Database {
  if (cached) return cached;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  cached = createDatabase(connectionString);
  return cached;
}
