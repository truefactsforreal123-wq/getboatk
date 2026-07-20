"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

type CounterProps = {
  value: number;
  suffix?: string;
  className?: string;
};

export default function Counter({ value, suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 32, stiffness: 90 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = String(Math.round(v));
    });
    return unsubscribe;
  }, [spring]);

  return (
    <span className={className} dir="ltr">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}
