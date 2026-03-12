import { streamText, UIMessage, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { getEnv } from "@/lib/env";

export async function POST(req: Request) {
  // Validate env vars on first request (fails fast with clear error)
  getEnv();

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages.slice(-20)),
    temperature: 0,
    maxOutputTokens: 1024,
  });

  return result.toUIMessageStreamResponse();
}
