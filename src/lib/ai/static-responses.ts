import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";
import type { Intent } from "./intent-router";
import { portfolio } from "@/data/portfolio";

type KnownIntent = Exclude<Intent, "novel">;

/**
 * Generate static responses dynamically from portfolio data.
 * These are served instantly for Tier 1 (known-topic) hits -- no AI call.
 */
const responseBuilders: Record<KnownIntent, () => string> = {
  about: () => {
    const { name, role, summary } = portfolio.about;
    return [
      `I'm ${name}, ${role}.`,
      "",
      summary.trim(),
      "",
      "You can also ask about my **skills**, **projects**, or **experience**.",
    ].join("\n");
  },

  skills: () => {
    const lines = portfolio.skills.map(
      (cat) => `**${cat.category}:** ${cat.skills.map((s) => s.name).join(", ")}`
    );
    return [
      "Here's a breakdown of my technical stack:",
      "",
      ...lines,
      "",
      "You can also ask about my **projects**, **experience**, or **certifications**.",
    ].join("\n");
  },

  experience: () => {
    const lines = portfolio.experience.map((exp) => {
      const contributions = exp.contributions
        .slice(0, 4)
        .map((c) => `- ${c}`)
        .join("\n");
      return `**${exp.title}** at ${exp.company} (${exp.period})\n${exp.description}\n${contributions}`;
    });
    return [
      "Here's an overview of my professional experience:",
      "",
      ...lines,
      "",
      "You can also ask about my **projects**, **skills**, or **achievements**.",
    ].join("\n");
  },

  projects: () => {
    const lines = portfolio.projects.map((p) => {
      const features = p.features
        .slice(0, 3)
        .map((f) => `- ${f.name}`)
        .join("\n");
      return `**${p.name}** -- ${p.subtitle}\n${p.description.trim()}\n${features}\n**Tech:** ${p.techStack.join(", ")}\n**URL:** ${p.liveUrl}`;
    });
    return [
      "Here are the key projects I've built:",
      "",
      ...lines,
      "",
      "You can also ask about the **architecture**, my **skills**, or **experience**.",
    ].join("\n");
  },

  architecture: () => {
    const project = portfolio.projects[0];
    const flow = project.architecture.map((step, i) => `${i + 1}. ${step}`).join("\n");
    return [
      `Here's the architecture behind **${project.name}**:`,
      "",
      flow,
      "",
      `**Tech Stack:** ${project.techStack.join(", ")}`,
      "",
      "My design principles: serverless-first, event-driven, single-table DynamoDB, infrastructure as code with CDK.",
      "",
      "You can also ask about my **projects**, **skills**, or **experience**.",
    ].join("\n");
  },

  achievements: () => {
    const lines = portfolio.achievements.map((a) => `- ${a.description}`);
    return [
      "Here are some of my key achievements:",
      "",
      ...lines,
      "",
      "You can also ask about my **projects**, **experience**, or **certifications**.",
    ].join("\n");
  },

  certifications: () => {
    const lines = portfolio.certifications.map(
      (c) => `- **${c.name}** (${c.status})`
    );
    return [
      "Here are my certifications:",
      "",
      ...lines,
      "",
      "You can also ask about my **skills**, **experience**, or **achievements**.",
    ].join("\n");
  },

  contact: () => {
    const lines = portfolio.contact.map((c) => `- **${c.label}:** ${c.url}`);
    return [
      "Here's how you can reach me:",
      "",
      ...lines,
      "",
      "Feel free to connect -- I'm always open to discussing cloud architecture, AI platforms, or collaboration opportunities.",
    ].join("\n");
  },

  hire: () => {
    const { name } = portfolio.about;
    const certActive = portfolio.certifications
      .filter((c) => c.status === "Active")
      .map((c) => c.name);
    return [
      `Here's why you should consider working with ${name}:`,
      "",
      "- **12+ years** of enterprise software engineering experience",
      "- **AWS cloud-native** architecture specialist (Lambda, DynamoDB, Step Functions, CDK)",
      "- **AI in production** -- built Autowire.ai, an AI-powered document processing SaaS platform",
      "- **Enterprise systems** -- extensive IBM Curam SPM background for UK Government welfare services",
      certActive.length > 0
        ? `- **AWS Certified** -- ${certActive.join(", ")}`
        : "",
      "- Full-stack capabilities: Java, TypeScript, React, Next.js, Spring Boot",
      "",
      "Specializations: cloud architecture, AI platforms, enterprise systems, serverless microservices.",
      "",
      "You can also ask about my **projects**, **experience**, or **contact** details.",
    ]
      .filter(Boolean)
      .join("\n");
  },
};

/**
 * Get a pre-generated static response for a known intent.
 * Responses are built dynamically from portfolio data to stay in sync.
 */
export function getStaticResponse(intent: KnownIntent): string {
  return responseBuilders[intent]();
}

/**
 * Convert a static response string into LanguageModelV3StreamPart[] format.
 * Used by the caching middleware to replay static responses through
 * simulateReadableStream, making them compatible with useChat.
 */
export function textToStreamChunks(text: string): LanguageModelV3StreamPart[] {
  const words = text.split(/(\s+)/);
  const contentId = "static-0";
  const chunks: LanguageModelV3StreamPart[] = [
    { type: "text-start" as const, id: contentId },
    ...words.map((word) => ({
      type: "text-delta" as const,
      id: contentId,
      delta: word,
    })),
    { type: "text-end" as const, id: contentId },
    {
      type: "finish" as const,
      finishReason: {
        unified: "stop" as const,
        raw: undefined,
      },
      usage: {
        inputTokens: {
          total: 0,
          noCache: undefined,
          cacheRead: undefined,
          cacheWrite: undefined,
        },
        outputTokens: {
          total: 0,
          text: undefined,
          reasoning: undefined,
        },
      },
    },
  ];
  return chunks;
}
