import Khatam from "./Khatam";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  tone?: "light" | "dark";
};

export default function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "center",
  tone = "light",
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
      >
        <Khatam className="size-3.5" />
        {kicker}
      </span>
      <h2
        className={`font-display text-4xl md:text-5xl font-bold leading-[1.25] text-balance ${
          tone === "light" ? "text-cocoa-900" : "text-cream-50"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`max-w-2xl text-base md:text-lg leading-relaxed ${
            tone === "light" ? "text-cocoa-500" : "text-cream-200/80"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
