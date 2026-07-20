import { useReducedMotion } from "framer-motion";
import Khatam from "./Khatam";

/**
 * Endless brand strip. The track is forced LTR so the -50% translate
 * loop math stays correct under RTL pages; item text stays natural.
 */
export default function Marquee({ items }: { items: readonly string[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      dir="ltr"
      className="overflow-hidden border-y border-cocoa-700/60 bg-cocoa-900 py-4"
      role="marquee"
      aria-label="Brand messages"
    >
      <div
        className={`flex w-max ${shouldReduceMotion ? "" : "animate-marquee"}`}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 ? "true" : undefined}>
            {items.map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-8 whitespace-nowrap px-8 text-sm font-medium tracking-wide text-cream-100 md:text-base"
              >
                {item}
                <Khatam className="size-3 shrink-0 text-brass-500" aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
