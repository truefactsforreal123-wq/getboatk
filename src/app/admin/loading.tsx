import { T } from "@/components/admin-translate";

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
        <p className="text-sm font-bold text-cream"><T k="loading" /></p>
      </div>
    </div>
  );
}
