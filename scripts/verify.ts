import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const tables = await p.restaurantTable.findMany({
    include: { branch: true },
    orderBy: [{ branchId: 'asc' }, { tableNumber: 'asc' }]
  });
  for (const t of tables) {
    console.log(
      t.branch.nameEn.padEnd(25),
      'Table', String(t.tableNumber).padStart(2),
      '|', t.qrToken,
      t.isActive ? '' : '(inactive)'
    );
  }
  console.log(`\nTotal: ${tables.length} tables`);

  const settings = await p.systemSetting.findMany();
  console.log('\nSettings:');
  for (const s of settings) console.log(`  ${s.key} =`, s.value);
}

main().finally(() => p.$disconnect());
