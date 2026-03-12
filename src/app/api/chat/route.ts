import { streamText, UIMessage, convertToModelMessages, wrapLanguageModel } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { classifyIntent } from "@/lib/ai/intent-router";
import { getStaticResponse, textToStreamChunks } from "@/lib/ai/static-responses";
import { buildMinimalContext } from "@/lib/ai/topic-context";
import { cachingMiddleware } from "@/lib/ai/caching-middleware";
import { responseCache, hashMessage, DEFAULT_TTL } from "@/lib/ai/response-cache";
import { getEnv } from "@/lib/env";
import { rateLimit } from "@/lib/ai/rate-limit";

/** Wrapped model: all streamText calls go through caching middleware. */
const cachedModel = wrapLanguageModel({
  model: anthropic("claude-haiku-4-5-20251001"),
  middleware: cachingMiddleware,
});

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

    // Extract last user message text
    const userMessages = messages.filter((m) => m.role === "user");
    const lastUser = userMessages[userMessages.length - 1];
    const lastText =
      lastUser?.parts
        ?.filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
        .map((p) => p.text)
        .join(" ") ?? "";

    // Classify intent (keyword/regex, no AI call)
    const intent = classifyIntent(lastText);

    // Tier 1: Pre-seed cache for known topics
    if (intent !== "novel") {
      const cacheKey = hashMessage(lastText);
      if (!responseCache.get(cacheKey)) {
        const staticText = getStaticResponse(intent);
        const chunks = textToStreamChunks(staticText);
        responseCache.set(
          cacheKey,
          { chunks, request: { body: null }, response: { headers: {} } },
          DEFAULT_TTL,
        );
      }
      // Fall through to streamText -- middleware will find cache hit
    }

    // Debug logging (development only)
    if (process.env.NODE_ENV === "development") {
      const tierLabel =
        intent !== "novel"
          ? "static"
          : responseCache.get(hashMessage(lastText))
            ? "cache-hit"
            : "api-call";
      console.log(`[AI Route] intent=${intent}, tier=${tierLabel}`);
    }

    // Tiers 2 & 3: Caching middleware handles cache hit (replay) or miss (Claude call + cache)
    const result = streamText({
      model: cachedModel,
      system: buildMinimalContext(intent !== "novel" ? intent : null),
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
