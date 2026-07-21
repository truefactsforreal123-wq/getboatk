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
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <main className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8">
        <h1 className="text-2xl font-black text-cream"><T k="reviewsTitle" /></h1>
        <p className="mt-1 text-sm text-cream/60">
          {reviews.filter((r) => r.approved).length} <T k="approved" />, {reviews.filter((r) => !r.approved).length} <T k="pending" />
        </p>
        <ReviewsEditor reviews={reviews} branches={branches} />
      </main>
    </div>
  );
}
