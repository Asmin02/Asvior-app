import { useEffect, useMemo, useRef, useState } from "react";

export interface CountryOption {
  code: string;
  name: string;
}

interface Props {
  value: string; // ISO2 code
  onChange: (code: string) => void;
  options: CountryOption[];
  placeholder?: string;
  id?: string;
}

function flagEmoji(code: string) {
  if (!code || code.length !== 2) return "";
  const A = 0x1f1e6;
  return String.fromCodePoint(A + (code.charCodeAt(0) - 65)) +
    String.fromCodePoint(A + (code.charCodeAt(1) - 65));
}

export function CountryCombobox({ value, onChange, options, placeholder = "Search country...", id }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q));
  }, [query, options]);

  const selected = options.find((o) => o.code === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-input bg-card px-3 py-2.5 text-left text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? `${flagEmoji(selected.code)} ${selected.name}` : placeholder}
        </span>
        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
          <div className="border-b border-border p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              className="w-full rounded-md bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">No country found</li>
            )}
            {filtered.map((opt) => (
              <li key={opt.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.code);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                    value === opt.code ? "bg-accent/60 font-medium" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none">{flagEmoji(opt.code)}</span>
                    <span>{opt.name}</span>
                  </span>
                  {value === opt.code && (
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
