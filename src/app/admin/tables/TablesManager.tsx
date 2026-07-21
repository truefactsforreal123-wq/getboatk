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
import { QrCode, Plus, Power, PowerOff, X, Table2 } from "lucide-react";
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
    <div className="mt-8 space-y-5">
      {branches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-ink-900 p-12 text-center">
          <p className="text-base font-bold text-cream">{t.noBranches}</p>
          <p className="mt-1 text-sm text-cream">{t.goToBranches}</p>
          <a href="/admin/branches" className="mt-4 inline-flex brand-button text-sm">{t.goToBranches}</a>
        </div>
      ) : (
      <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(Number(e.target.value))}
          className="rounded-lg border border-dashed border-white/15 bg-ink-900 px-4 py-2.5 text-sm font-bold text-cream"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.nameEn}</option>
          ))}
        </select>

        <span className="text-sm font-bold text-cream">
          {filtered.length} {lang === "ar" ? "طاولة" : "tables"}
        </span>

        <div className="flex-1" />

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
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-cream hover:bg-white/10 hover:text-cream transition-colors"
        >
          {lang === "ar" ? "طباعة" : "Print"}
        </a>

        <button
          onClick={() => { setShowAdd(!showAdd); setAddMode("single"); }}
          className="brand-button text-sm"
        >
          <Plus size={16} />
          {lang === "ar" ? "إضافة طاولة" : "Add Table"}
        </button>
      </div>

      {/* Add Table Panel */}
      {showAdd && (
        <div className="rounded-xl border border-white/15 bg-ink-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-cream">
              {lang === "ar" ? `إضافة لـ ${activeBranch?.nameAr}` : `Add to ${activeBranch?.nameEn}`}
            </h3>
            <button onClick={() => setShowAdd(false)} className="text-cream hover:text-cream">
              <X size={16} />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setAddMode("single")}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                addMode === "single" ? "bg-brand-500/15 text-gold-300" : "bg-white/5 text-cream"
              }`}
            >
              {lang === "ar" ? "طاولة واحدة" : "Single Table"}
            </button>
            <button
              onClick={() => setAddMode("batch")}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                addMode === "batch" ? "bg-brand-500/15 text-gold-300" : "bg-white/5 text-cream"
              }`}
            >
              {lang === "ar" ? "عدة طاولات" : "Multiple Tables"}
            </button>
          </div>

          {addMode === "single" ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-cream">
                {lang === "ar" ? "رقم" : "#"}
              </span>
              <input
                type="number"
                min={1}
                value={newTableNum}
                onChange={(e) => setNewTableNum(e.target.value)}
                placeholder={String(nextTableNum)}
                className="w-28 rounded-lg border border-dashed border-white/15 bg-ink-950 px-4 py-2.5 text-base font-bold text-cream placeholder:text-cream"
              />
              <button onClick={handleCreate} className="brand-button text-sm">
                {t.create}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="text-xs font-bold text-cream mb-1 block">
                  {lang === "ar" ? "ابدأ من رقم" : "Start from #"}
                </label>
                <input
                  type="number"
                  min={1}
                  value={batchStart}
                  onChange={(e) => setBatchStart(e.target.value)}
                  placeholder={String(nextTableNum)}
                  className="w-24 rounded-lg border border-dashed border-white/15 bg-ink-950 px-4 py-2.5 text-base font-bold text-cream placeholder:text-cream"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-cream mb-1 block">
                  {lang === "ar" ? "العدد" : "Count"}
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={batchCount}
                  onChange={(e) => setBatchCount(e.target.value)}
                  className="w-24 rounded-lg border border-dashed border-white/15 bg-ink-950 px-4 py-2.5 text-base font-bold text-cream placeholder:text-cream"
                />
              </div>
              <button onClick={handleBatchGenerate} className="brand-button text-sm">
                {lang === "ar" ? `إنشاء ${batchCount} طاولة` : `Create ${batchCount} Tables`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((table) => (
          <div
            key={table.id}
            className={`group relative overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-xl ${
              table.isActive
                ? "border-white/10 bg-cocoa-900 hover:border-brass-500/30"
                : "border-red-500/20 bg-cocoa-900/60 opacity-50"
            }`}
          >
            <div className={`absolute inset-x-0 top-0 h-1 ${table.isActive ? "bg-brass-500" : "bg-red-500/40"}`} />
            <div className="p-5 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brass-500/10">
                  <Table2 size={22} className="text-brass-400" />
                </div>
                <span className="text-3xl font-black text-cream">{table.tableNumber}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm font-bold text-cream">{t.table} {table.tableNumber}</span>
                {!table.isActive && (
                  <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-[10px] font-black text-red-400">
                    {t.inactive}
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <a
                  href={`/admin/tables/print?table=${table.id}&autoPrint=1`}
                  className="flex items-center gap-1.5 rounded-lg bg-brass-500/10 px-3 py-2 text-xs font-bold text-brass-400 hover:bg-brass-500/20 transition-colors"
                >
                  <QrCode size={14} />
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
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                    table.isActive
                      ? "bg-white/5 text-cream hover:bg-red-500/15 hover:text-red-400"
                      : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                  }`}
                >
                  {table.isActive ? (
                    <>
                      <PowerOff size={14} />
                      {t.deactivate}
                    </>
                  ) : (
                    <>
                      <Power size={14} />
                      {t.activate}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-base text-cream">
            {t.noTables}
          </p>
        )}
      </div>
      </>
      )}
    </div>
  );
}
