"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SocialLinks } from "@/components/social-links";
import { ResumeDialog } from "@/components/resume-dialog";
import { portfolio } from "@/data/portfolio";

export function ProfileActions() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4">
      <SocialLinks contacts={portfolio.contact} />
      <button
        onClick={() => setDialogOpen(true)}
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "gap-1.5 shrink-0 h-7 text-xs",
        })}
      >
        <Download className="size-3" />
        Resume
      </button>
      <ResumeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
