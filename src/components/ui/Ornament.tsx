import Khatam from "./Khatam";

export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-current opacity-25" />
      <Khatam className="size-3.5 shrink-0 opacity-70" />
      <span className="h-px flex-1 bg-current opacity-25" />
    </div>
  );
}
