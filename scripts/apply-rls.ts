import { readFileSync } from "fs";
import { join } from "path";
import pg from "pg";

const { Pool } = pg;

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  try {
    const sql = readFileSync(join(__dirname, "..", "supabase", "migrations", "20260718221000_rls_policies.sql"), "utf-8");
    console.log("Applying RLS policies...");
    await pool.query(sql);
    console.log("RLS policies applied.");
  } catch (err) {
    console.error("Failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}
run();
