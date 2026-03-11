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
    <div className="flex items-center justify-center gap-3">
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
            className="rounded-lg border border-transparent bg-console-elevated/50 p-2 text-console-text-dim transition-colors duration-200 hover:border-console-border hover:bg-console-elevated hover:text-glow-cyan"
          >
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}
