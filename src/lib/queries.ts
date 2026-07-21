import "server-only";
import { prisma } from "@/lib/prisma";
import { stats } from "@/lib/data";

export async function getBranches() {
  try {
    return await prisma.branch.findMany({ orderBy: { id: "asc" } });
  } catch {
    return null;
  }
}

export async function getMenuCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        items: {
          where: { available: true },
          orderBy: { id: "asc" },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getApprovedReviews() {
  try {
    return await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    return null;
  }
}

export async function getStats() {
  try {
    const [branches, reviews, avgRating] = await Promise.all([
      prisma.branch.count(),
      prisma.review.count({ where: { approved: true } }),
      prisma.review.aggregate({
        where: { approved: true },
        _avg: { rating: true },
      }),
    ]);
    return {
      branches,
      followers: stats.followers,
      recommendPercent: stats.recommendPercent,
      reviewCount: reviews,
      rating: avgRating._avg.rating ?? stats.rating,
    };
  } catch {
    return stats;
  }
}
