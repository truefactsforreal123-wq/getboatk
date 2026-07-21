"use client";

import { useState } from "react";
import type { Branch, RestaurantTable } from "@prisma/client";
import { useAdminT } from "@/lib/use-admin-t";
import { getAdminLang } from "@/lib/admin-strings";
import {
  createTable,
  toggleTableActive,
  generateTables,
} from "@/lib/actions";
import { QrCode, Plus, Power, PowerOff, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { DownloadTableQRPDF } from "@/components/download-table-qr-pdf";
import { DownloadAllQRPDF } from "@/components/download-all-qr-pdf";

type TableWithBranch = RestaurantTable & { branch: Branch };

export function TablesManager({
  tables,
  branches,
}: {
  tables: TableWithBranch[];
  branches: Branch[];
}) {
  const t = useAdminT();
  const lang = getAdminLang();
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id ?? 0);
  const [showAdd, setShowAdd] = useState(false);
  const [addMode, setAddMode] = useState<"single" | "batch">("single");
  const [newTableNum, setNewTableNum] = useState("");
  const [batchStart, setBatchStart] = useState("");
  const [batchCount, setBatchCount] = useState("5");

  const filtered = tables.filter((t) => t.branchId === selectedBranch);
  const activeBranch = branches.find((b) => b.id === selectedBranch);
  const nextTableNum = filtered.length > 0
    ? Math.max(...filtered.map((t) => t.tableNumber)) + 1
    : 1;

  async function handleCreate() {
    const num = parseInt(newTableNum);
    if (!num || num < 1) return;
    try {
      await createTable(selectedBranch, num);
      setNewTableNum("");
      setShowAdd(false);
      router.refresh();
    } catch (err) {
      console.error("Failed to create table:", err);
      alert("Failed to create table.");
    }
  }

  async function handleBatchGenerate() {
    const start = parseInt(batchStart) || nextTableNum;
    const count = parseInt(batchCount) || 1;
    if (count < 1 || count > 500) return;
    try {
      await generateTables(selectedBranch, start, count);
      setBatchStart("");
      setBatchCount("5");
      setShowAdd(false);
      router.refresh();
    } catch (err) {
      console.error("Failed to generate tables:", err);
      alert("Failed to generate tables.");
    }
  }

  async function handleToggle(id: string) {
    try {
      await toggleTableActive(id);
      router.refresh();
    } catch (err) {
      console.error("Failed to toggle table:", err);
      alert("Failed. Please try again.");
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {branches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-cocoa-900/60 p-16 text-center">
          <p className="text-lg font-bold text-cream">{t.noBranches}</p>
          <p className="mt-2 text-sm text-cocoa-300">{t.goToBranches}</p>
          <a href="/admin/branches" className="mt-6 inline-flex brand-button text-sm">{t.goToBranches}</a>
        </div>
      ) : (
      <>
      {/* Header Section */}
      <div className="rounded-2xl border border-white/8 bg-cocoa-900/60 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Branch selector + count */}
          <div className="flex items-center gap-4">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(Number(e.target.value))}
              className="rounded-xl border border-white/10 bg-cocoa-950 px-5 py-3 text-base font-bold text-cream min-w-[180px]"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.nameEn}</option>
              ))}
            </select>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-brass-400">{filtered.length}</span>
              <span className="text-sm font-bold text-cocoa-300">
                {lang === "ar" ? "طاولة" : "tables"}
              </span>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <DownloadAllQRPDF
              tables={filtered.map((tbl) => ({
                tableNumber: tbl.tableNumber,
                qrToken: tbl.qrToken,
                branchNameEn: activeBranch?.nameEn ?? "",
              }))}
              branchName={activeBranch?.nameEn ?? ""}
            />

            <a
              href={`/admin/tables/print?branch=${selectedBranch}&autoPrint=1`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-cocoa-800 px-5 py-3 text-sm font-bold text-cream hover:bg-cocoa-700 hover:border-white/15 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect width="12" height="8" x="6" y="14"/>
              </svg>
              {lang === "ar" ? "طباعة" : "Print"}
            </a>

            <button
              onClick={() => { setShowAdd(!showAdd); setAddMode("single"); }}
              className="brand-button text-sm"
            >
              <Plus size={18} />
              {lang === "ar" ? "إضافة طاولة" : "Add Table"}
            </button>
          </div>
        </div>
      </div>

      {/* Add Table Panel */}
      {showAdd && (
        <div className="rounded-2xl border border-brass-500/20 bg-cocoa-900/80 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-cream">
              {lang === "ar" ? `إضافة لـ ${activeBranch?.nameAr}` : `Add to ${activeBranch?.nameEn}`}
            </h3>
            <button onClick={() => setShowAdd(false)} className="rounded-lg p-2 text-cocoa-300 hover:text-cream hover:bg-white/5 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 p-1 bg-cocoa-950/50 rounded-xl w-fit">
            <button
              onClick={() => setAddMode("single")}
              className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-all ${
                addMode === "single" ? "bg-brass-500/20 text-brass-300 shadow-sm" : "text-cocoa-300 hover:text-cream"
              }`}
            >
              {lang === "ar" ? "طاولة واحدة" : "Single Table"}
            </button>
            <button
              onClick={() => setAddMode("batch")}
              className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-all ${
                addMode === "batch" ? "bg-brass-500/20 text-brass-300 shadow-sm" : "text-cocoa-300 hover:text-cream"
              }`}
            >
              {lang === "ar" ? "عدة طاولات" : "Multiple Tables"}
            </button>
          </div>

          {addMode === "single" ? (
            <div className="flex items-end gap-4">
              <div>
                <label className="text-xs font-bold text-cocoa-300 mb-2 block">
                  {lang === "ar" ? "رقم الطاولة" : "Table Number"}
                </label>
                <input
                  type="number"
                  min={1}
                  value={newTableNum}
                  onChange={(e) => setNewTableNum(e.target.value)}
                  placeholder={String(nextTableNum)}
                  className="w-32 rounded-xl border border-white/10 bg-cocoa-950 px-5 py-3 text-lg font-bold text-cream placeholder:text-cocoa-400"
                />
              </div>
              <button onClick={handleCreate} className="brand-button text-sm">
                {t.create}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-end gap-5">
              <div>
                <label className="text-xs font-bold text-cocoa-300 mb-2 block">
                  {lang === "ar" ? "ابدأ من رقم" : "Start from #"}
                </label>
                <input
                  type="number"
                  min={1}
                  value={batchStart}
                  onChange={(e) => setBatchStart(e.target.value)}
                  placeholder={String(nextTableNum)}
                  className="w-28 rounded-xl border border-white/10 bg-cocoa-950 px-5 py-3 text-lg font-bold text-cream placeholder:text-cocoa-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-cocoa-300 mb-2 block">
                  {lang === "ar" ? "العدد" : "Count"}
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={batchCount}
                  onChange={(e) => setBatchCount(e.target.value)}
                  className="w-28 rounded-xl border border-white/10 bg-cocoa-950 px-5 py-3 text-lg font-bold text-cream placeholder:text-cocoa-400"
                />
              </div>
              <button onClick={handleBatchGenerate} className="brand-button text-sm">
                {lang === "ar" ? `إنشاء ${batchCount} طاولة` : `Create ${batchCount} Tables`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((table) => (
          <div
            key={table.id}
            className={`group rounded-2xl border p-6 transition-all ${
              table.isActive
                ? "border-white/8 bg-cocoa-900/60 hover:border-brass-500/20 hover:bg-cocoa-900/80"
                : "border-red-500/20 bg-red-500/5 opacity-60"
            }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black ${
                  table.isActive
                    ? "bg-brass-500/15 text-brass-400"
                    : "bg-red-500/15 text-red-400"
                }`}>
                  {table.tableNumber}
                </div>
                <div>
                  <p className="text-lg font-black text-cream">
                    {t.table} {table.tableNumber}
                  </p>
                  {!table.isActive && (
                    <span className="inline-block mt-1 rounded-md bg-red-500/15 px-2 py-0.5 text-[10px] font-black text-red-400 uppercase tracking-wider">
                      {t.inactive}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href={`/admin/tables/print?table=${table.id}&autoPrint=1`}
                className="inline-flex items-center gap-2 rounded-xl bg-brass-500/10 px-4 py-2.5 text-sm font-bold text-brass-400 hover:bg-brass-500/20 transition-colors"
              >
                <QrCode size={16} />
                QR
              </a>

              <DownloadTableQRPDF
                tableNumber={table.tableNumber}
                qrToken={table.qrToken}
                branchNameEn={table.branch.nameEn}
                branchNameAr={table.branch.nameAr}
              />

              <button
                onClick={() => handleToggle(table.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                  table.isActive
                    ? "bg-white/5 text-cream hover:bg-red-500/15 hover:text-red-400"
                    : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                }`}
              >
                {table.isActive ? (
                  <>
                    <PowerOff size={16} />
                    {t.deactivate}
                  </>
                ) : (
                  <>
                    <Power size={16} />
                    {t.activate}
                  </>
                )}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-cocoa-900/40 py-16 text-center">
            <QrCode size={48} className="mx-auto mb-4 text-cocoa-600" />
            <p className="text-base font-bold text-cream">{t.noTables}</p>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
