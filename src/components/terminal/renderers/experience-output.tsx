import { portfolio } from "@/data/portfolio";

export function ExperienceOutput() {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">Experience</div>
      {portfolio.experience.map((exp, i) => (
        <div
          key={`${exp.company}-${exp.period}`}
          className={
            i > 0 ? "border-t border-console-border pt-3 mt-3" : undefined
          }
        >
          <div className="text-glow-cyan font-bold">{exp.title}</div>
          <div>
            <span className="text-console-text">
              {exp.company} &middot; {exp.location}
            </span>
            <span className="text-console-text-dim ml-2">{exp.period}</span>
          </div>
          <div className="text-console-text mt-1">{exp.description}</div>
          <div className="mt-1 space-y-0.5">
            {exp.contributions.map((c, j) => (
              <div key={j} className="flex gap-2">
                <span className="text-glow-green shrink-0">&gt;</span>
                <span className="text-console-text-dim">{c}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
