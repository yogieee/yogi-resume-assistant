import { ProfileCard } from "@/components/profile-card";

export default function Home() {
  return (
    <main className="min-h-screen p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
        {/* Left panel: Profile card area */}
        <aside className="flex items-start lg:items-center justify-center">
          <div className="relative">
            {/* Glow backdrop for glassmorphism visibility */}
            <div className="absolute inset-0 bg-linear-to-br from-glow-cyan/10 via-transparent to-glow-purple/10 rounded-3xl blur-2xl" />
            <ProfileCard />
          </div>
        </aside>

        {/* Right panel: Terminal area */}
        <section className="flex items-stretch">
          <div className="w-full min-h-[400px] lg:min-h-0 rounded-xl border border-console-border bg-console-surface flex items-center justify-center">
            <p className="text-console-text-dim text-sm font-mono">
              Terminal v1.0 -- Phase 3
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
