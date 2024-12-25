// import * as dotenv from 'dotenv';
// import { eq } from 'drizzle-orm/expressions';
// import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
// import { migrate } from 'drizzle-orm/node-postgres/migrator';
// import path from 'path';
// import pg from 'pg';
// import { exit } from 'process';

// import {
//   contacts,
//   contactTypeEnum, // Import the enum for contact types
// } from './schema';

// dotenv.config();

// (async () => {
//   try {
//     const pool = new pg.Pool({
//       connectionString: process.env.DATABASE_URL,
//     });
//     const db: NodePgDatabase<Record<string, unknown>> = drizzle(pool, {
//       schema: {
//         contacts,
//       },
//     });

//     // Look for migrations in the src/drizzle/migrations folder
//     const migrationPath = path.join(process.cwd(), 'src/drizzle/migrations');

//     // Run the migrations
//     await migrate(db, { migrationsFolder: migrationPath });

//     // Insert default data based on schema
//     const defaultContacts = [
//       {
//         id: 1,
//         name: 'John Doe',
//         contactType: contactTypeEnum.enumValues[0], // Use enum values
//         contactInformation: 'john.doe@example.com',
//       },
//       {
//         id: 2,
//         name: 'Jane Smith',
//         contactType: contactTypeEnum.enumValues[1], // Use enum values
//         contactInformation: '555-1234',
//       },
//     ];

//     for (const contact of defaultContacts) {
//       const existingContact = await db
//         .select({
//           id: contacts.id,
//         })
//         .from(contacts)
//         .where(eq(contacts.id, contact.id))
//         .execute();
//       if (!existingContact.length) {
//         await db.insert(contacts).values(contact).execute();
//       }
//     }

//     console.log('Migration complete');
//   } catch (error) {
//     console.error('Migration failed:', error);
//   } finally {
//     exit(0);
//   }
// })();
