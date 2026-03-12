import { streamText, UIMessage, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { getEnv } from "@/lib/env";
import { rateLimit } from "@/lib/ai/rate-limit";

export async function POST(req: Request) {
  // Rate limit by IP before any processing
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const { success } = rateLimit(ip);
  if (!success) {
    return Response.json(
      { error: "Too many requests. Please try again in a moment." },
      { status: 429 },
    );
  }

  // Validate env vars on first request (fails fast with clear error)
  getEnv();

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: anthropic("claude-haiku-4-5-20251001"),
      system: buildSystemPrompt(),
      messages: await convertToModelMessages(messages.slice(-20)),
      temperature: 0,
      maxOutputTokens: 1024,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
