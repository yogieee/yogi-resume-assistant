import { TypingEffect } from "../typing-effect";

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
};

export function EasterEggOutput({ egg }: { egg: string }) {
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
