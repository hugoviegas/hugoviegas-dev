// Content model shared by the public site, the admin, the snapshot script, and
// the seed. Firestore docs carry `en` and `ptBR` blocks plus the meta fields;
// the public snapshot keeps only published docs.
import type { LanguageCode } from "../config/languages";

export type ContentLang = "en" | "ptBR";

export const contentLang = (language: LanguageCode): ContentLang =>
  language === "PT" ? "ptBR" : "en";

export interface DocMeta {
  id: string;
  published: boolean;
  order: number;
  // ISO string in the snapshot and in the app; a Firestore timestamp in the DB.
  updatedAt: string | null;
  version: number;
}

export type Localized<T> = { en: T; ptBR: T };

export interface TimelineText {
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  bullets: string[];
}

export type ExperienceDoc = DocMeta & Localized<TimelineText>;
export type EducationDoc = DocMeta & Localized<TimelineText>;

export interface ProjectText {
  title: string;
  description: string;
  imageAlt: string;
}

export interface ProjectDoc extends DocMeta, Localized<ProjectText> {
  // Key of a bundled image (src/content/images.ts), an uploaded Blob URL, or
  // "" when there is none.
  image: string;
  imageWidth: number;
  imageHeight: number;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  detailPath: string;
}

export const SKILL_GROUPS = ["programming", "it", "certification", "focus"] as const;
export type SkillGroup = (typeof SKILL_GROUPS)[number];

export interface SkillDoc extends DocMeta, Localized<{ label: string }> {
  group: SkillGroup;
  // Key of an inline icon in SkillsSection; "" when there is none.
  iconKey: string;
}

export interface Highlight {
  title: string;
  description: string;
}

export interface AboutText {
  summary: string[];
  highlights: Highlight[];
  fullStory: string;
}

export type AboutDoc = DocMeta & Localized<AboutText>;

export interface DetailSection {
  id: string;
  title: string;
  body: string;
  items: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProjectDetailText {
  title: string;
  summary: string;
  sections: DetailSection[];
  faq: FaqItem[];
  storyTitle: string;
  storyIntro: string;
  story: string;
}

export interface ProjectDetailDoc extends DocMeta, Localized<ProjectDetailText> {
  stack: string[];
}

// Files uploaded to the public Vercel Blob store through the admin.
export interface CvFile {
  url: string;
  version: number;
}

export interface ProfilePhoto {
  url: string;
  width: number;
  height: number;
  alt: Localized<string>;
  version: number;
}

// null means "use the bundled fallback".
export interface SiteFiles {
  cv: CvFile | null;
  profilePhoto: ProfilePhoto | null;
}

export interface SiteSettings extends SiteFiles {
  useRemote: boolean;
  updatedAt: string | null;
  version: number;
}

export const CORE_COLLECTIONS = [
  "experience",
  "education",
  "projects",
  "skills",
  "about",
] as const;
export type CoreCollection = (typeof CORE_COLLECTIONS)[number];

export const CONTENT_COLLECTIONS = [...CORE_COLLECTIONS, "projectDetails"] as const;
export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];

export interface CoreContent {
  experience: ExperienceDoc[];
  education: EducationDoc[];
  projects: ProjectDoc[];
  skills: SkillDoc[];
  about: AboutDoc[];
}

export interface CoreSnapshot extends CoreContent {
  // settings/site.updatedAt at generation time; null when generated from seed.
  siteUpdatedAt: string | null;
  source: "seed" | "firestore";
  files: SiteFiles;
}

export interface DetailsSnapshot {
  projectDetails: ProjectDetailDoc[];
}

export type DocByCollection = {
  experience: ExperienceDoc;
  education: EducationDoc;
  projects: ProjectDoc;
  skills: SkillDoc;
  about: AboutDoc;
  projectDetails: ProjectDetailDoc;
};
