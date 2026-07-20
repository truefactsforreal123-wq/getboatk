"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  direction?: "up" | "down" | "left" | "right";
};

export default function Reveal({
  children,
  className,
  delay = 0,
  y,
  x,
  scale,
  direction = "up",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  // Calculate initial position based on direction
  const getInitial = () => {
    if (shouldReduceMotion) return { opacity: 1 };

    const distance = 28;

    if (y !== undefined) return { opacity: 0, y };
    if (x !== undefined) return { opacity: 0, x };
    if (scale !== undefined) return { opacity: 0, scale };

    switch (direction) {
      case "down":
        return { opacity: 0, y: -distance };
      case "left":
        return { opacity: 0, x: distance };
      case "right":
        return { opacity: 0, x: -distance };
      case "up":
      default:
        return { opacity: 0, y: distance };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitial()}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
