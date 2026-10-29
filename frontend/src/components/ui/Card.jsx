import { cn } from "../../lib/utils";

export default function Card({ className, padded = true, children, ...rest }) {
  return (
    <div
      className={cn(
        "rounded-card border border-sand bg-white shadow-subtle",
        padded && "p-5",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}