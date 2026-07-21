import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "crypto";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding QR ordering tables …\n");

  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });
  if (branches.length === 0) {
    console.log("No branches found. Run 'prisma db seed' first.");
    return;
  }

  const existingTables = await prisma.restaurantTable.count();
  if (existingTables > 0) {
    console.log(`Already have ${existingTables} tables. Skipping table seed.`);
    return;
  }

  for (const branch of branches) {
    for (let num = 1; num <= 4; num++) {
      await prisma.restaurantTable.create({
        data: {
          branchId: branch.id,
          tableNumber: num,
          qrToken: crypto.randomBytes(8).toString("hex"),
        },
      });
    }
    console.log(`  ${branch.nameEn}: 4 tables seeded`);
  }

  console.log(`\n${branches.length * 4} tables seeded across ${branches.length} branches`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
