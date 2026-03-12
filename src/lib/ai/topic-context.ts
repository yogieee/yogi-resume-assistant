import type { Intent } from "./intent-router";
import { portfolio } from "@/data/portfolio";

type TopicKey =
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "achievements"
  | "certifications"
  | "contact"
  | "education"
  | "interests";

const contextBuilders: Record<TopicKey, () => string> = {
  about: () =>
    `${portfolio.about.name} -- ${portfolio.about.role}\nBased in ${portfolio.about.location}\n${portfolio.about.summary.trim()}`,

  skills: () =>
    portfolio.skills
      .map(
        (cat) =>
          `${cat.category}: ${cat.skills.map((s) => s.name).join(", ")}`
      )
      .join("\n"),

  experience: () =>
    portfolio.experience
      .map(
        (exp) =>
          `${exp.title} at ${exp.company} (${exp.period})\n${exp.contributions.map((c) => `- ${c}`).join("\n")}`
      )
      .join("\n\n"),

  projects: () =>
    portfolio.projects
      .map(
        (p) =>
          `${p.name} -- ${p.subtitle}\n${p.description.trim()}\nFeatures: ${p.features.map((f) => f.name).join("; ")}\nArchitecture: ${p.architecture.join(" -> ")}\nTech: ${p.techStack.join(", ")}\nURL: ${p.liveUrl}`
      )
      .join("\n\n"),

  achievements: () =>
    portfolio.achievements.map((a) => `- ${a.description}`).join("\n"),

  certifications: () =>
    portfolio.certifications
      .map((c) => `- ${c.name} (${c.status})${c.period ? ` ${c.period}` : ""}`)
      .join("\n"),

  contact: () =>
    portfolio.contact.map((c) => `- ${c.label}: ${c.url}`).join("\n"),

  education: () =>
    portfolio.education
      .map((e) => `- ${e.degree} -- ${e.institution} (${e.year})`)
      .join("\n"),

  interests: () =>
    `${portfolio.interests.learning}\nHobbies: ${portfolio.interests.hobbies.join(", ")}`,
};

/** Map intents to topic context keys. Some intents combine multiple topics. */
function getTopicKeys(intent: Intent | null): TopicKey[] {
  switch (intent) {
    case "about":
      return ["about", "education"];
    case "skills":
      return ["skills"];
    case "experience":
      return ["experience"];
    case "projects":
      return ["projects"];
    case "architecture":
      return ["projects"];
    case "achievements":
      return ["achievements"];
    case "certifications":
      return ["certifications"];
    case "contact":
      return ["contact"];
    case "hire":
      return ["about", "skills", "achievements", "contact"];
    case "help":
      return ["about"];
    default:
      // novel or null -- include projects so AI can answer design/architecture questions
      return ["about", "skills", "projects"];
  }
}

const BASE_PROMPT = `You are Yogi AI, portfolio assistant for ${portfolio.about.name}. Be concise, professional, technical. Respond in first person as Yoganand.

## Response Guidelines
- Keep responses 6-12 lines
- Short conversational intro + structured content (bullets) + optional call-to-action
- Use bold labels sparingly
- No emojis, no heavy markdown headers
- Suggest related topics at the end of responses

## Off-Topic
- Politely redirect: "I'm focused on Yoganand's portfolio -- try asking about his projects or experience!"
- Stay in persona, never break character`;

/**
 * Build a minimal system prompt with only the relevant topic context.
 * Much shorter than the full buildSystemPrompt() -- reduces token usage
 * for cache-miss AI calls.
 */
export function buildMinimalContext(topic: Intent | null): string {
  const topicKeys = getTopicKeys(topic);
  const sections = topicKeys
    .map((key) => contextBuilders[key]())
    .join("\n\n");

  return `${BASE_PROMPT}\n\n## Portfolio Data\n\n${sections}`;
}
