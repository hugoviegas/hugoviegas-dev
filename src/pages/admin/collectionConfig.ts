// What each content collection looks like in the admin: its fields, its
// empty doc, and how a row is labelled. Field names match src/content/types.ts.
import { SKILL_ICON_KEYS } from "@/content/skillIcons";
import {
  SKILL_GROUPS,
  type ContentCollection,
  type ContentLang,
  type DocByCollection,
  type DocMeta,
} from "@/content/types";
import type { AdminStringKey } from "./adminStrings";

export type FieldKind = "text" | "textarea" | "lines" | "number" | "select" | "objects" | "image";

export interface FieldDef {
  name: string;
  label: AdminStringKey;
  kind: FieldKind;
  rows?: number;
  options?: readonly string[];
  // Sub-fields of each item in an "objects" list.
  fields?: FieldDef[];
  hint?: AdminStringKey;
}

export interface CollectionDef {
  collection: ContentCollection;
  label: AdminStringKey;
  // Fields inside the `en` and `ptBR` blocks, edited side by side.
  localized: FieldDef[];
  // Language-neutral fields.
  shared: FieldDef[];
  empty: () => Record<string, unknown>;
  // Reorder happens within the same scope (skills: per group).
  scope?: (doc: DocMeta) => string;
  hint?: AdminStringKey;
}

const timeline: FieldDef[] = [
  { name: "title", label: "field.title", kind: "text" },
  { name: "organization", label: "field.organization", kind: "text" },
  { name: "location", label: "field.location", kind: "text" },
  { name: "period", label: "field.period", kind: "text" },
  { name: "description", label: "field.description", kind: "textarea", rows: 3 },
  { name: "bullets", label: "field.bullets", kind: "lines", rows: 6, hint: "hint.onePerLine" },
];

const emptyTimeline = () => ({
  title: "",
  organization: "",
  location: "",
  period: "",
  description: "",
  bullets: [],
});

export const collectionDefs: Record<ContentCollection, CollectionDef> = {
  experience: {
    collection: "experience",
    label: "col.experience",
    localized: timeline,
    shared: [],
    empty: () => ({ en: emptyTimeline(), ptBR: emptyTimeline() }),
  },
  education: {
    collection: "education",
    label: "col.education",
    localized: timeline,
    shared: [],
    empty: () => ({ en: emptyTimeline(), ptBR: emptyTimeline() }),
  },
  projects: {
    collection: "projects",
    label: "col.projects",
    localized: [
      { name: "title", label: "field.title", kind: "text" },
      { name: "description", label: "field.description", kind: "textarea", rows: 3 },
      { name: "imageAlt", label: "field.imageAlt", kind: "text" },
    ],
    shared: [
      { name: "image", label: "field.image", kind: "image" },
      { name: "imageWidth", label: "field.imageWidth", kind: "number" },
      { name: "imageHeight", label: "field.imageHeight", kind: "number" },
      { name: "technologies", label: "field.technologies", kind: "lines", rows: 4, hint: "hint.onePerLine" },
      { name: "liveUrl", label: "field.liveUrl", kind: "text", hint: "hint.httpsOrEmpty" },
      { name: "githubUrl", label: "field.githubUrl", kind: "text", hint: "hint.httpsOrEmpty" },
      { name: "detailPath", label: "field.detailPath", kind: "text", hint: "hint.detailPath" },
    ],
    empty: () => ({
      image: "",
      imageWidth: 0,
      imageHeight: 0,
      technologies: [],
      liveUrl: "",
      githubUrl: "",
      detailPath: "",
      en: { title: "", description: "", imageAlt: "" },
      ptBR: { title: "", description: "", imageAlt: "" },
    }),
  },
  projectDetails: {
    collection: "projectDetails",
    label: "col.projectDetails",
    hint: "hint.projectDetails",
    localized: [
      { name: "title", label: "field.title", kind: "text" },
      { name: "summary", label: "field.summary", kind: "textarea", rows: 3 },
      {
        name: "sections",
        label: "field.sections",
        kind: "objects",
        fields: [
          { name: "id", label: "field.sectionId", kind: "text", hint: "hint.sectionId" },
          { name: "title", label: "field.title", kind: "text" },
          { name: "body", label: "field.body", kind: "textarea", rows: 3 },
          { name: "items", label: "field.items", kind: "lines", rows: 4, hint: "hint.onePerLine" },
        ],
      },
      {
        name: "faq",
        label: "field.faq",
        kind: "objects",
        fields: [
          { name: "question", label: "field.question", kind: "text" },
          { name: "answer", label: "field.answer", kind: "textarea", rows: 3 },
        ],
      },
      { name: "storyTitle", label: "field.storyTitle", kind: "text" },
      { name: "storyIntro", label: "field.storyIntro", kind: "textarea", rows: 2 },
      { name: "story", label: "field.story", kind: "textarea", rows: 12, hint: "hint.markdown" },
    ],
    shared: [{ name: "stack", label: "field.stack", kind: "lines", rows: 4, hint: "hint.onePerLine" }],
    empty: () => {
      const text = { title: "", summary: "", sections: [], faq: [], storyTitle: "", storyIntro: "", story: "" };
      return { stack: [], en: { ...text }, ptBR: { ...text } };
    },
  },
  skills: {
    collection: "skills",
    label: "col.skills",
    localized: [{ name: "label", label: "field.label", kind: "text" }],
    shared: [
      { name: "group", label: "field.group", kind: "select", options: SKILL_GROUPS },
      { name: "iconKey", label: "field.iconKey", kind: "select", options: ["", ...SKILL_ICON_KEYS] },
    ],
    empty: () => ({ group: "programming", iconKey: "", en: { label: "" }, ptBR: { label: "" } }),
    scope: (doc) => String((doc as DocByCollection["skills"]).group),
  },
  about: {
    collection: "about",
    label: "col.about",
    localized: [
      { name: "summary", label: "field.paragraphs", kind: "lines", rows: 8, hint: "hint.onePerLine" },
      {
        name: "highlights",
        label: "field.highlights",
        kind: "objects",
        fields: [
          { name: "title", label: "field.title", kind: "text" },
          { name: "description", label: "field.description", kind: "text" },
        ],
      },
      { name: "fullStory", label: "field.fullStory", kind: "textarea", rows: 12 },
    ],
    shared: [],
    empty: () => {
      const text = { summary: [], highlights: [], fullStory: "" };
      return { en: { ...text }, ptBR: { ...text } };
    },
  },
};

export const ADMIN_COLLECTIONS: ContentCollection[] = [
  "experience",
  "education",
  "projects",
  "projectDetails",
  "skills",
  "about",
];

// The text shown for a doc in the list.
export const rowTitle = (name: ContentCollection, doc: DocMeta, lang: ContentLang) => {
  const block = (doc as unknown as Record<ContentLang, Record<string, unknown>>)[lang] ?? {};
  const text = String(block.title || block.label || "").trim();
  switch (name) {
    case "experience":
    case "education":
      return [text, String(block.organization ?? "")].filter(Boolean).join(" · ") || doc.id;
    case "skills":
      return text || doc.id;
    case "about":
      return doc.id;
    default:
      return text || doc.id;
  }
};
