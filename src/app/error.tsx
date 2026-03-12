"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="h-dvh flex items-center justify-center bg-console-bg font-mono">
      <div className="max-w-md text-center space-y-4 p-8">
        <div className="flex justify-center gap-2 mb-6">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>

        <h1 className="text-glow-red text-2xl font-bold">
          System Error
        </h1>
        <p className="text-console-text-dim text-sm">
          Something went wrong. The terminal encountered an unexpected error.
        </p>

        <div className="bg-console-surface border border-console-border rounded-md p-4 text-left">
          <p className="text-glow-green text-xs">
            <span className="text-console-text-dim">yogi@portfolio %</span> diagnose
          </p>
          <p className="text-glow-red text-xs mt-1">
            Error: {error.message || "Unknown error"}
          </p>
          {error.digest && (
            <p className="text-console-text-dim text-xs mt-1">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <button
          onClick={reset}
          className="px-4 py-2 text-sm border border-glow-green/40 text-glow-green rounded-md hover:bg-glow-green/10 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
