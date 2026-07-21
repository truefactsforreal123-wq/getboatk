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
    <div className="flex min-h-screen bg-cocoa-950">
      <Sidebar />
      <main className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8">
        <div className="rounded-2xl border border-brass-500/10 bg-gradient-to-bl from-cocoa-900 via-cocoa-900/80 to-cocoa-950 p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-2 w-2 rounded-full bg-brass-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-brass-400/70"><T k="menuEditor" /></span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-cream"><T k="menuEditor" /></h1>
          <p className="mt-2 text-sm text-cocoa-300">
            {categories.length} <T k="categories" />, {categories.reduce((s, c) => s + c.items.length, 0)} <T k="items" />
          </p>
        </div>
        <MenuEditor categories={categories} />
      </main>
    </div>
  );
}
