import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

export function Tabs(props) {
  return <TabsPrimitive.Root {...props} />;
}

export function TabsList({ className, children }) {
  return (
    <TabsPrimitive.List
      className={cn("flex gap-1 overflow-x-auto border-b border-sand", className)}
    >
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ value, children, className }) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        "whitespace-nowrap border-b-2 border-transparent px-4 py-2.5 text-sm font-medium",
        "text-charcoal/60 transition-colors hover:text-charcoal",
        "data-[state=active]:border-olive data-[state=active]:text-charcoal",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 rounded-t-control",
        className
      )}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({ value, children, className }) {
  return (
    <TabsPrimitive.Content
      value={value}
      className={cn("mt-4 focus-visible:outline-none", className)}
    >
      {children}
    </TabsPrimitive.Content>
  );
}