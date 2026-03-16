"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { SocialLinks } from "@/components/social-links";
import { ResumeDialog } from "@/components/resume-dialog";
import { portfolio } from "@/data/portfolio";

export function ProfileActions() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3">
      <SocialLinks contacts={portfolio.contact} />
      <button
        onClick={() => setDialogOpen(true)}
        className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-medium rounded-lg border border-console-border/50 bg-console-elevated/30 text-console-text-dim hover:text-glow-green hover:border-glow-green/30 hover:bg-glow-green/5 hover:shadow-glow-sm transition-all duration-200 cursor-pointer"
      >
        <Download className="size-3.5" />
        <span className="hidden sm:inline">Resume</span>
      </button>
      <ResumeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
