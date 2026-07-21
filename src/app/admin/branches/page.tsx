import { prisma } from "@/lib/prisma";
import { Sidebar } from "../sidebar";
import { BranchesEditor } from "./branches-editor";
import { T } from "@/components/admin-translate";

export const dynamic = "force-dynamic";

export default async function AdminBranches() {
  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });
  return (
    <div className="flex min-h-screen bg-cocoa-950">
      <Sidebar />
      <main className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8">
        <div className="rounded-2xl border border-brass-500/10 bg-gradient-to-bl from-cocoa-900 via-cocoa-900/80 to-cocoa-950 p-6 lg:p-8">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-cream"><T k="branchesTitle" /></h1>
          <p className="mt-2 text-sm text-cocoa-300">{branches.length} <T k="branches" /></p>
        </div>
        <BranchesEditor branches={branches} />
      </main>
    </div>
  );
}
