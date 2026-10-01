// Zod schemas for content docs. Used by the admin, the snapshot script, the
// lazy refresh chunk, and tests; never by the homepage entry.
// Field limits mirror firestore.rules: change both together.
import { z } from "zod";
import { SKILL_GROUPS } from "./types";
import { isStoredBlobUrl } from "./uploadPolicy";

export const LIMITS = {
  id: 100,
  short: 120,
  title: 200,
  period: 80,
  text: 1000,
  url: 300,
  story: 20000,
  list: 30,
  order: 10000,
} as const;

const str = (max: number) => z.string().max(max);
const list = <T extends z.ZodTypeAny>(item: T) => z.array(item).max(LIMITS.list);
// Empty, or an absolute https URL.
const url = z.union([z.literal(""), z.string().max(LIMITS.url).url().startsWith("https://")]);

const meta = {
  id: str(LIMITS.id).regex(/^[a-z0-9-]+$/),
  published: z.boolean(),
  order: z.number().int().min(0).max(LIMITS.order),
  updatedAt: z.string().nullable(),
  version: z.number().int().min(0),
};

// A published doc needs the required text in both languages.
const bilingual = <T extends z.ZodRawShape>(
  shape: T,
  textShape: z.ZodRawShape,
  required: string[],
) =>
  z
    .object({ ...meta, ...shape, en: z.object(textShape), ptBR: z.object(textShape) })
    .superRefine((doc, ctx) => {
      if (!doc.published) return;
      for (const lang of ["en", "ptBR"] as const) {
        const block = doc[lang] as Record<string, unknown>;
        for (const field of required) {
          const value = block[field];
          const empty = Array.isArray(value)
            ? value.length === 0
            : String(value ?? "").trim() === "";
          if (empty) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [lang, field],
              message: "Required in both languages before publishing",
            });
          }
        }
      }
    });

const timelineText = {
  title: str(LIMITS.title),
  organization: str(LIMITS.title),
  location: str(LIMITS.short),
  period: str(LIMITS.period),
  description: str(LIMITS.text),
  bullets: list(str(LIMITS.text)),
};
const timelineRequired = ["title", "organization", "period"];

export const experienceSchema = bilingual({}, timelineText, timelineRequired);
export const educationSchema = bilingual({}, timelineText, timelineRequired);

// A bundled image key, or an image uploaded for a project.
const projectImage = z.union([
  z.literal(""),
  str(LIMITS.id).regex(/^[a-z0-9-]+$/),
  z.string().refine((value) => isStoredBlobUrl("project", value), "Not an uploaded project image"),
]);

export const projectSchema = bilingual(
  {
    image: projectImage,
    imageWidth: z.number().int().min(0).max(10000),
    imageHeight: z.number().int().min(0).max(10000),
    technologies: list(str(LIMITS.short)),
    liveUrl: url,
    githubUrl: url,
    detailPath: z.union([z.literal(""), str(LIMITS.short).regex(/^\/[a-z0-9/-]*$/)]),
  },
  { title: str(LIMITS.short), description: str(LIMITS.text), imageAlt: str(LIMITS.title) },
  ["title", "description", "imageAlt"],
);

export const skillSchema = bilingual(
  { group: z.enum(SKILL_GROUPS), iconKey: str(40) },
  { label: str(LIMITS.short) },
  ["label"],
);

export const aboutSchema = bilingual(
  {},
  {
    summary: list(str(LIMITS.text)),
    highlights: list(z.object({ title: str(LIMITS.short), description: str(LIMITS.title) })),
    fullStory: str(LIMITS.story),
  },
  ["summary", "fullStory"],
);

export const projectDetailSchema = bilingual(
  { stack: list(str(LIMITS.short)) },
  {
    title: str(LIMITS.short),
    summary: str(LIMITS.text),
    sections: list(
      z.object({
        id: str(40).regex(/^[a-z0-9-]+$/),
        title: str(LIMITS.short),
        body: str(LIMITS.text),
        items: list(str(LIMITS.text)),
      }),
    ),
    faq: list(z.object({ question: str(LIMITS.title), answer: str(LIMITS.text) })),
    storyTitle: str(LIMITS.short),
    storyIntro: str(LIMITS.text),
    story: str(LIMITS.story),
  },
  ["title", "summary"],
);

const dimension = z.number().int().min(1).max(10000);
const altText = z.string().trim().min(1).max(LIMITS.title);

export const cvFileSchema = z.object({
  url: z.string().refine((value) => isStoredBlobUrl("cv", value), "Not an uploaded CV"),
  version: z.number().int().min(1),
});

export const profilePhotoSchema = z.object({
  url: z.string().refine((value) => isStoredBlobUrl("profile", value), "Not an uploaded photo"),
  width: dimension,
  height: dimension,
  alt: z.object({ en: altText, ptBR: altText }),
  version: z.number().int().min(1),
});

export const siteFilesSchema = z.object({
  cv: cvFileSchema.nullable(),
  profilePhoto: profilePhotoSchema.nullable(),
});

export const siteSettingsSchema = siteFilesSchema.extend({
  useRemote: z.boolean(),
  updatedAt: z.string().nullable(),
  version: z.number().int().min(0),
});

export const schemaByCollection = {
  experience: experienceSchema,
  education: educationSchema,
  projects: projectSchema,
  skills: skillSchema,
  about: aboutSchema,
  projectDetails: projectDetailSchema,
} as const;

export const coreSnapshotSchema = z.object({
  siteUpdatedAt: z.string().nullable(),
  source: z.enum(["seed", "firestore"]),
  files: siteFilesSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
  skills: z.array(skillSchema),
  about: z.array(aboutSchema),
});

export const detailsSnapshotSchema = z.object({
  projectDetails: z.array(projectDetailSchema),
});
