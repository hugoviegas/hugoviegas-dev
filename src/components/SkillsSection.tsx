import FlatBrick from "@/components/brand/FlatBrick";
import type { BrickColor } from "@/components/brand/brickColors";
import { SectionHeading, sectionContainer } from "@/components/sections/Section";
import { useLanguage } from "@/hooks/useLanguage";
import { useContentLang, useCoreContent } from "@/content/store";
import type { SkillGroup } from "@/content/types";
import type { SkillIconKey } from "@/content/skillIcons";
import { fallbackIcon, skillIcons, type SkillIcon } from "@/components/skillIconMap";

interface Skill extends SkillIcon {
  name: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

// Compact grouped list of small tags. Wraps cleanly down to 320px.
const SkillTag = ({ skill }: { skill: Skill }) => {
  const Icon = skill.icon;
  return (
    <li className="inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-full bg-surface-2 py-1 pl-2 pr-3 text-sm font-medium text-ink-2">
      <Icon className="h-4 w-4 shrink-0" />
      <span className="break-words">{skill.name}</span>
    </li>
  );
};

const SkillsSection = () => {
  const { t } = useLanguage();
  const lang = useContentLang();
  const { skills } = useCoreContent();
  const skillsOf = (group: SkillGroup): Skill[] =>
    skills
      .filter((skill) => skill.group === group)
      .map((skill) => ({
        name: skill[lang].label,
        ...(skillIcons[skill.iconKey as SkillIconKey] ?? fallbackIcon),
      }));

  const groups: { title: string; brick: BrickColor; items: Skill[] }[] = [
    { title: t("skillsProgramming"), brick: "green", items: skillsOf("programming") },
    { title: t("skillsIt"), brick: "darkGray", items: skillsOf("it") },
  ];

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative z-10 pt-[72px] lg:pt-24">
      <div className={sectionContainer}>
        <SectionHeading id="skills-title" index="03" title={t("skillsHeading")} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) =>
            group.items.length > 0 ? (
              <div key={group.title} className="rounded-lg border border-border bg-card p-6 shadow-e2">
                <h3 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-foreground">
                  <FlatBrick studs={1} pitch={14} color={group.brick} />
                  {group.title}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <SkillTag key={skill.name} skill={skill} />
                  ))}
                </ul>
              </div>
            ) : null,
          )}
          <div className="rounded-lg border border-border bg-card p-6 shadow-e2 md:col-span-2 lg:col-span-1">
            <h3 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-foreground">
              <FlatBrick studs={1} pitch={14} color="lightGray" />
              {t("languagesTitle")}
            </h3>
            <ul className="flex flex-wrap gap-2">
              <li className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-sm font-medium text-ink-2">
                {t("portuguese")} · {t("native")}
              </li>
              <li className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-sm font-medium text-ink-2">
                {t("english")} · {t("c1Proficiency")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
