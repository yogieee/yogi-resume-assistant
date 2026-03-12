import { portfolio } from "@/data/portfolio";

export function HireOutput() {
  const email = portfolio.contact.find((c) => c.type === "email");
  const linkedin = portfolio.contact.find((c) => c.type === "linkedin");

  return (
    <div className="space-y-3 mt-2">
      <div className="text-glow-green font-bold">
        Let&apos;s Work Together
      </div>

      <div className="text-console-text">
        I&apos;m open to freelance projects, consulting, and collaboration opportunities.
      </div>

      <div className="space-y-1">
        <div className="text-glow-amber font-bold text-sm">What I can help with:</div>
        <div className="text-console-text-dim">
          - Cloud architecture &amp; serverless systems (AWS)
        </div>
        <div className="text-console-text-dim">
          - AI-powered platforms &amp; document intelligence
        </div>
        <div className="text-console-text-dim">
          - SaaS product development (full-stack)
        </div>
        <div className="text-console-text-dim">
          - Enterprise system modernisation
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-glow-amber font-bold text-sm">Get in touch:</div>
        {email && (
          <div className="text-console-text-dim">
            <span className="text-glow-cyan">Email:</span>{" "}
            <a href={email.url} className="text-glow-green hover:underline">
              {email.value}
            </a>
          </div>
        )}
        {linkedin && (
          <div className="text-console-text-dim">
            <span className="text-glow-cyan">LinkedIn:</span>{" "}
            <a
              href={linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-glow-green hover:underline"
            >
              {linkedin.url}
            </a>
          </div>
        )}
      </div>

      <div className="text-console-text-dim text-xs italic">
        Also try: contact, projects, architecture
      </div>
    </div>
  );
}
