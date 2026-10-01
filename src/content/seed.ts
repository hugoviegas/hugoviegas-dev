// Builds the Firestore seed from the current hard-coded content. Imported by the
// admin "Import seed" action, the snapshot script, and tests; never by public pages.
import { getTranslation } from "@/config/translations";
import storyEn from "../../public/projects/big-bang-duel/story.en.md?raw";
import storyPt from "../../public/projects/big-bang-duel/story.pt.md?raw";
import {
  cvSkills,
  legacyCertifications,
  legacyFocus,
  legacyItSkills,
  legacyProgrammingSkills,
  legacyProjects,
  type LegacySkill,
} from "./legacy";
import type {
  AboutDoc,
  ContentCollection,
  DocByCollection,
  EducationDoc,
  ExperienceDoc,
  Localized,
  ProjectDetailDoc,
  ProjectDoc,
  SkillDoc,
  SkillGroup,
  TimelineText,
} from "./types";

export interface SeedEntry<C extends ContentCollection = ContentCollection> {
  collection: C;
  doc: DocByCollection[C];
}

const localize = <T>(build: (t: (key: string) => string) => T): Localized<T> => ({
  en: build((key) => getTranslation(key, "EN")),
  ptBR: build((key) => getTranslation(key, "PT")),
});

const meta = (id: string, index: number, published = true) => ({
  id,
  published,
  // Gaps of 10 leave room to reorder without renumbering.
  order: index * 10,
  updatedAt: null,
  version: 0,
});

// Bullet counts match the entries rendered by ExperienceSection before the migration.
const timeline = (prefix: string, bulletCount: number) =>
  localize<TimelineText>((t) => ({
    title: t(`${prefix}.title`),
    organization: t(`${prefix}.company`),
    location: t(`${prefix}.location`),
    period: t(`${prefix}.period`),
    description: t(`${prefix}.description`),
    bullets: Array.from({ length: bulletCount }, (_, i) => t(`${prefix}.a${i + 1}`)),
  }));

const experience: ExperienceDoc[] = [
  { ...meta("erin-college", 0), ...timeline("exp.erin", 8) },
  { ...meta("freelance-web-developer", 1), ...timeline("exp.freelance", 2) },
  { ...meta("etal", 2), ...timeline("exp.etal", 6) },
  { ...meta("dabliumusic", 3), ...timeline("exp.dabliu", 4) },
];

const education: EducationDoc[] = [
  { ...meta("cct-college", 0), ...timeline("edu.cct", 6) },
  { ...meta("icot", 1), ...timeline("edu.icot", 0) },
  { ...meta("unicnec", 2), ...timeline("edu.unicnec", 6) },
];

const projects: ProjectDoc[] = legacyProjects.map((project, index) => ({
  ...meta(project.id, index, project.published),
  image: project.image,
  imageWidth: project.imageWidth,
  imageHeight: project.imageHeight,
  technologies: project.technologies,
  liveUrl: project.liveUrl,
  githubUrl: project.githubUrl,
  detailPath: project.detailPath,
  ...localize((t) => ({
    title: t(project.titleKey),
    description: t(project.descriptionKey),
    // The card image alt was the project title.
    imageAlt: t(project.titleKey),
  })),
}));

const slug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Skills are deduplicated by label, ignoring case (for example "PHP" / "php").
export const skillKey = (label: string) => label.trim().toLowerCase();

const skillDocs = (
  group: SkillGroup,
  skills: LegacySkill[],
  published: boolean,
  startIndex = 0,
): SkillDoc[] =>
  skills.map((skill, index) => ({
    ...meta(`${group}-${slug(skill.en)}`, startIndex + index, published),
    group,
    iconKey: skill.iconKey ?? "",
    en: { label: skill.en },
    ptBR: { label: skill.ptBR },
  }));

const siteSkills: SkillDoc[] = [
  ...skillDocs("programming", legacyProgrammingSkills, true),
  ...skillDocs("it", legacyItSkills, true),
  ...skillDocs("certification", legacyCertifications, true),
  ...skillDocs("focus", legacyFocus, true),
];

const siteSkillKeys = new Set(siteSkills.map((skill) => skillKey(skill.en.label)));

// CV skills not already on the site, as unpublished drafts for Hugo to review.
export const cvDuplicates = cvSkills.filter((skill) => siteSkillKeys.has(skillKey(skill.en)));
const cvDrafts = (["programming", "it"] as const).flatMap((group) => {
  const existing = siteSkills.filter((skill) => skill.group === group).length;
  return skillDocs(
    group,
    cvSkills.filter((skill) => skill.group === group && !siteSkillKeys.has(skillKey(skill.en))),
    false,
    existing,
  );
});

const skills: SkillDoc[] = [...siteSkills, ...cvDrafts];

const about: AboutDoc[] = [
  {
    ...meta("main", 0),
    ...localize((t) => ({
      summary: [t("journeySummary1"), t("journeySummary2")],
      highlights: [1, 2, 3, 4].map((n) => ({
        title: t(`highlight${n}Title`),
        description: t(`highlight${n}Desc`),
      })),
      fullStory: t("fullStory"),
    })),
  },
];

const noStory = { storyTitle: "", storyIntro: "", story: "" };

const projectDetails: ProjectDetailDoc[] = [
  {
    ...meta("darcy-mcgees", 0),
    // Formerly STACK in DarcyProject.tsx.
    stack: ["React", "TypeScript", "Vite", "Tailwind", "shadcn/ui", "Supabase (real) / localStorage (demo)"],
    ...localize((t) => ({
      title: t("darcyTitle"),
      summary: t("darcySummary"),
      sections: [],
      faq: [],
      ...noStory,
    })),
  },
  {
    ...meta("big-bang-duel", 1),
    stack: [
      "bigBangTechReact",
      "bigBangTechTypeScript",
      "bigBangTechVite",
      "bigBangTechTailwind",
      "bigBangTechZustand",
      "bigBangTechFirebaseAuth",
      "bigBangTechFirestore",
      "bigBangTechRealtime",
    ].map((key) => getTranslation(key, "EN")),
    en: { ...bigBangText("EN"), story: storyEn },
    ptBR: { ...bigBangText("PT"), story: storyPt },
  },
];

function bigBangText(language: "EN" | "PT") {
  const t = (key: string) => getTranslation(key, language);
  return {
    title: t("bigBangTitle"),
    summary: t("bigBangSummary"),
    sections: [
      {
        id: "try",
        title: t("bigBangTryTitle"),
        body: t("bigBangTryBody"),
        items: ["Guest", "Google", "Journey", "Access"].map((k) => t(`bigBangTryItem${k}`)),
      },
      {
        id: "built",
        title: t("bigBangBuiltTitle"),
        body: "",
        items: ["Experience", "Product", "Flow"].map((k) => t(`bigBangBuiltItem${k}`)),
      },
      {
        id: "challenges",
        title: t("bigBangChallengesTitle"),
        body: "",
        items: ["Responsive", "Guest", "Systems", "Friction"].map((k) => t(`bigBangChallenge${k}`)),
      },
    ],
    faq: Array.from({ length: 10 }, (_, i) => ({
      question: t(`bigBangFaq.q${i + 1}`),
      answer: t(`bigBangFaq.a${i + 1}`),
    })),
    storyTitle: t("bigBangStoryTitle"),
    storyIntro: t("bigBangStoryIntro"),
  };
}

export const buildSeed = (): SeedEntry[] => [
  ...experience.map((doc) => ({ collection: "experience" as const, doc })),
  ...education.map((doc) => ({ collection: "education" as const, doc })),
  ...projects.map((doc) => ({ collection: "projects" as const, doc })),
  ...skills.map((doc) => ({ collection: "skills" as const, doc })),
  ...about.map((doc) => ({ collection: "about" as const, doc })),
  ...projectDetails.map((doc) => ({ collection: "projectDetails" as const, doc })),
];
