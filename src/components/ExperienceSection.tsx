import { MapPin, Calendar, BookOpen, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

/** Company names stay untranslated; every other string comes from translations. */
const EXPERIENCE_IDS = [1, 2, 3, 4, 5] as const;
const COMPANIES: Record<number, string> = {
  1: "Erin College, Dublin",
  2: "ETAL Prestação de Serviços",
  3: "DabliuMusic",
  4: "CCT College Dublin",
  5: "UNICNEC",
};

const CERTIFICATION_IDS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const FOCUS_IDS = [1, 2, 3, 4, 5, 6] as const;

const KEY_STATS = [
  { value: "90%", labelKey: "stats.processReduction", tone: "text-primary" },
  { value: "+20%", labelKey: "stats.viewsGrowth", tone: "text-secondary" },
  {
    value: "4+",
    labelKey: "stats.yearsExperience",
    tone: "text-brand-accent",
  },
  { value: "2", labelKey: "stats.countriesWorked", tone: "text-primary" },
];

const ExperienceSection = () => {
  const { t } = useLanguage();

  return (
    <section id="experience" className="section-shell bg-muted/20">
      <div className="section-wrapper">
        <div className="fade-in mb-12 text-center md:mb-16">
          <h2 className="heading-section mb-4">{t("experienceTitle")}</h2>
          <p className="body-text mx-auto max-w-3xl">{t("experienceIntro")}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Timeline column */}
          <div className="slide-up space-y-8">
            <h3 className="heading-card text-gradient">{t("timelineTitle")}</h3>

            <div className="relative">
              {/* Timeline rail */}
              <div
                className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-primary to-secondary md:left-8"
                aria-hidden="true"
              />

              {EXPERIENCE_IDS.map((id) => (
                <div
                  key={id}
                  className="relative pb-10 pl-12 last:pb-0 md:pl-20"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[9px] top-6 h-4 w-4 rounded-full border-4 border-background bg-primary shadow-lg md:left-[25px]"
                    aria-hidden="true"
                  />

                  <div className="glass-card p-5 transition-transform duration-300 hover:-translate-y-0.5 md:p-6">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="border-primary/50 text-primary"
                      >
                        <Calendar className="mr-1 h-3 w-3" />
                        {t(`exp.${id}.period`)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-secondary/50 text-secondary"
                      >
                        <MapPin className="mr-1 h-3 w-3" />
                        {t(`exp.${id}.location`)}
                      </Badge>
                    </div>

                    <h4 className="mb-1 text-lg font-bold text-foreground md:text-xl">
                      {t(`exp.${id}.title`)}
                    </h4>
                    <p className="mb-3 font-semibold text-primary">
                      {COMPANIES[id]}
                    </p>
                    <p className="caption-text mb-4">
                      {t(`exp.${id}.description`)}
                    </p>

                    <ul className="space-y-2">
                      {[1, 2, 3, 4].map((a) => (
                        <li key={a} className="flex items-start gap-2">
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent"
                            aria-hidden="true"
                          />
                          <span className="text-sm text-muted-foreground">
                            {t(`exp.${id}.a${a}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Focus, certifications & stats column */}
          <div className="slide-up space-y-8 delay-300">
            <div className="glass-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <BookOpen className="h-6 w-6 shrink-0 text-primary" />
                <h3 className="heading-card text-gradient">
                  {t("currentFocusLabel")}
                </h3>
              </div>
              <p className="caption-text mb-4">{t("currentFocusText")}</p>
              <div className="flex flex-wrap gap-2">
                {FOCUS_IDS.map((id) => (
                  <Badge
                    key={id}
                    variant="outline"
                    className="border-primary/30 bg-primary/10 text-primary"
                  >
                    {t(`focus.${id}`)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <Award className="h-6 w-6 shrink-0 text-secondary" />
                <h3 className="heading-card text-gradient">
                  {t("certificationsTitle")}
                </h3>
              </div>
              <ul className="grid grid-cols-1 gap-1">
                {CERTIFICATION_IDS.map((id) => (
                  <li
                    key={id}
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/60"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-brand-accent"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-muted-foreground">
                      {t(`cert.${id}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {KEY_STATS.map((stat) => (
                <div
                  key={stat.labelKey}
                  className="glass-card p-6 text-center transition-all duration-300 hover:neon-glow"
                >
                  <div className={`mb-2 text-3xl font-bold ${stat.tone}`}>
                    {stat.value}
                  </div>
                  <div className="caption-text">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ExperienceSection };
export default ExperienceSection;
