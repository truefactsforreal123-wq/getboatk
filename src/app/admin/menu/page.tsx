import { prisma } from "@/lib/prisma";
import { MenuEditor } from "./menu-editor";
import { Sidebar } from "../sidebar";
import { T } from "@/components/admin-translate";

export const dynamic = "force-dynamic";

export default async function AdminMenu() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        orderBy: { id: "asc" },
      },
    },
  });

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <main className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-cream"><T k="menuEditor" /></h1>
            <p className="mt-1 text-sm text-cream/45">
              {categories.length} <T k="categories" />, {categories.reduce((s, c) => s + c.items.length, 0)} <T k="items" />
            </p>
          </div>
        </div>
        <MenuEditor categories={categories} />
      </main>
    </div>
  );
}
