"use client";

import { useId } from "react";

/**
 * Subtle Damascene eight-point-star tile. Inherits color from `currentColor`
 * — control presence with text color + opacity utilities.
 */
export default function Pattern({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id={id}
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="currentColor" strokeWidth={1}>
            <rect x="25" y="25" width="14" height="14" rx="1" />
            <rect
              x="25"
              y="25"
              width="14"
              height="14"
              rx="1"
              transform="rotate(45 32 32)"
            />
            <circle cx="32" cy="32" r="2" fill="currentColor" stroke="none" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
