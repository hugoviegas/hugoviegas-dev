import { cn } from "@/lib/utils";

// Gold coin: the only gold on the site. Marks the active nav item.
export const CoinMarker = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false" className={cn("h-3.5 w-3.5", className)}>
    <circle cx="7" cy="7" r="6.5" fill="#b8860b" />
    <circle cx="7" cy="7" r="5.4" fill="#f2b705" />
    <circle cx="7" cy="7" r="3" fill="none" stroke="#d99a00" strokeWidth="1.2" />
    <path d="M3.6 5.2a3.8 3.8 0 0 1 2.4-2" stroke="#ffe08a" strokeWidth="1.1" fill="none" strokeLinecap="round" />
  </svg>
);

// Neutral dot for inactive nav items.
export const NavDot = ({ className }: { className?: string }) => (
  <span aria-hidden="true" className={cn("block h-1.5 w-1.5 rounded-full bg-dot", className)} />
);
