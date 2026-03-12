import { portfolio } from "@/data/portfolio";

export function SkillsOutput() {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">Technical Skills</div>
      {portfolio.skills.map((category) => (
        <div key={category.category}>
          <span className="text-glow-cyan">{category.category}:</span>{" "}
          <span className="text-console-text">
            {category.skills.map((s) => s.name).join(" · ")}
          </span>
        </div>
      ))}
    </div>
  );
}
