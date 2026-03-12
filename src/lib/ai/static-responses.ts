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
    const { name, role, location, summary } = portfolio.about;
    return [
      `I'm ${name}, ${role}, based in ${location}.`,
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
    return [
      `Here's the architecture behind **${project.name}**:`,
      "",
      "```",
      "  [Client Browser]",
      "        |",
      "  [Next.js 15 / Vercel]",
      "        |",
      "  [API Gateway] ---- REST endpoints",
      "        |",
      "  [AWS Lambda x15+] ---- microservices",
      "      /    |    \\",
      "     /     |     \\",
      "  [S3]  [DynamoDB]  [SQS]",
      "   |    (single-table) |",
      "   v                   v",
      "  [Textract]     [Step Functions]",
      "   |                   |",
      "   v                   v",
      "  [Bedrock Data    [Batch Processing",
      "   Automation]      Orchestration]",
      "        \\             /",
      "         \\           /",
      "       [CloudWatch + SNS + SES]",
      "         (monitoring & alerts)",
      "```",
      "",
      "**Design Principles:**",
      "- Serverless-first (zero idle cost)",
      "- Event-driven async processing (SQS + Step Functions)",
      "- Single-table DynamoDB design for multi-tenant isolation",
      "- Infrastructure as code with AWS CDK",
      "- Hybrid deployment: Vercel (frontend) + AWS CDK (backend)",
      "",
      `**Tech Stack:** ${project.techStack.join(", ")}`,
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
      (c) => `- **${c.name}** (${c.status})${c.period ? ` -- ${c.period}` : ""}`
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
    const email = portfolio.contact.find((c) => c.type === "email");
    const linkedin = portfolio.contact.find((c) => c.type === "linkedin");
    return [
      "Absolutely -- I'd love to discuss your project.",
      "",
      "I specialise in **cloud architecture**, **AI-powered platforms**, and **full-stack SaaS development** on AWS. Whether it's a greenfield build or modernising an existing system, I can help.",
      "",
      "Let's connect:",
      email ? `- **Email:** ${email.url}` : "",
      linkedin ? `- **LinkedIn:** ${linkedin.url}` : "",
      "",
      "Ask about my **projects** or **architecture** to see examples of what I've built.",
    ]
      .filter(Boolean)
      .join("\n");
  },

  help: () => {
    return [
      "I'm Yogi AI, the portfolio assistant for Yoganand Govind. Here are some things you can ask me:",
      "",
      "- **\"Tell me about yourself\"** -- who Yoganand is and what he does",
      "- **\"What are your skills?\"** -- full technical stack breakdown",
      "- **\"Tell me about Autowired\"** -- the AI SaaS platform he built",
      "- **\"Explain the architecture\"** -- system design with diagrams",
      "- **\"What is your experience?\"** -- career history and enterprise work",
      "- **\"Show certifications\"** -- AWS and IBM certifications",
      "- **\"Are you available for projects?\"** -- collaboration and contact info",
      "",
      "Try starting with **\"What projects have you built?\"** for the best overview.",
    ].join("\n");
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
