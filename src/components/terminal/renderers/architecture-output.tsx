import { portfolio } from "@/data/portfolio";

export function ArchitectureOutput() {
  const project = portfolio.projects[0];

  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">
        {project.name} Architecture
      </div>
      <div className="overflow-x-auto">
        <pre className="whitespace-pre font-mono text-glow-cyan leading-relaxed">
          {project.architecture.join("\n")}
        </pre>
      </div>
      <div className="text-console-text-dim text-xs">
        System Architecture Diagram
      </div>
    </div>
  );
}
