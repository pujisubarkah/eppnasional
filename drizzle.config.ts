import "dotenv/config";

export default {
  schema: "./src/db/schema", // Lokasi schema
  out: "./drizzle",          // Output migrasi
  driver: "pg",              // PostgreSQL driver
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
};