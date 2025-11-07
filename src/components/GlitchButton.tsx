"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const glitchVariants = {
  rest: {
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  hover: {
    x: [0, -2, 2, -1, 0],
    y: [0, 1, -1, 2, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

export interface GlitchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulse?: boolean;
}

export const GlitchButton = React.forwardRef<HTMLButtonElement, GlitchButtonProps>(
  ({ className, children, pulse = true, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-brand-cyan/40 bg-transparent px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-cyan",
          className
        )}
        initial="rest"
        whileHover="hover"
        whileTap="hover"
        animate="rest"
        variants={glitchVariants}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
          <span className="h-1 w-1 rounded-full bg-brand-cyan" />
        </span>
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-purple/20 via-brand-pink/10 to-brand-cyan/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        {pulse && (
          <span className="pointer-events-none absolute inset-0 -z-10 animate-neon-pulse rounded-full" />
        )}
        <span className="pointer-events-none absolute inset-0 mix-blend-screen">
          <span className="absolute inset-0 translate-x-1 translate-y-1 bg-brand-cyan/15 opacity-0 blur group-hover:opacity-70" />
          <span className="absolute inset-0 -translate-x-1 -translate-y-1 bg-brand-purple/20 opacity-0 blur group-hover:opacity-70" />
        </span>
      </motion.button>
    );
  }
);
GlitchButton.displayName = "GlitchButton";
