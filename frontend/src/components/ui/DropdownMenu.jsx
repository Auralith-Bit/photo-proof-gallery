import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "../../lib/utils";

export function DropdownMenu({ trigger, children, align = "end" }) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          sideOffset={6}
          className="z-50 min-w-[190px] rounded-control border border-sand bg-white p-1 shadow-elevated focus:outline-none"
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

export function DropdownMenuLabel({ children }) {
  return (
    <DropdownMenuPrimitive.Label className="px-2.5 py-1.5 text-xs font-medium text-charcoal/50">
      {children}
    </DropdownMenuPrimitive.Label>
  );
}

export function DropdownMenuItem({ children, danger = false, disabled, onSelect }) {
  return (
    <DropdownMenuPrimitive.Item
      onSelect={onSelect}
      disabled={disabled}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none",
        "data-[highlighted]:bg-ivory data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        danger
          ? "text-error data-[highlighted]:bg-error/10"
          : "text-charcoal"
      )}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownMenuSeparator() {
  return <DropdownMenuPrimitive.Separator className="my-1 h-px bg-sand" />;
}