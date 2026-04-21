import { TypingEffect } from "../typing-effect";

const daysSince2011 = Math.floor(
  (Date.now() - new Date("2011-01-01").getTime()) / (1000 * 60 * 60 * 24)
);

const eggs: Record<string, { lines: string[]; color?: string }> = {
  sudo: {
    lines: [
      "Permission denied: Nice try.",
      "This terminal is already running with maximum Yogi privileges.",
      "Try 'projects' instead -- that's where the real power is.",
    ],
    color: "text-glow-red",
  },
  matrix: {
    lines: [
      "Wake up, recruiter...",
      "The Matrix has you...",
      "Follow the white rabbit.",
      "",
      "...or just type 'skills' to see what Yogi actually knows.",
    ],
    color: "text-glow-green",
  },
  whoami: {
    lines: [
      "You are a visitor exploring Yoganand Govind's portfolio.",
      "But the real question is: what will you build together?",
      "",
      "Type 'contact' to start the conversation.",
    ],
    color: "text-glow-cyan",
  },
  "404": {
    lines: [
      "404: Career gap not found.",
      "12+ years of continuous engineering. No breaks. No excuses.",
      "",
      "Type 'experience' for the full timeline.",
    ],
    color: "text-glow-amber",
  },
  hack: {
    lines: [
      "Initializing hack sequence...",
      "[##########] 100%",
      "",
      "Access granted: You now have access to my full portfolio.",
      "Type 'help' to see all available commands.",
    ],
    color: "text-glow-green",
  },
  coffee: {
    lines: [
      "Brewing...",
      "",
      "   ( (",
      "    ) )",
      "  ........",
      "  |      |]",
      "  \\      /",
      "   `----'",
      "",
      "Fuelled by coffee. Powered by AWS.",
    ],
    color: "text-glow-amber",
  },
  ping: {
    lines: [
      "PING yoganandgovind.dev (127.0.0.1): 56 data bytes",
      "64 bytes: icmp_seq=0 ttl=64 time=0.042 ms",
      "64 bytes: icmp_seq=1 ttl=64 time=0.038 ms",
      "",
      "--- yoganandgovind.dev ping statistics ---",
      "2 packets transmitted, 2 received, 0% packet loss",
      "Status: Online and ready to collaborate.",
    ],
    color: "text-glow-green",
  },
  ls: {
    lines: [
      "total 42",
      "",
      "● drwxr-xr-x  yogi_skills.tar.gz",
      "  └─ 12+ years of compressed expertise",
      "",
      "● drwxr-xr-x  secret_projects/",
      "  └─ requires clearance — type 'projects'",
      "",
      "● -rw-r--r--  coffee_count.txt",
      "  └─ [contents: NaN — too large to display]",
      "",
      "● -rwxr-xr-x  aws_certifications.sh",
      "  └─ executable, already running in prod",
      "",
      "● -rw-r--r--  hire_me_please.pdf",
      "  └─ available for download — type 'resume'",
      "",
      "● drwxr-xr-x  ideas_backlog/",
      "  └─ overflowing, as always",
      "",
      "● -rw-r--r--  .bashrc",
      "  └─ heavily customised, do not touch",
    ],
    color: "text-glow-cyan",
  },
  "rm -rf /": {
    lines: [
      "rm: cannot remove '/': Permission denied.",
      "",
      "Nice try.",
      "This terminal is read-only.",
      "Yogi's code is on AWS. It's not going anywhere.",
      "Even if it did — there are backups. And more backups. And a DR plan.",
      "",
      "Type 'projects' to see what you were never going to delete.",
    ],
    color: "text-glow-red",
  },
  "git log": {
    lines: [
      "● commit a1b2c3d  (HEAD -> main, origin/main)",
      "  Author: Yogi <yogi@yoganandgovind.dev>",
      "  Date:   Today",
      "  └─ feat: shipped AI platform before deadline (yes, really)",
      "",
      "● commit d4e5f6a",
      "  Date:   Last week",
      "  └─ fix: removed 3am code, replaced with 9am code",
      "",
      "● commit 7b8c9d0",
      "  Date:   Last month",
      "  └─ chore: added another AWS cert to the collection",
      "",
      "● commit 0e1f2a3",
      "  Date:   2011",
      "  └─ init: hello world — this is going well",
    ],
    color: "text-glow-green",
  },
};

// date is dynamic so rendered separately
export function DateEasterEgg() {
  const today = new Date().toDateString();
  const lines = [
    today,
    "",
    `Yogi has been shipping code for ${daysSince2011.toLocaleString()} days straight.`,
    "No signs of stopping.",
  ];
  return (
    <div className="text-glow-cyan">
      <TypingEffect speed={40}>{lines.join("\n")}</TypingEffect>
    </div>
  );
}

export function EasterEggOutput({ egg }: { egg: string }) {
  if (egg === "date") return <DateEasterEgg />;

  const data = eggs[egg];
  if (!data) return null;

  return (
    <div className={data.color ?? "text-console-text"}>
      <TypingEffect speed={40}>
        {data.lines.join("\n")}
      </TypingEffect>
    </div>
  );
}
