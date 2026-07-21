"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Download } from "lucide-react";
import { getSiteUrl } from "@/lib/utils";

const BASE_URL = getSiteUrl();

interface TableInfo {
  tableNumber: number;
  qrToken: string;
  branchNameEn: string;
}

export function DownloadAllQRPDF({
  tables,
  branchName,
}: {
  tables: TableInfo[];
  branchName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function downloadAll() {
    if (tables.length === 0) return;
    setLoading(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 100],
      });

      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        if (i > 0) pdf.addPage([80, 100], "portrait");

        const url = `${BASE_URL}/table/${table.tableNumber}?token=${table.qrToken}`;
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 800,
          margin: 2,
          errorCorrectionLevel: "H",
          color: { dark: "#1b0f07", light: "#ffffff" },
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
        pdf.text(String(table.tableNumber), 40, 78, { align: "center" });

        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.setFont("helvetica", "normal");
        pdf.text("TABLE", 40, 83, { align: "center" });

        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        pdf.setFont("helvetica", "bold");
        pdf.text(branchName.toUpperCase(), 40, 91, { align: "center" });
      }

      pdf.save(`QR-${branchName.replace(/\s+/g, "-")}-${tables.length}-tables.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDFs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={downloadAll}
      disabled={loading || tables.length === 0}
      className="flex items-center gap-1.5 rounded-lg bg-brass-500/10 px-3 py-2 text-xs font-bold text-brass-400 hover:bg-brass-500/20 transition-colors disabled:opacity-40"
    >
      <Download size={14} />
      {loading ? "..." : `Download QR (${tables.length})`}
    </button>
  );
}
