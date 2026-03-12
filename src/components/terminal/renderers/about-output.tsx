import { portfolio } from "@/data/portfolio";

export function AboutOutput() {
  const { name, role, location, summary } = portfolio.about;

  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">About</div>
      <div>
        <span className="text-glow-cyan font-bold">{name}</span>
      </div>
      <div className="text-console-text">{role}</div>
      <div className="text-console-text-dim">{location}</div>
      <div className="text-console-text mt-2">{summary}</div>
    </div>
  );
}
