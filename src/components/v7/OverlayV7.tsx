import type { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * V7 overlay system — one modal and one bottom sheet, both on Radix Dialog
 * so focus trapping, escape handling, and ARIA come for free.
 */

export const OverlayRoot = DialogPrimitive.Root;
export const OverlayTrigger = DialogPrimitive.Trigger;
export const OverlayClose = DialogPrimitive.Close;

function Scrim({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "scrim fixed inset-0 z-50 animate-fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out",
        className,
      )}
    />
  );
}

export function ModalV7({
  title,
  description,
  children,
  footer,
  className,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <Scrim />
      <DialogPrimitive.Content
        className={cn(
          "modal-panel fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 p-6 animate-scale-in",
          className,
        )}
      >
        <DialogPrimitive.Title className="text-title text-xl text-foreground">
          {title}
        </DialogPrimitive.Title>
        {description && (
          <DialogPrimitive.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </DialogPrimitive.Description>
        )}
        {children && <div className="mt-5">{children}</div>}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
        <DialogPrimitive.Close
          aria-label="Close"
          className="btn-base btn-ghost absolute right-4 top-4 h-9 w-9 rounded-full"
        >
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetV7({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <Scrim />
      <DialogPrimitive.Content
        className={cn(
          "sheet-panel scroll-fluid fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] w-full max-w-md overflow-y-auto animate-slide-up-sheet",
          className,
        )}
      >
        <div className="sheet-grabber" />
        <div className="px-6 pb-8 pt-5">
          <DialogPrimitive.Title className="text-title text-xl text-foreground">
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </DialogPrimitive.Description>
          )}
          {children && <div className="mt-5">{children}</div>}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
