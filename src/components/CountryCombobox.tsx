import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { computeComboboxViewport } from "@/lib/combobox-viewport";

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
  return (
    String.fromCodePoint(A + (code.charCodeAt(0) - 65)) +
    String.fromCodePoint(A + (code.charCodeAt(1) - 65))
  );
}

export function CountryCombobox({
  value,
  onChange,
  options,
  placeholder = "Search country...",
  id,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuStyle, setMenuStyle] = useState<Record<string, string | number>>({});
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateMenuPlacement = useCallback(() => {
    if (!open || !triggerRef.current || typeof window === "undefined") return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportHeight = viewport?.height ?? window.innerHeight;
    const viewportWidth = viewport?.width ?? window.innerWidth;
    const viewportOffsetTop = viewport?.offsetTop ?? 0;
    const viewportOffsetLeft = viewport?.offsetLeft ?? 0;

    const computed = computeComboboxViewport({
      triggerTop: rect.top - viewportOffsetTop,
      triggerBottom: rect.bottom - viewportOffsetTop,
      triggerLeft: rect.left - viewportOffsetLeft,
      triggerWidth: rect.width,
      viewportWidth,
      viewportHeight,
    });

    if (computed.placeAbove) {
      setMenuStyle({
        position: "fixed",
        top: computed.top + viewportOffsetTop,
        left: computed.left + viewportOffsetLeft,
        width: computed.width,
        height: computed.maxHeight,
        maxHeight: computed.maxHeight,
        transform: "translateY(calc(-100% - 8px))",
      });
      return;
    }

    setMenuStyle({
      position: "fixed",
      top: computed.top + viewportOffsetTop,
      left: computed.left + viewportOffsetLeft,
      width: computed.width,
      height: computed.maxHeight,
      maxHeight: computed.maxHeight,
      transform: "translateY(0)",
    });
  }, [open]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const resizeTarget = window.visualViewport ?? window;
    const handleResize = () => updateMenuPlacement();
    const handleScroll = () => updateMenuPlacement();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    updateMenuPlacement();
    resizeTarget.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("orientationchange", handleResize);
    document.addEventListener("keydown", onKeyDown);

    const mobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (!mobile) inputRef.current?.focus();

    return () => {
      resizeTarget.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("orientationchange", handleResize);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, updateMenuPlacement]);

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) => o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q),
    );
  }, [query, options]);

  const selected = options.find((o) => o.code === value);

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        onClick={() => {
          setOpen((o) => !o);
          requestAnimationFrame(() => updateMenuPlacement());
        }}
        className="premium-card flex min-h-12 w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-navy/20"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? `${flagEmoji(selected.code)} ${selected.name}` : placeholder}
        </span>
        <svg
          className="h-4 w-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            data-country-combobox-menu
            style={menuStyle}
            className="premium-card z-[70] flex flex-col overflow-hidden rounded-xl border border-border bg-card text-popover-foreground shadow-float"
          >
            <div className="shrink-0 border-b border-border p-2">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-navy/20"
              />
            </div>
            <ul
              className="min-h-0 flex-1 overflow-y-auto py-1"
              style={{
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
                touchAction: "pan-y",
              }}
            >
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
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
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
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}
