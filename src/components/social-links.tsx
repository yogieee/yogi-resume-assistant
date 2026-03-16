import { Mail, Phone } from "lucide-react";

import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { GithubIcon } from "@/components/icons/github-icon";
import type { ContactInfo } from "@/types/portfolio";

const iconMap: Record<
  ContactInfo["type"],
  React.ComponentType<{ className?: string }>
> = {
  email: Mail,
  phone: Phone,
  linkedin: LinkedinIcon,
  github: GithubIcon,
};

export function SocialLinks({ contacts }: { contacts: ContactInfo[] }) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      {contacts.map((c) => {
        const Icon = iconMap[c.type];
        const isExternal = c.type === "linkedin" || c.type === "github";

        return (
          <a
            key={c.type}
            href={c.url}
            {...(isExternal && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            aria-label={c.label}
            className="rounded-lg border border-console-border/40 bg-console-elevated/30 p-2 sm:p-2 text-console-text-dim transition-all duration-200 hover:border-glow-green/30 hover:bg-console-elevated/60 hover:text-glow-green hover:shadow-glow-sm cursor-pointer"
          >
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}
