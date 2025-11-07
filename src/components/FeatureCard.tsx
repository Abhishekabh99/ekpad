"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

export function FeatureCard({ title, description, icon: Icon, accent }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="noise-overlay"
    >
      <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-background/60 via-muted/60 to-background/70 shadow-card">
        <span
          className="pointer-events-none absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        <CardHeader className="space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-white/5">
            <Icon className={`h-6 w-6 ${accent}`} />
          </div>
          <CardTitle className="text-xl font-semibold text-white drop-shadow-[0_0_10px_rgba(124,58,237,0.25)]">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 text-xs uppercase tracking-[0.35em] text-muted-foreground/60">
          <span>Craft your legend</span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
