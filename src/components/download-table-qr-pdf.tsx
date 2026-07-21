"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { FileDown } from "lucide-react";
import { getSiteUrl } from "@/lib/utils";

const BASE_URL = getSiteUrl();

export function DownloadTableQRPDF({
  tableNumber,
  qrToken,
  branchNameEn,
}: {
  tableNumber: number;
  qrToken: string;
  branchNameEn: string;
  branchNameAr?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function downloadPDF() {
    setLoading(true);
    try {
      const url = `${BASE_URL}/table/${tableNumber}?token=${qrToken}`;

      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 800,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#1b0f07", light: "#ffffff" },
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 100],
      });

      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, 80, 100, "F");

      pdf.addImage(qrDataUrl, "PNG", 15, 10, 50, 50);

      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.line(15, 64, 65, 64);

      pdf.setFontSize(32);
      pdf.setTextColor(27, 15, 7);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(tableNumber), 40, 78, { align: "center" });

      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont("helvetica", "normal");
      pdf.text("TABLE", 40, 83, { align: "center" });

      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.setFont("helvetica", "bold");
      pdf.text(branchNameEn.toUpperCase(), 40, 91, { align: "center" });

      pdf.save(`Table-${tableNumber}-${branchNameEn.replace(/\s+/g, "-")}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={downloadPDF}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-cream hover:bg-white/10 hover:text-cream transition-colors disabled:opacity-40"
    >
      <FileDown size={14} />
      {loading ? "..." : "PDF"}
    </button>
  );
}
