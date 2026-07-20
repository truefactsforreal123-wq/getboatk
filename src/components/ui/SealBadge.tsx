"use client";

import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import Khatam from "./Khatam";

type SealBadgeProps = {
  text: string;
  className?: string;
};

/** Rotating circular brand seal — "Kings of Shawarma since 1982". */
export default function SealBadge({ text, className = "" }: SealBadgeProps) {
  const id = useId();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative ${className}`} role="img" aria-label="Brand seal">
      <svg
        viewBox="0 0 100 100"
        className={`size-full ${shouldReduceMotion ? "" : "animate-rotate-slow"}`}
      >
        <defs>
          <path
            id={id}
            d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0"
            fill="none"
          />
        </defs>
        <text className="fill-current text-[9px] font-bold tracking-[0.14em]">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
        <Khatam className="size-[22%]" />
      </div>
    </div>
  );
}
