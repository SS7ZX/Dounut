import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This connects to the DATABASE_URL we will put in our .env file later
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });