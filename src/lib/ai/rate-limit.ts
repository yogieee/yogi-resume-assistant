const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 15; // 15 requests per window per identifier

const requestLog = new Map<string, number[]>();

/** In-memory sliding window rate limiter. */
export function rateLimit(identifier: string): { success: boolean } {
  const now = Date.now();
  const timestamps = requestLog.get(identifier) ?? [];

  // Filter out expired timestamps
  const valid = timestamps.filter((t) => now - t < WINDOW_MS);

  if (valid.length >= MAX_REQUESTS) {
    requestLog.set(identifier, valid);
    return { success: false };
  }

  valid.push(now);
  requestLog.set(identifier, valid);
  return { success: true };
}

// Periodic cleanup: prune empty entries every 60 seconds to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of requestLog) {
    const valid = timestamps.filter((t) => now - t < WINDOW_MS);
    if (valid.length === 0) {
      requestLog.delete(key);
    } else {
      requestLog.set(key, valid);
    }
  }
}, 60_000);
