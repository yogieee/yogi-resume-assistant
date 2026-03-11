"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { MapPin, Download } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SocialLinks } from "@/components/social-links";
import { portfolio } from "@/data/portfolio";

const { about, contact } = portfolio;

export function ProfileCard() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={
        hasEntered
          ? { opacity: 1, y: [0, -8, 0], scale: 1 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={
        hasEntered
          ? { y: { duration: 4, ease: "easeInOut", repeat: Infinity } }
          : { duration: 0.6, ease: "easeOut" }
      }
      onAnimationComplete={() => {
        if (!hasEntered) setHasEntered(true);
      }}
      className="w-full max-w-sm mx-auto lg:max-w-none"
    >
      <div className="relative rounded-2xl p-6 space-y-5 bg-console-surface/80 backdrop-blur-xl border border-console-border/50 shadow-lg shadow-black/20 ring-1 ring-white/5">
        {/* Avatar placeholder */}
        <div className="flex justify-center">
          <div className="size-24 rounded-full bg-console-elevated border-2 border-console-border flex items-center justify-center">
            <span className="text-2xl font-bold text-glow-cyan">YG</span>
          </div>
        </div>

        {/* Identity */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-console-text-bright">
            {about.name}
          </h1>
          <p className="text-sm text-glow-cyan">{about.role}</p>
          <p className="text-xs text-console-text-dim">{about.tagline}</p>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-1 text-sm text-console-text-dim">
          <MapPin className="size-3.5" />
          <span>{about.location}</span>
        </div>

        {/* Social Links */}
        <SocialLinks contacts={contact} />

        {/* Resume Download */}
        <a
          href="/resume.pdf"
          download
          className={buttonVariants({
            variant: "outline",
            className: "w-full gap-2 justify-center",
          })}
        >
          <Download className="size-4" />
          Download Resume
        </a>
      </div>
    </motion.div>
  );
}
