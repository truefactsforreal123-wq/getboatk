"use client";

import { useId } from "react";
import Khatam from "./Khatam";

type SealBadgeProps = {
  text: string;
  className?: string;
};

/** Rotating circular brand seal — "Kings of Shawarma since 1982". */
export default function SealBadge({ text, className = "" }: SealBadgeProps) {
  const id = useId();
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="size-full animate-rotate-slow">
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
      <div className="absolute inset-0 grid place-items-center">
        <Khatam className="size-[22%]" />
      </div>
    </div>
  );
}
