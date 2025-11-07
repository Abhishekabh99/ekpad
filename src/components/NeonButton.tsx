"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const glowVariants = {
  rest: {
    boxShadow: "0 0 18px rgba(124,58,237,0.35), 0 0 32px rgba(34,211,238,0.25)",
    filter: "drop-shadow(0 0 6px rgba(124,58,237,0.45))"
  },
  hover: {
    boxShadow: "0 0 28px rgba(124,58,237,0.55), 0 0 54px rgba(34,211,238,0.45)",
    filter: "drop-shadow(0 0 12px rgba(124,58,237,0.75))"
  }
};

export type NeonButtonProps = ButtonProps & {
  glow?: boolean;
};

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, size = "lg", glow = true, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({ size, variant: "default" }),
          "relative overflow-hidden rounded-full px-8 py-3 text-base font-semibold shadow-neon",
          className
        )}
        initial="rest"
        whileHover="hover"
        whileTap="hover"
        animate="rest"
        variants={glow ? glowVariants : undefined}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        <span className="pointer-events-none absolute inset-0 -z-0 rounded-full bg-gradient-to-r from-brand-purple/60 via-brand-pink/40 to-brand-cyan/60 opacity-70 mix-blend-screen" />
      </motion.button>
    );
  }
);
NeonButton.displayName = "NeonButton";
