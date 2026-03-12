import { portfolio } from "@/data/portfolio";

export function AchievementsOutput() {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">Key Achievements</div>
      <div className="space-y-1">
        {portfolio.achievements.map((a, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-glow-green shrink-0">*</span>
            <span className="text-console-text">{a.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
