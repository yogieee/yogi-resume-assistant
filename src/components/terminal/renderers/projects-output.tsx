import { portfolio } from "@/data/portfolio";

export function ProjectsOutput() {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">Projects</div>
      {portfolio.projects.map((project) => (
        <div key={project.name} className="space-y-2">
          <div>
            <span className="text-glow-cyan font-bold">{project.name}</span>
            <span className="text-console-text-dim ml-2">
              {project.subtitle}
            </span>
          </div>
          <div className="text-console-text">{project.description}</div>
          <div>
            <span className="text-glow-amber">Features:</span>
            <div className="mt-1 space-y-0.5">
              {project.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-glow-green shrink-0">-</span>
                  <span className="text-console-text">{f.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-glow-amber">Tech Stack: </span>
            <span className="text-console-text">
              {project.techStack.join(", ")}
            </span>
          </div>
          {project.liveUrl && (
            <div>
              <span className="text-glow-amber">Live: </span>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-glow-amber hover:underline"
              >
                {project.liveUrl}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
