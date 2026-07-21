import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? "postgresql://postgres.llczpwuromcwiovpkdxf:3ze2Co37moLk1e74@aws-0-eu-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false } as Record<string, unknown>,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const branches = await prisma.branch.findMany();
    console.log(`${branches.length} branches:`);
    branches.forEach((b) => console.log(`  ${b.number}. ${b.nameAr}`));

    const cats = await prisma.category.count();
    const items = await prisma.menuItem.count();
    console.log(`${cats} categories, ${items} items`);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log("ERROR:", msg);
  } finally {
    await prisma.$disconnect();
  }
}

main();
