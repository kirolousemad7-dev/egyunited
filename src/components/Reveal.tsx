"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useClientReducedMotion } from "@/lib/use-client-reduced-motion";

export function Reveal({ children, className }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useClientReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 1, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01 }}
      transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
