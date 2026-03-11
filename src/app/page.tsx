export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-mono font-bold text-glow-cyan drop-shadow-[0_0_12px_oklch(0.82_0.15_192/0.6)]">
            Yogi Dev Console v1.0
          </h1>
          <p className="text-console-text-dim text-sm tracking-widest uppercase">
            System initializing...
          </p>
        </div>

        <div className="border border-console-border bg-console-surface shadow-glow-md rounded-lg p-6 max-w-md mx-auto">
          <div className="space-y-3 font-mono text-sm text-left">
            <div className="flex items-center gap-3">
              <span className="text-glow-green font-bold">[&nbsp;&nbsp;OK&nbsp;&nbsp;]</span>
              <span className="text-console-text">Theme engine loaded</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-glow-cyan font-bold">[ READY ]</span>
              <span className="text-console-text">Font subsystem active</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-glow-amber font-bold">[PENDING]</span>
              <span className="text-console-text-dim">Awaiting user input...</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 text-xs text-console-text-dim">
          <span className="text-glow-cyan">cyan</span>
          <span className="text-glow-green">green</span>
          <span className="text-glow-purple">purple</span>
          <span className="text-glow-amber">amber</span>
          <span className="text-glow-red">red</span>
        </div>
      </div>
    </main>
  );
}
