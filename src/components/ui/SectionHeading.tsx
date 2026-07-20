import Khatam from "./Khatam";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  tone?: "light" | "dark";
  id?: string;
};

export default function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "center",
  tone = "light",
  id,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal
      className={`flex flex-col gap-4 ${
        centered ? "items-center text-center" : "items-start text-start"
      }`}
    >
      <span
        className={`inline-flex items-center gap-2.5 text-sm font-bold tracking-wide ${
          tone === "light" ? "text-brass-600" : "text-brass-400"
        }`}
        aria-hidden="true"
      >
        <Khatam className="size-3.5" />
        {kicker}
      </span>
      <h2
        id={id}
        className={`font-display font-bold leading-[1.25] text-balance ${
          tone === "light" ? "text-cocoa-900" : "text-cream-50"
        }`}
        style={{ fontSize: "var(--text-section)" }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`max-w-2xl leading-relaxed ${
            tone === "light" ? "text-cocoa-500" : "text-cream-200/80"
          }`}
          style={{ fontSize: "var(--text-body)" }}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
