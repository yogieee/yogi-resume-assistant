import { portfolio } from "@/data/portfolio";

export function WelcomeOutput() {
  return (
    <div className="space-y-2 mt-2">
      <div className="border-l-2 border-glow-green pl-3 space-y-1">
        <div className="text-glow-green font-bold">
          Welcome to Yogi Dev Console v1.0
        </div>
        <div className="text-console-text">
          Interactive terminal portfolio of {portfolio.about.name}
        </div>
        <div className="text-console-text-dim">
          {portfolio.about.tagline}
        </div>
        <div className="text-console-text mt-2">
          Type{" "}
          <span className="text-glow-cyan">&apos;help&apos;</span> to see
          available commands
        </div>
      </div>
    </div>
  );
}
