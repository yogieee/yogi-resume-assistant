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
  | "help"
  | "novel";

interface IntentRule {
  intent: Exclude<Intent, "novel">;
  keywords: string[];
  patterns?: RegExp[];
}

/**
 * Intent rules ordered from most specific to least specific.
 * Keywords are checked with `includes()` so multi-word phrases work.
 *
 * IMPORTANT: Order matters -- first match wins.
 * "hire" must come before "projects" to avoid lead questions
 * being swallowed by broad project keywords like "saas" or "platform".
 */
const INTENT_RULES: IntentRule[] = [
  {
    intent: "help",
    keywords: ["what can you do", "how do you work", "what can i ask"],
    patterns: [/^help$/i],
  },
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
  // hire MUST come before projects -- "Can you help build a SaaS" is a lead, not a project query
  {
    intent: "hire",
    keywords: [
      "hire",
      "collaborate",
      "work together",
      "freelance",
      "consulting",
      "start project",
      "discuss a project",
      "project idea",
      "help build",
      "can you help",
      "available for",
      "open to",
      "looking for",
      "new opportunities",
      "work remotely",
    ],
    patterns: [
      /why (should|would).*(hire|choose)/i,
      /can (we|i) discuss/i,
      /available for (work|projects|freelance)/i,
    ],
  },
  {
    intent: "contact",
    keywords: [
      "contact",
      "email",
      "linkedin",
      "github",
      "reach",
      "connect",
      "phone",
      "call",
    ],
  },
  {
    intent: "projects",
    keywords: ["projects", "autowire", "portfolio", "built", "created"],
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
      "enterprise",
      "years of experience",
      "how long",
      "industries",
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
      "database",
      "cloud tech",
      "speciali",
    ],
    patterns: [/what (do|does|can) (you|yogi) (know|use|work with)/i],
  },
  {
    intent: "about",
    keywords: [
      "tell me about you",
      "about yourself",
      "who are you",
      "who is yogi",
      "background",
      "introduce",
      "summary",
      "bio",
      "what do you do",
      "what you do",
      "where are you based",
      "where you based",
      "location",
      "what kind of engineer",
    ],
    patterns: [
      /^about$/i,
      /tell me about (yourself|yogi)/i,
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
