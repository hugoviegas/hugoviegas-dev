import type { ReactNode } from "react";
import FlatBrick from "@/components/brand/FlatBrick";
import { cn } from "@/lib/utils";

// Shared page rhythm for the redesigned homepage sections.
export const sectionContainer = "relative z-10 mx-auto w-full max-w-[1344px] px-5 sm:px-10 lg:px-12 xl:px-[72px] max-[359px]:px-4";

interface SectionHeadingProps {
  id: string;
  index: string;
  title: string;
  lead?: string;
  aside?: ReactNode;
}

export const SectionHeading = ({ id, index, title, lead, aside }: SectionHeadingProps) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
    <div>
      <p aria-hidden="true" className="mb-2.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
        {index}
      </p>
      <h2
        id={id}
        className="text-[28px] font-extrabold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[32px] lg:text-[36px] xl:text-[40px] max-[359px]:text-[26px]"
      >
        {title}
      </h2>
      {lead && <p className="mt-2 max-w-[60ch] text-base text-ink-2 sm:text-lg xl:text-xl">{lead}</p>}
    </div>
    {aside}
  </div>
);

// Thin line with a couple of drawn bricks; purely decorative.
export const SectionDivider = ({ variant = "a", className }: { variant?: "a" | "b"; className?: string }) => (
  <div aria-hidden="true" className={cn(sectionContainer, "mt-[72px] lg:mt-24", className)}>
    <div className="flex h-3.5 items-end">
      <span className="mb-0.5 h-px flex-1 bg-border" />
      {variant === "a" ? (
        <>
          <FlatBrick studs={2} pitch={14} color="green" />
          <FlatBrick studs={4} pitch={14} plate color="lightGray" />
        </>
      ) : (
        <>
          <FlatBrick studs={2} pitch={14} plate color="lightGray" />
          <FlatBrick studs={1} pitch={14} color="green" />
        </>
      )}
      <span className="mb-0.5 h-px flex-1 bg-border" />
    </div>
  </div>
);
