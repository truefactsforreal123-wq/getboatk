import type { Metadata, Viewport } from "next";
import { Amiri, Tajawal } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  display: "swap",
});

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "جيت بوئتك — الطعم الدمشقي الفاخر | ملوك الشاورما منذ 1982",
    template: "%s | جيت بوئتك",
  },
  description:
    "مطاعم جيت بوئتك — الطعم الدمشقي الفاخر من سوريا والأردن إلى مصر والسعودية. ملوك الشاورما منذ 1982. خط ساخن 17514.",
  keywords: [
    "جيت بوئتك",
    "شاورما",
    "مطعم سوري",
    "دامشقي",
    "شاورما عالفحم",
    "17514",
    "Get Boatkeg",
    "shawarma Cairo",
  ],
};

export const viewport: Viewport = {
  themeColor: "#3a2313",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${amiri.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream-50 text-cocoa-900 font-body">
        {/* Skip link for keyboard users */}
        <a href="#main-content" className="skip-link">
          المحتوى الرئيسي
        </a>

        <LanguageProvider>
          <Navbar />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
        </LanguageProvider>
      </body>
    </html>
  );
}
