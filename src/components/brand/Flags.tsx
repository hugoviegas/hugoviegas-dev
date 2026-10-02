// Inline SVG flags for the language control (no third-party requests).
// Each fills its parent; the parent sets size, radius and clipping.

export const FlagGB = () => (
  <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" className="block h-full w-full">
    <rect width="60" height="30" fill="#012169" />
    <path d="M0 0L60 30M60 0L0 30" stroke="#ffffff" strokeWidth="6" />
    <path d="M0 0L60 30M60 0L0 30" stroke="#C8102E" strokeWidth="2" />
    <path d="M30 0V30M0 15H60" stroke="#ffffff" strokeWidth="10" />
    <path d="M30 0V30M0 15H60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

export const FlagIE = () => (
  <svg viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden="true" focusable="false" className="block h-full w-full">
    <rect width="1" height="2" fill="#169B62" />
    <rect x="1" width="1" height="2" fill="#FFFFFF" />
    <rect x="2" width="1" height="2" fill="#FF883E" />
  </svg>
);

export const FlagBR = () => (
  <svg viewBox="0 0 30 21" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" className="block h-full w-full">
    <rect width="30" height="21" fill="#009C3B" />
    <path d="M15 2.2L27.6 10.5 15 18.8 2.4 10.5z" fill="#FFDF00" />
    <circle cx="15" cy="10.5" r="5.3" fill="#002776" />
    <path d="M9.9 9.4c3.4-.6 7-.1 10 1.8" stroke="#ffffff" strokeWidth="1" fill="none" />
  </svg>
);
