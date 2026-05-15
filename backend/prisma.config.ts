import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Prisma CLI peut avoir un cwd différent ; on charge .env depuis plusieurs emplacements possibles.
loadEnv({ path: path.resolve(process.cwd(), '.env') });
loadEnv({ path: path.resolve(process.cwd(), 'backend', '.env') });

// generate ne contacte pas la BDD ; un fallback évite l'échec Docker/CI sans DATABASE_URL.
const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://prisma:prisma@127.0.0.1:5432/prisma?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
