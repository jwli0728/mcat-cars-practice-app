import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mcat_cars';

async function main() {
  console.log('Running migrations...');

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  await migrate(db, { migrationsFolder: './src/db/migrations' });

  console.log('Migrations completed!');
  await sql.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
