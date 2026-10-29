import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  width = "max-w-lg",
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-charcoal/40" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2",
            "rounded-card border border-sand bg-white p-6 shadow-elevated focus:outline-none",
            "max-h-[calc(100vh-64px)] overflow-y-auto",
            width
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogPrimitive.Title className="text-lg font-semibold text-charcoal">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-1 text-sm text-charcoal/60">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="Close dialog"
                className="rounded-control p-1.5 text-charcoal/50 hover:bg-sand/60 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>
          </div>

          {children && <div className="mt-4">{children}</div>}

          {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}