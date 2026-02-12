import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/*.ts", // Lokasi schema files
  out: "./drizzle",          // Output migrasi
  dialect: "postgresql",     // PostgreSQL dialect
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});