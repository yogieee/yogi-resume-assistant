import { portfolio } from "@/data/portfolio";

export function ContactOutput() {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">Contact Information</div>
      <div className="space-y-1">
        {portfolio.contact.map((item) => (
          <div key={item.type} className="flex">
            <span className="text-glow-cyan w-20 shrink-0">{item.label}</span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-glow-amber hover:underline"
            >
              {item.value}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
