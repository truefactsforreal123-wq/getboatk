import { prisma } from "@/lib/prisma";
import { Sidebar } from "../sidebar";
import { ReviewsEditor } from "./reviews-editor";
import { T } from "@/components/admin-translate";

export const dynamic = "force-dynamic";

export default async function AdminReviews() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { branch: true },
  });
  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="flex min-h-screen bg-cocoa-950">
      <Sidebar />
      <main className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8">
        <div className="rounded-2xl border border-brass-500/10 bg-gradient-to-bl from-cocoa-900 via-cocoa-900/80 to-cocoa-950 p-6 lg:p-8">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-cream"><T k="reviewsTitle" /></h1>
          <p className="mt-2 text-sm text-cocoa-300">
            {reviews.filter((r) => r.approved).length} <T k="approved" />, {reviews.filter((r) => !r.approved).length} <T k="pending" />
          </p>
        </div>
        <ReviewsEditor reviews={reviews} branches={branches} />
      </main>
    </div>
  );
}
