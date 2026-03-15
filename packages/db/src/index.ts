import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import path from "node:path";
import pg from "pg";
import { fileURLToPath } from "node:url";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prefer package-local env first, then current working directory fallback.
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prismaClient = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});