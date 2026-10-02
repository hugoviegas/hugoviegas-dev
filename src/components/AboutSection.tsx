import { useState } from "react";
import FlatBrick from "@/components/brand/FlatBrick";
import { brickColorClass, type BrickColor } from "@/components/brand/brickColors";
import { SectionHeading, sectionContainer } from "@/components/sections/Section";
import StarWarsCrawlOverlay from "@/components/StarWarsCrawl";
import { useLanguage } from "@/hooks/useLanguage";
import { useContentLang, useCoreContent } from "@/content/store";
import { cn } from "@/lib/utils";

// Short summary, a few highlight chips and an opt-in entry to the full story.
// The opening-crawl story is the only Star Wars moment on the page and never
// auto-plays; reduced motion opens it as static, scrollable text.

const BOOKS: { color: BrickColor; size: string; tilt?: boolean }[] = [
  { color: "darkGray", size: "h-[92px] w-6" },
  { color: "white", size: "h-[110px] w-7" },
  { color: "green", size: "h-[124px] w-8" },
  { color: "lightGray", size: "h-[98px] w-[22px]" },
  { color: "green", size: "h-[104px] w-[26px] ml-1.5", tilt: true },
];

const AboutSection = () => {
  const { t, language } = useLanguage();
  const lang = useContentLang();
  const about = useCoreContent().about[0]?.[lang];
  const [isCrawlOpen, setIsCrawlOpen] = useState(false);
  const episodeLabel = language === "PT" ? "Episódio I" : "Episode I";
  const introText =
    language === "PT"
      ? "Há muito tempo, em uma galáxia não muito distante..."
      : "A long time ago in a galaxy far, far away....";

  return (
    <section id="about" aria-labelledby="about-title" className="relative z-10 pt-[72px] lg:pt-24">
      <div className={sectionContainer}>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <SectionHeading id="about-title" index="04" title={t("aboutHeading")} />
            {about?.summary[0] && <p className="-mt-2 max-w-[60ch] text-[17px] text-ink-2 sm:text-lg">{about.summary[0]}</p>}
            {about && about.highlights.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {about.highlights.map((item) => (
                  <li
                    key={item.title}
                    className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-surface-2 py-1 pl-2.5 pr-3 text-sm font-medium text-ink-2"
                  >
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-[2px] bg-brand-decor" />
                    {item.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {about?.fullStory && (
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setIsCrawlOpen(true)}
              className="flex w-full flex-col items-start gap-6 rounded-lg border border-border bg-card p-6 text-left text-foreground shadow-e2 transition-[transform,box-shadow] duration-base ease-out hover:-translate-y-[3px] hover:shadow-e3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex-row sm:items-end"
            >
              {/* A LEGO book on a shelf */}
              <span aria-hidden="true" className="relative h-[150px] w-[168px] shrink-0">
                <span className="absolute inset-x-3 bottom-[7px] flex items-end gap-[3px]">
                  {BOOKS.map((book, i) => (
                    <span
                      key={i}
                      className={cn(
                        "relative rounded-t-[3px] rounded-b-[1px] bg-[var(--bl)] shadow-[inset_0_1px_0_var(--be),inset_-5px_0_0_var(--br),0_0_0_0.5px_var(--bo)] before:absolute before:left-1 before:right-[9px] before:top-3.5 before:h-[3px] before:bg-[var(--be)] before:opacity-70 after:absolute after:bottom-3.5 after:left-1 after:right-[9px] after:h-[3px] after:bg-[var(--be)] after:opacity-70",
                        brickColorClass[book.color],
                        book.size,
                        book.tilt && "origin-bottom-left -rotate-[8deg]",
                      )}
                    />
                  ))}
                </span>
                <FlatBrick studs={14} pitch={12} plate color="darkGray" className="absolute inset-x-0 bottom-0" />
              </span>
              <span>
                <span className="block text-lg font-bold">{t("storyCta")}</span>
                <span className="mt-1 block text-sm text-ink-3">{t("storySub")}</span>
              </span>
            </button>
          )}
        </div>
      </div>
      <StarWarsCrawlOverlay
        open={isCrawlOpen}
        onClose={() => setIsCrawlOpen(false)}
        title={t("fullStoryTitle")}
        story={about?.fullStory ?? ""}
        episodeLabel={episodeLabel}
        introText={introText}
      />
    </section>
  );
};

export default AboutSection;
