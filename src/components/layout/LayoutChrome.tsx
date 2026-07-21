"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";

const PUBLIC_PREFIXES = ["/", "/about", "/menu", "/branches", "/login"];

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(p + "/"))
  );
}

export default function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showChrome = isPublicPath(pathname);

  return (
    <>
      {showChrome && <Navbar />}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      {showChrome && <Footer />}
      {showChrome && <WhatsAppFloat />}
    </>
  );
}
