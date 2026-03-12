import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-dvh flex items-center justify-center bg-console-bg font-mono">
      <div className="max-w-md text-center space-y-4 p-8">
        <div className="flex justify-center gap-2 mb-6">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>

        <h1 className="text-glow-amber text-4xl font-bold">404</h1>
        <p className="text-console-text-dim text-sm">
          Page not found. This route doesn&apos;t exist in the terminal.
        </p>

        <div className="bg-console-surface border border-console-border rounded-md p-4 text-left">
          <p className="text-glow-green text-xs">
            <span className="text-console-text-dim">yogi@portfolio %</span> cd /unknown
          </p>
          <p className="text-glow-red text-xs mt-1">
            bash: cd: /unknown: No such file or directory
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-4 py-2 text-sm border border-glow-green/40 text-glow-green rounded-md hover:bg-glow-green/10 transition-colors"
        >
          Return to Terminal
        </Link>
      </div>
    </div>
  );
}
