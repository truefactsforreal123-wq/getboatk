"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

type CounterProps = {
  value: number;
  suffix?: string;
  className?: string;
};

export default function Counter({ value, suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();
  const spring = useSpring(motionValue, {
    damping: 32,
    stiffness: 90,
  });

  useEffect(() => {
    if (inView) {
      if (shouldReduceMotion) {
        motionValue.set(value);
      } else {
        motionValue.set(value);
      }
    }
  }, [inView, value, motionValue, shouldReduceMotion]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = String(Math.round(v));
      }
    });
    return unsubscribe;
  }, [spring]);

  return (
    <span className={className} dir="ltr">
      <span ref={ref} aria-label={`${value}${suffix}`}>
        0
      </span>
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}
