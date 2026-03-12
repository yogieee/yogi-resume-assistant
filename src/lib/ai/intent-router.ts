export type Intent =
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "architecture"
  | "achievements"
  | "certifications"
  | "contact"
  | "hire"
  | "novel";

interface IntentRule {
  intent: Exclude<Intent, "novel">;
  keywords: string[];
  patterns?: RegExp[];
}

/**
 * Intent rules ordered from most specific to least specific.
 * Keywords are checked with `includes()` so multi-word phrases work.
 */
const INTENT_RULES: IntentRule[] = [
  {
    intent: "certifications",
    keywords: [
      "certifications",
      "certified",
      "aws cert",
      "credentials",
      "certification",
    ],
  },
  {
    intent: "architecture",
    keywords: [
      "architecture",
      "design system",
      "serverless",
      "infrastructure",
      "cdk",
      "aws design",
      "system design",
    ],
  },
  {
    intent: "achievements",
    keywords: ["achievements", "accomplishments", "highlights", "proud"],
  },
  {
    intent: "hire",
    keywords: [
      "hire",
      "collaborate",
      "work together",
      "freelance",
      "consulting",
      "start project",
      "why hire",
    ],
    patterns: [/why (should|would).*(hire|choose)/i],
  },
  {
    intent: "contact",
    keywords: ["contact", "email", "linkedin", "github", "reach", "connect"],
  },
  {
    intent: "projects",
    keywords: [
      "projects",
      "autowire",
      "portfolio",
      "built",
      "created",
      "saas",
      "platform",
    ],
    patterns: [/what (have|has) (you|yogi) (built|made|created)/i],
  },
  {
    intent: "experience",
    keywords: [
      "experience",
      "work history",
      "career",
      "job",
      "employment",
      "company",
      "mphasis",
      "curam",
      "ibm",
    ],
    patterns: [/where (have|has|do|does) (you|yogi) work/i],
  },
  {
    intent: "skills",
    keywords: [
      "skills",
      "technologies",
      "tech stack",
      "languages",
      "tools",
      "frameworks",
      "proficient",
    ],
    patterns: [/what (do|does|can) (you|yogi) (know|use|work with)/i],
  },
  {
    intent: "about",
    keywords: [
      "about",
      "who",
      "background",
      "introduce",
      "yourself",
      "summary",
      "bio",
      "tell me about",
    ],
  },
];

/**
 * Classify a user message into a known portfolio topic or "novel".
 * Pure keyword/regex matching -- no AI call needed.
 */
export function classifyIntent(message: string): Intent {
  const normalized = message.toLowerCase().trim();

  for (const rule of INTENT_RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      return rule.intent;
    }
    if (rule.patterns?.some((p) => p.test(normalized))) {
      return rule.intent;
    }
  }

  return "novel";
}
