import { prisma } from "@/lib/prisma";
import { TablesManager } from "./TablesManager";
import { Sidebar } from "../sidebar";
import { T } from "@/components/admin-translate";

export default async function AdminTablesPage() {
  const [tables, branches] = await Promise.all([
    prisma.restaurantTable.findMany({
      include: { branch: true },
      orderBy: [{ branchId: "asc" }, { tableNumber: "asc" }],
    }),
    prisma.branch.findMany({ orderBy: { id: "asc" } }),
  ]);

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <div className="flex-1 p-4 pt-16 lg:p-10 lg:pt-10">
        <div>
          <h1 className="text-2xl font-black text-cream"><T k="tablesTitle" /></h1>
          <p className="mt-1 text-sm text-cream">
            {tables.length} <T k="tables" /> <T k="inWord" /> {branches.length} <T k="branches" />
          </p>
        </div>
        <TablesManager tables={tables} branches={branches} />
      </div>
    </div>
  );
}
