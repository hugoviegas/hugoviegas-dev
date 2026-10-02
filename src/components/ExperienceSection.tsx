import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FlatBrick from "@/components/brand/FlatBrick";
import { SectionHeading, sectionContainer } from "@/components/sections/Section";
import { useLanguage } from "@/hooks/useLanguage";
import { useContentLang, useCoreContent } from "@/content/store";
import { cn } from "@/lib/utils";

// Concise timeline: title, organisation, dates and the highest-impact line.
// "Show more" reveals the summary and remaining bullets. Education sits in
// a smaller block beside it.
export function ExperienceSection() {
  const { t } = useLanguage();
  const lang = useContentLang();
  const { experience, education } = useCoreContent();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative z-10 pt-[72px] lg:pt-24">
      <div className={sectionContainer}>
        <SectionHeading id="experience-title" index="02" title={t("experienceHeading")} />
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-12">
          <ol className="relative before:absolute before:bottom-2 before:left-[9px] before:top-2 before:w-0.5 before:bg-border">
            {experience.map((doc, i) => {
              const item = doc[lang];
              const isOpen = !!open[doc.id];
              const [lead, ...rest] = item.bullets.length > 0 ? item.bullets : [item.description];
              const more = item.bullets.length > 0 ? [item.description, ...rest].filter(Boolean) : [];
              const panelId = `experience-more-${doc.id}`;
              return (
                <li key={doc.id} className="relative pb-8 pl-11 last:pb-0 max-sm:pl-9">
                  <span className="absolute left-0 top-1">
                    <FlatBrick studs={1} pitch={20} color={i === 0 ? "green" : "lightGray"} />
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    <span>{item.title}</span> <span className="font-medium text-ink-2">· </span>
                    <span className="font-medium text-ink-2">{item.organization}</span>
                  </h3>
                  <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
                    <span>{item.period}</span>
                    {item.location && <span> · {item.location}</span>}
                  </p>
                  {lead && <p className="mt-2 max-w-[62ch] text-ink-2">{lead}</p>}
                  {more.length > 0 && (
                    <>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen((prev) => ({ ...prev, [doc.id]: !isOpen }))}
                        className="mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {isOpen ? t("experienceShowLess") : t("experienceShowMore")}
                        <ChevronDown
                          aria-hidden="true"
                          className={cn("h-4 w-4 transition-transform duration-base", isOpen && "rotate-180")}
                        />
                      </button>
                      <ul id={panelId} hidden={!isOpen} className="mt-1 max-w-[62ch] list-disc space-y-1 pl-5 text-ink-2">
                        {more.map((line, j) => (
                          <li key={j}>{line}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              );
            })}
          </ol>

          {education.length > 0 && (
            <aside aria-labelledby="education-title" className="rounded-lg border border-border bg-card p-6 shadow-e2">
              <h3 id="education-title" className="mb-4 text-base font-bold text-foreground">
                {t("educationTitle")}
              </h3>
              <ul>
                {education.map((doc) => {
                  const item = doc[lang];
                  return (
                    <li key={doc.id} className="border-t border-border py-3 last:pb-0">
                      <p className="text-[15px] font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-ink-3">{item.organization}</p>
                      <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">{item.period}</p>
                    </li>
                  );
                })}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
