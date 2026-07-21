/* eslint-disable @next/next/no-page-custom-font */
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/utils";
import { t } from "@/lib/admin-strings";
import QRCode from "qrcode";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const BASE_URL = getSiteUrl();

export default async function PrintQRCodesPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string; branch?: string; autoPrint?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { table: singleTableId, branch: branchId, autoPrint } = await searchParams;

  const where: Record<string, unknown> = {};

  if (singleTableId) {
    where.id = singleTableId;
  } else if (branchId) {
    where.branchId = Number(branchId);
    where.isActive = true;
  } else {
    where.isActive = true;
  }

  const tables = await prisma.restaurantTable.findMany({
    where,
    include: { branch: true },
    orderBy: [{ branchId: "asc" }, { tableNumber: "asc" }],
  });

  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });

  const qrDataUrls: Record<string, string> = {};

  for (const table of tables) {
    const url = `${BASE_URL}/table/${table.tableNumber}?token=${table.qrToken}`;
    const svg = await QRCode.toString(url, {
      type: "svg",
      width: 200,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#1a1a1a", light: "#ffffff" },
    });
    const b64 = Buffer.from(svg).toString("base64");
    qrDataUrls[table.id] = `data:image/svg+xml;base64,${b64}`;
  }

  const branchName = branchId
    ? branches.find((b) => b.id === Number(branchId))?.nameEn ?? t.branch
    : t.allBranches;

  return (
    <html lang="en" dir="ltr">
      <head>
        <title>{t.printPageTitle} — {branchName}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: #f0f0f0;
          }
          .no-print {
            position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            display: flex; gap: 10px; align-items: center; justify-content: center;
            padding: 16px; background: rgba(14,7,7,0.95); backdrop-filter: blur(8px);
          }
          .no-print button, .no-print a {
            background: #c1272d; color: white; border: none; padding: 10px 24px;
            border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer;
            text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
            transition: all 0.15s;
          }
          .no-print button:hover, .no-print a:hover { background: #a81f24; transform: translateY(-1px); }
          .no-print select {
            padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);
            font-size: 13px; font-weight: 600; background: rgba(255,255,255,0.1);
            color: white; cursor: pointer;
          }
          .no-print select option { background: #1a1a1a; color: white; }

          .header {
            text-align: center; padding: 80px 24px 32px;
            border-bottom: 1px solid #e0e0e0; margin-bottom: 32px;
          }
          .header h1 { font-size: 20px; color: #0e0707; font-weight: 800; letter-spacing: -0.3px; }
          .header p { font-size: 12px; color: #999; margin-top: 6px; font-weight: 500; }

          .grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            padding: 16px; gap: 20px;
            justify-content: center; max-width: 1200px; margin: 0 auto;
          }

          .card {
            border: 1px solid #e5e5e5; border-radius: 16px;
            padding: 20px 16px; text-align: center; break-inside: avoid;
            page-break-inside: avoid; background: white;
            display: flex; flex-direction: column; align-items: center; gap: 8px;
            transition: box-shadow 0.2s;
          }
          .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
          .card .branch-name {
            font-size: 11px; color: #999; font-weight: 600;
            text-transform: uppercase; letter-spacing: 0.5px;
          }
          .card .qr-wrap {
            width: 140px; height: 140px; margin: 4px 0;
            border-radius: 12px; overflow: hidden;
            border: 1px solid #f0f0f0;
          }
          .card .qr-wrap img { width: 100%; height: 100%; display: block; }
          .card .table-num {
            font-size: 22px; font-weight: 900; color: #0e0707;
            letter-spacing: -0.5px; margin-top: 2px;
          }
          .card .table-label {
            font-size: 10px; color: #bbb; font-weight: 600;
            text-transform: uppercase; letter-spacing: 1px;
          }

          @media print {
            .no-print { display: none !important; }
            body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .header { padding: 16px 0; margin-bottom: 16px; border-bottom: 1px solid #eee; }
            .grid { gap: 12px; padding: 8px; }
            .card {
              border: 1px solid #e0e0e0; border-radius: 12px;
              padding: 16px 12px; box-shadow: none;
            }
            .card:hover { box-shadow: none; }
            @page { margin: 10mm; size: A4; }
          }
        `}</style>
      </head>
      <body>
        <div className="no-print">
          <select
            onChange={(e) => {
              if (e.target.value) {
                window.location.href = `/admin/tables/print?branch=${e.target.value}`;
              } else {
                window.location.href = "/admin/tables/print";
              }
            }}
            defaultValue={branchId ?? ""}
          >
            <option value="">{t.allBranches}</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nameEn} ({tables.filter((t) => t.branchId === b.id).length} {t.tablesCount})
              </option>
            ))}
          </select>
          <button onClick={() => window.print()}>{t.print}</button>
          <a href="/admin/tables">{t.backToTables}</a>
        </div>

        <div className="header">
          <h1>جيت بوتك — Get Boat Keg</h1>
          <h2 style={{ fontSize: '14px', color: '#666', fontWeight: 600, marginTop: 4 }}>{branchName}</h2>
          <p>{tables.length} {t.tablesCount}</p>
        </div>

        <div className="grid">
          {tables.map((table) => (
            <div key={table.id} className="card">
              <span className="branch-name">{table.branch.nameEn}</span>
              <div className="qr-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrls[table.id]}
                  alt={`QR Code for Table ${table.tableNumber}`}
                />
              </div>
              <span className="table-label">{t.table}</span>
              <span className="table-num">{table.tableNumber}</span>
            </div>
          ))}

          {tables.length === 0 && (
              <p style={{ padding: 48, color: "#999", textAlign: "center", width: "100%" }}>
                {t.noTablesToPrint}
              </p>
          )}
        </div>
        {autoPrint === "1" && (
          <script dangerouslySetInnerHTML={{ __html: "window.onload = function() { setTimeout(function() { window.print(); }, 500); };" }} />
        )}
      </body>
    </html>
  );
}
