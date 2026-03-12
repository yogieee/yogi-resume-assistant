"use client";

import { Download } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SocialLinks } from "@/components/social-links";
import { portfolio } from "@/data/portfolio";

export function ProfileActions() {
  return (
    <div className="flex items-center justify-between gap-6">
      <SocialLinks contacts={portfolio.contact} />
      <a
        href="/resume.pdf"
        download
        className={buttonVariants({
          variant: "outline",
          className: "gap-2 shrink-0",
        })}
      >
        <Download className="size-4" />
        Download Resume
      </a>
    </div>
  );
}
