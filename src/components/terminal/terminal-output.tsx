"use client";

import type { TerminalEntry, CommandOutput } from "@/lib/terminal/types";
import { TypingEffect } from "./typing-effect";
import { WelcomeOutput } from "./renderers/welcome-output";
import { HelpOutput } from "./renderers/help-output";
import { AboutOutput } from "./renderers/about-output";
import { SkillsOutput } from "./renderers/skills-output";
import { ExperienceOutput } from "./renderers/experience-output";
import { ProjectsOutput } from "./renderers/projects-output";
import { ArchitectureOutput } from "./renderers/architecture-output";
import { AchievementsOutput } from "./renderers/achievements-output";
import { CertificationsOutput } from "./renderers/certifications-output";
import { ContactOutput } from "./renderers/contact-output";
import { ResumeOutput } from "./renderers/resume-output";

/** Exhaustiveness check helper */
function assertNever(x: never): never {
  throw new Error(`Unexpected output type: ${(x as CommandOutput).type}`);
}

function renderOutput(output: CommandOutput) {
  switch (output.type) {
    case "welcome":
      return <WelcomeOutput />;
    case "help":
      return <HelpOutput />;
    case "about":
      return <AboutOutput />;
    case "skills":
      return <SkillsOutput />;
    case "experience":
      return <ExperienceOutput />;
    case "projects":
      return <ProjectsOutput />;
    case "architecture":
      return <ArchitectureOutput />;
    case "achievements":
      return <AchievementsOutput />;
    case "certifications":
      return <CertificationsOutput />;
    case "contact":
      return <ContactOutput />;
    case "resume":
      return <ResumeOutput />;

    case "clear":
      // Clear is intercepted by the reducer and never reaches history,
      // but we handle it for type completeness
      return null;

    case "error":
      return (
        <div className="text-glow-red">
          <TypingEffect speed={60}>
            {`Unknown command: '${output.input}'. Type 'help' for available commands.`}
          </TypingEffect>
        </div>
      );

    default:
      return assertNever(output);
  }
}

export function TerminalOutputEntry({ entry }: { entry: TerminalEntry }) {
  return (
    <div className="space-y-1">
      {entry.command !== undefined && (
        <div className="text-console-text">
          <span className="text-glow-green font-bold">yogi@portfolio</span>
          <span className="text-console-text-dim"> % </span>
          <span className="text-glow-cyan">{entry.command}</span>
        </div>
      )}
      {renderOutput(entry.output)}
    </div>
  );
}
