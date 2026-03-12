"use client";

import { Download } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SocialLinks } from "@/components/social-links";
import { portfolio } from "@/data/portfolio";

export function ProfileActions() {
  return (
    <div className="flex items-center justify-between gap-4">
      <SocialLinks contacts={portfolio.contact} />
      <a
        href="/Yoganandgovind-resume.pdf"
        download
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "gap-1.5 shrink-0 h-7 text-xs",
        })}
      >
        <Download className="size-3" />
        Resume
      </a>
    </div>
  );
}
