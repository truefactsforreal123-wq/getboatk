import { getSiteUrl } from "@/lib/utils";

export const site = {
  name: "جيت بوئتك",
  nameEn: "Get Boatkeg",
  tagline: "الطعم الدمشقي الفاخر",
  hotline: "17514",
  hotlineDisplay: "17514",
  facebook: "https://web.facebook.com/getboatkeg",
  instagram: "https://instagram.com/getboatkeg",
  siteUrl: getSiteUrl(),
};

export const stats = {
  branches: 3,
  followers: 863000,
  recommendPercent: 92,
  reviewCount: 0,
  rating: 4.6,
};

export function whatsappLink(message: string): string {
  return `https://wa.me/201229222208?text=${encodeURIComponent(message)}`;
}
