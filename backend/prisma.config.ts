import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Prisma CLI peut avoir un cwd différent ; on charge .env depuis plusieurs emplacements possibles.
loadEnv({ path: path.resolve(process.cwd(), '.env') });
loadEnv({ path: path.resolve(process.cwd(), 'backend', '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
