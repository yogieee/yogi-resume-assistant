import { portfolio } from "@/data/portfolio";

export function CertificationsOutput() {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">Certifications</div>
      <div className="space-y-1">
        {portfolio.certifications.map((cert) => (
          <div key={cert.name} className="flex gap-2">
            <span
              className={
                cert.status === "Active"
                  ? "text-glow-green"
                  : cert.status === "Inactive"
                    ? "text-console-text-dim"
                    : "text-glow-amber"
              }
            >
              {cert.status === "Active" ? "[x]" : cert.status === "Inactive" ? "[-]" : "[~]"}
            </span>
            <span className="text-console-text">{cert.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
