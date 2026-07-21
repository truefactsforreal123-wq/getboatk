import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? "postgresql://postgres.llczpwuromcwiovpkdxf:3ze2Co37moLk1e74@aws-0-eu-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false } as Record<string, unknown>,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const cats = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { items: true } } },
  });

  let total = 0;
  console.log("Menu item count by category:\n");
  for (const c of cats) {
    console.log(`  ${c._count.items} — ${c.nameAr}`);
    total += c._count.items;
  }
  console.log(`\nTotal: ${total} items across ${cats.length} categories`);
  await prisma.$disconnect();
}

main();
