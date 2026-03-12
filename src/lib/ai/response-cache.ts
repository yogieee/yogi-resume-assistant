import { createHash } from "crypto";
import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";

// --- Types ---

export interface CachedStreamData {
  chunks: LanguageModelV3StreamPart[];
  request?: { body?: unknown };
  response?: { headers?: Record<string, string> };
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

// --- Response Cache ---

export const DEFAULT_TTL = 3_600_000; // 1 hour

export class ResponseCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private maxSize: number;

  constructor(maxSize = 200) {
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    // LRU: move to end so it's evicted last
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T, ttl = DEFAULT_TTL): void {
    // LRU eviction: delete least recently used entry if at capacity
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) {
        this.store.delete(oldest);
      }
    }
    this.store.set(key, { value, expiresAt: Date.now() + ttl });
  }

  get size(): number {
    return this.store.size;
  }

  /** Remove all expired entries. */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

// --- Hash Utility ---

/** SHA-256 hash of normalized (lowercased, trimmed) message text. */
export function hashMessage(message: string): string {
  return createHash("sha256")
    .update(message.toLowerCase().trim())
    .digest("hex");
}

// --- Singleton ---

export const responseCache = new ResponseCache<CachedStreamData>(200);

// Periodic cleanup every 5 minutes (same pattern as rate-limit.ts)
setInterval(() => {
  responseCache.cleanup();
}, 300_000);
