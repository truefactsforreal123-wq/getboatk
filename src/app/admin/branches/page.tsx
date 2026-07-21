import { prisma } from "@/lib/prisma";
import { Sidebar } from "../sidebar";
import { BranchesEditor } from "./branches-editor";
import { T } from "@/components/admin-translate";

export const dynamic = "force-dynamic";

export default async function AdminBranches() {
  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });
  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <main className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8">
        <h1 className="text-2xl font-black text-cream"><T k="branchesTitle" /></h1>
        <p className="mt-1 text-sm text-cream/60">{branches.length} <T k="branches" /></p>
        <BranchesEditor branches={branches} />
      </main>
    </div>
  );
}
