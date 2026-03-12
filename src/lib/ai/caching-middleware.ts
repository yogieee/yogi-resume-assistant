import { simulateReadableStream } from "ai";
import type {
  LanguageModelV3Middleware,
  LanguageModelV3StreamPart,
  LanguageModelV3Prompt,
} from "@ai-sdk/provider";
import {
  responseCache,
  hashMessage,
  DEFAULT_TTL,
  type CachedStreamData,
} from "./response-cache";

// --- Helpers ---

/** Extract text from the last user message in a middleware prompt. */
function extractLastUserMessage(prompt: LanguageModelV3Prompt): string | null {
  const userMessages = prompt.filter((m) => m.role === "user");
  const lastUser = userMessages[userMessages.length - 1];
  if (!lastUser) return null;
  const textParts = lastUser.content.filter((p) => p.type === "text");
  return textParts.map((p) => p.text).join(" ") || null;
}

// --- Caching Middleware ---

/**
 * LanguageModelV3Middleware that intercepts streamText calls to
 * check/populate the response cache.
 *
 * Cache hit: replays stored chunks via simulateReadableStream (no API call).
 * Cache miss: calls Claude, captures chunks via TransformStream, caches result.
 */
export const cachingMiddleware: LanguageModelV3Middleware = {
  specificationVersion: "v3",
  wrapStream: async ({ doStream, params }) => {
    const userMessage = extractLastUserMessage(params.prompt);
    if (!userMessage) {
      // Edge case: no user message found, skip caching
      return doStream();
    }

    const cacheKey = hashMessage(userMessage);
    const cached = responseCache.get(cacheKey);

    // Cache hit -- replay stored chunks
    if (cached) {
      return {
        stream: simulateReadableStream({
          chunks: cached.chunks as LanguageModelV3StreamPart[],
          chunkDelayInMs: 15,
        }),
        request: cached.request,
        response: cached.response,
      };
    }

    // Cache miss -- call model, capture chunks, cache result
    const { stream, ...rest } = await doStream();
    const chunks: LanguageModelV3StreamPart[] = [];

    const transformStream = new TransformStream<
      LanguageModelV3StreamPart,
      LanguageModelV3StreamPart
    >({
      transform(chunk, controller) {
        chunks.push(chunk);
        controller.enqueue(chunk);
      },
      flush() {
        responseCache.set(
          cacheKey,
          {
            chunks,
            request: rest.request,
            response: rest.response,
          } satisfies CachedStreamData,
          DEFAULT_TTL,
        );
      },
    });

    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    };
  },
};
