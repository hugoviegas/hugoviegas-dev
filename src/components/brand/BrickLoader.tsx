import { cn } from "@/lib/utils";

// Three small bricks stacking: used inside buttons and loading states.
// Reduced motion freezes the stack (global rule in index.css).
const BrickLoader = ({ className }: { className?: string }) => (
  <span aria-hidden="true" className={cn("inline-flex h-3.5 items-end gap-0.5", className)}>
    <span className="h-[5px] w-1.5 animate-brick-stack rounded-[1px] bg-current" />
    <span className="h-[5px] w-1.5 animate-brick-stack rounded-[1px] bg-current [animation-delay:150ms]" />
    <span className="h-[5px] w-1.5 animate-brick-stack rounded-[1px] bg-current [animation-delay:300ms]" />
  </span>
);

export default BrickLoader;
