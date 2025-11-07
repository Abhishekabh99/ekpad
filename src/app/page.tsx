"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, Share2, Users2 } from "lucide-react";

import { FeatureCard } from "@/components/FeatureCard";
import { GlitchButton } from "@/components/GlitchButton";
import { NeonButton } from "@/components/NeonButton";
import { Badge } from "@/components/ui/badge";

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Page() {
  return (
    <div className="relative overflow-hidden">
      <section className="container relative flex flex-col items-center gap-10 py-24 text-center md:py-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <Badge className="border border-brand-purple/50 bg-brand-purple/20 text-xs uppercase tracking-[0.4em] text-brand-cyan">
            Early access now live
          </Badge>
          <motion.h1
            className="max-w-4xl bg-gradient-to-r from-white via-brand-cyan to-white bg-clip-text text-4xl font-bold leading-tight text-transparent drop-shadow-[0_0_25px_rgba(124,58,237,0.45)] md:text-6xl"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            Ekpad — one pad for every gamer’s story.
          </motion.h1>
          <motion.p
            className="max-w-2xl text-base text-muted-foreground/80 md:text-lg"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
          >
            Capture your greatest plays, remix with your squad, and publish cinematic timelines that pulse with neon energy. Ekpad
            is the co-op canvas for gamers who live to share their legend.
          </motion.p>
          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.45 }}
          >
            <NeonButton className="gap-2">
              Enter the arena
              <ArrowRight className="h-4 w-4" />
            </NeonButton>
            <GlitchButton className="text-xs" pulse>
              watch trailer
            </GlitchButton>
          </motion.div>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative w-full max-w-5xl rounded-3xl border border-white/10 bg-black/30 p-6 shadow-neon"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-brand-purple/20 via-brand-pink/10 to-brand-cyan/20 p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="grid gap-6 text-left md:grid-cols-3"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-cyan/80">Squad Sync</span>
                <p className="text-sm text-muted-foreground/80">
                  Co-author sessions with your fireteam, sync highlights, and drop real-time reactions.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-cyan/80">Dynamic Timelines</span>
                <p className="text-sm text-muted-foreground/80">
                  Layer clips, soundscapes, and captions across a living timeline designed for esports storytelling.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-cyan/80">Neon Publishing</span>
                <p className="text-sm text-muted-foreground/80">
                  Publish instantly to your crew hubs with glitch-ready overlays and animated transitions.
                </p>
              </div>
            </motion.div>
            <span className="pointer-events-none absolute inset-0 animate-glitch-x rounded-2xl border border-white/5" />
          </div>
        </motion.div>
      </section>

      <section id="features" className="container relative py-24">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={heroVariants}
          transition={{ duration: 0.8 }}
        >
          <h2 className="bg-gradient-to-r from-brand-purple via-white to-brand-cyan bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
            Forge, flex, and share your saga
          </h2>
          <p className="mt-4 text-base text-muted-foreground/80">
            Ekpad wraps pro-level tooling in a sleek neon shell so you can focus on the thrill of the play.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[{
            title: "Adaptive Story Paths",
            description: "Branch your narrative with scene variants, multi-perspective POVs, and vote-driven outcomes.",
            icon: Gamepad2,
            accent: "text-brand-cyan"
          },
          {
            title: "Squad Signal Boost",
            description: "Launch private or public drops, invite collaborators, and amplify with one-tap crossposting.",
            icon: Users2,
            accent: "text-brand-purple"
          },
          {
            title: "Neon Performance Lab",
            description: "Track engagement, viewer streaks, and stream health inside a responsive, data-rich console.",
            icon: Share2,
            accent: "text-brand-pink"
          }].map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </div>
  );
}
