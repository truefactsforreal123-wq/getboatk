import { execSync } from "child_process";

const vars = {
  NEXT_PUBLIC_SITE_URL: "https://getboatk.vercel.app",
  NEXT_PUBLIC_SUPABASE_URL: "https://llczpwuromcwiovpkdxf.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_YUbir4dV8W5kmDqt6gzqmw_ay-dSgak",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsY3pwd3Vyb21jd2lvdnBrZHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1Nzk3MDMsImV4cCI6MjEwMDE1NTcwM30.hrx2-JDURQIhIHj7RmJLzdGwTsSvoCVOZ7ipFf_6fn4",
  SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsY3pwd3Vyb21jd2lvdnBrZHhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDU3OTcwMywiZXhwIjoyMTAwMTU1NzAzfQ.5FA7twMSGyU0NbhbFHUJh63ijZxtK1f3ztZgmkUa90Q",
  DATABASE_URL: "postgresql://postgres.llczpwuromcwiovpkdxf:3ze2Co37moLk1e74@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1",
  DIRECT_URL: "postgresql://postgres.llczpwuromcwiovpkdxf:3ze2Co37moLk1e74@aws-0-eu-west-1.pooler.supabase.com:5432/postgres",
};

for (const [key, value] of Object.entries(vars)) {
  try {
    const cmd = `npx vercel env add ${key} production --force`;
    const input = key.startsWith("NEXT_PUBLIC_") ? "n\n" : "y\n";
    execSync(cmd, { input, stdio: ["pipe", "inherit", "inherit"], env: { ...process.env, [key]: value } });
    console.log(`Set ${key}`);
  } catch (e) {
    console.error(`Failed ${key}:`, e instanceof Error ? e.message : String(e));
  }
}
