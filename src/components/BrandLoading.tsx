import { AsviorMark } from "@/components/AsviorMark";

export function BrandLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="brand-loading" role="status" aria-live="polite">
      <AsviorMark className="h-16 w-16" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
