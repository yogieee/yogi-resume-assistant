"use client";

interface AutocompleteProps {
  suggestions: string[];
  onSelect: (command: string) => void;
}

export function Autocomplete({ suggestions, onSelect }: AutocompleteProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-4 pb-2">
      {suggestions.map((cmd) => (
        <button
          key={cmd}
          type="button"
          onClick={() => onSelect(cmd)}
          className="px-2 py-0.5 text-xs rounded bg-console-surface border border-console-border text-glow-green hover:bg-console-border transition-colors cursor-pointer"
        >
          {cmd}
        </button>
      ))}
    </div>
  );
}
