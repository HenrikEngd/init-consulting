"use client";

import { motion } from "framer-motion";
import { FigureGridPlatform } from "@/components/ui/IsometricFigures";

const EASE = [0.165, 0.84, 0.44, 1] as const;

export function HeroVisual() {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      /* Behind the copy, which lands line by line ahead of it. */
      transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
      className="relative mt-8 w-full sm:mt-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[70%] w-[72%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.045),transparent_68%)] blur-2xl"
      />

      <FigureGridPlatform className="mx-auto mt-2 h-auto w-full max-w-[1120px]" />
    </motion.figure>
  );
}
