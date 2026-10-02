# Hugo Viegas Portfolio — Project Instructions

This file is the single persistent instruction source for work in this repository. It supersedes `.github/copilot-instructions.md`, `.specify/memory/constitution.md` (unfilled template), and any conflicting guidance in `README.md`, `TODO.md`, `FINAL_COMPACT_UPDATE.md`, or `specs/`.

## Product Goal
hugoviegas.dev is Hugo Viegas' personal portfolio.

Primary goal:
- Help Hugo secure a Software Developer role in Ireland.

Secondary goals:
- Present verified real-world work, projects, education, and technical skills.
- Make it easy for recruiters to understand Hugo's experience within 10 seconds.
- Support general visitors with a clear and accessible personal portfolio.
- Support English and Brazilian Portuguese content equally.

## Verified Professional Positioning
Use this exact primary title across the portfolio unless Hugo explicitly changes it:

`Software Developer`

Positioning guidance:
- Hugo has 5+ years of combined experience in full-stack development and IT infrastructure.
- "Early-career" may appear in supporting copy when useful, but must never replace the primary title.
- Do not position Hugo primarily as IT Support, System Administrator, or Junior Developer.
- IT infrastructure experience is supporting evidence, not the main portfolio identity.
- Hugo is seeking a job opportunity in Ireland.
- Do not mention visa, work permit, nationality, date of birth, home address, or phone number on the website unless Hugo explicitly requests it.

### Contact details
- The site contact email is `hugoviegas3.1@gmail.com`. Never show Hugo's primary email address anywhere on the site.
- A WhatsApp link that uses Hugo's secondary number is allowed. Never show Hugo's primary number.
- The downloadable CV PDF may contain Hugo's primary email and phone number (Hugo approved this in October 2026). Website pages, metadata, structured data, and the chatbot still never show them.

## Verified Facts
Use these as the current source of truth. Do not invent, exaggerate, or create alternative versions.

### Current Role
- Organisation: Erin College
- Location: Dublin, Ireland
- Start date: 22 September 2024
- Role: IT Support Specialist | System Administrator
- Portfolio framing: highlight the Software Developer work done within the role.
- Verified work:
  - Designed, developed, and maintains a full-stack internal ERP platform.
  - ERP modules include HR, payroll, finance, student management, and ticketing.
  - Core stack includes React, TypeScript, and Google Apps Script.
  - Supports operational workflows for 120+ users.
  - Builds automation tools and data pipelines.
  - Uses GitHub workflows, Vercel, Firebase, Google Workspace, Windows/Linux, and Active Directory where accurate.

### Freelance Web Development
- Period: 12 June 2023 to 31 March 2024
- Location: Dublin, Ireland
- Role: Self-employed Web Developer
- Verified work:
  - Designed, developed, and deployed a website for a real restaurant client.
  - Maintained the site for approximately 10 months after launch.
  - Maintenance included bug fixes, content updates, and minor feature improvements.

### ETAL
- Source of truth: the About full story (`fullStory` in `src/config/translations.ts`). It overrides the CV and the hosted PDF, which Hugo is correcting separately.
- Organisation: ETAL Prestação de Serviços LTDA
- Location: Belo Horizonte, Brazil
- Period: 9 May 2020 to 1 June 2022
- Role: IT Systems Support Specialist
- Verified software work:
  - Built an internal app with AppSheet on top of Google Sheets that simplified daily processes, after learning the HR and finance workflows end to end.
  - The timesheet close for 400+ employees fell from four days to about one. This is the approved metric.
- Do not claim a percentage reduction, a JavaScript, Node.js, Express.js, PHP, or MySQL stack, or an on-premise/Google Workspace API integration for ETAL. The story does not support them.
- Never expose confidential ETAL documents, pricing, proposals, client data, credentials, or internal implementation details.

### DabliuMusic
- Organisation: DabliuMusic (spelled with one "m").
- Location: Betim, Brazil
- Period: 2020 to 2021
- Role: Digital Designer | Web Developer

### Education
- Higher Diploma in Science in Computing, CCT College, Dublin, Ireland.
  - Dates: 16 September 2024 to 30 September 2025.
  - Final grade: First Class.
  - EQF level: 8.
- Technologist Degree in Analysis and Systems Development, UNICNEC, Itaúna, Brazil.
  - Dates: 4 March 2018 to 1 July 2021.
  - EQF level: 7.
- Professional English Language Programme, ICOT, Dublin, Ireland.
  - Dates: 2 August 2022 to 30 April 2024.
  - English level: C1.
- Portuguese is Hugo's native language.

## Public Projects
Only publish projects with verified content, real screenshots (or representative screenshots clearly labelled when needed), and verified URLs.

Approved portfolio project line-up:
1. D'Arcy McGee's.
2. Big Bang Duel.
3. Erinhub.
4. ETAL QR Registration / automation system.

Project rules:
- Never publish `#` as a project link.
- Never publish fabricated, placeholder, AI-generated, or gibberish project imagery as real work.
- Never claim a repository is public unless its URL returns successfully and Hugo approves it.
- Label demos, prototypes, fictional data, client work, and live implementations accurately.
- D'Arcy McGee's is a real client project. If the public portfolio uses a demo environment, explain this accurately without disclosing client-sensitive information.
- Every public project should eventually include: title, role, context, period, concise outcome, verified stack, image alt text, and verified labelled links.
- Do not expose confidential project details or private client data.

## Languages and i18n
- Supported languages: English and Brazilian Portuguese.
- Portuguese variant: `pt-BR`.
- English is the default language.
- All user-facing strings must have complete EN and PT-BR entries.
- Do not ship hard-coded English strings in PT-BR mode.
- Keep essential content equivalent between EN and PT-BR.
- Update `document.documentElement.lang` when the active language changes.
- Do not add indexable localized routes or an hreflang strategy without Hugo's explicit approval.

## Design Direction
The portfolio should be:
- Minimalist.
- Professional.
- Calm.
- Fast.
- Accessible.
- Recruiter-friendly.
- Clear before clever.

Visual system:
- Use neutral surfaces and text.
- Use one professional green accent colour per theme: `#067a38` (light) and `#3ccf7a` (dark), from the Claude Design redesign (October 2026). Tokens live in `src/styles/theme-tokens.css`; the full spec, contrast ratios and phase plan are in `docs/redesign/README.md`.
- Gold appears only on the small coin markers. Brick colours are decoration only, never text or status.
- Elevation uses hard offset shadows with zero blur (`shadow-e1`/`e2`/`e3`), never soft glows.
- Do not use gradients.
- Use consistent spacing and a limited typography hierarchy.
- Ensure text meets WCAG AA contrast requirements.
- Use Tailwind classes only. Do not add inline styles unless a technical integration requires it and Hugo approves.

LEGO identity:
- LEGO is an optional brand accent, not the primary navigation model.
- Keep gold-coin markers as a subtle top-bar detail where appropriate.
- Keep the background spaceship as an optional visual feature, disabled by default.
- The spaceship must be activated explicitly by the visitor from a control near the theme and language controls.
- The spaceship must respect reduced-motion preferences.
- Do not use 3D/WebGL backgrounds, camera navigation, explosions, falling bricks, typewriter effects, or scroll-jacking in the hiring journey.
- Do not add new Star Wars-themed UI to the primary portfolio flow.
- Any playful content must not obscure, delay, or compete with recruiter information.

Fun Stuff:
- Keep optional "Fun Stuff" content in the existing portfolio page only.
- It must be hidden/collapsed by default.
- It must be revealed only after an explicit user action.
- Do not create a new route for Fun Stuff unless Hugo explicitly approves it.
- Formula D must not appear in the main portfolio navigation, homepage footer, or primary recruiter journey.
- Archive or hide Formula D from the primary product surface rather than deleting it, unless Hugo explicitly requests deletion.

## Information Architecture
Target single-page order:
1. Hero.
2. Projects.
3. Experience.
4. Skills.
5. About.
6. Contact.
7. Footer.

Navigation target:
- Hugo Viegas / Home.
- Projects.
- Experience.
- About.
- Contact.
- CV.
- Language toggle.
- Theme toggle.
- Optional background spaceship toggle.

Hero requirements:
- Name.
- Primary title: Software Developer.
- One concise value proposition.
- Dublin, Ireland.
- Primary CTA: View Projects.
- Secondary CTA: Download CV.
- Clear text links for LinkedIn, GitHub, and email where verified.
- No typewriter animation.
- No long paragraph.
- No chatbot as the primary call to action.

## Content Rules
- Recruiters must be able to identify Hugo's role, location, skills, and project CTA within 10 seconds.
- Projects must appear before long experience and personal-story content.
- Keep role descriptions concise: 2–3 high-impact bullets per position in the portfolio UI.
- About content should be short by default. Deeper story content must be optional.
- Skills must be evidence-based and aligned with actual projects and current experience.
- Do not list technologies without evidence or Hugo's confirmation.
- Do not use fake metrics or inconsistent dates.
- Keep all verified facts consistent across hero, experience, projects, chatbot, CV links, metadata, structured data, and translations.

## Security and Privacy
- Never expose secrets in client-side code, environment variables, repository files, browser bundles, screenshots, logs, or prompts.
- `VITE_*` variables are public browser variables. Never place secret keys, passwords, API credentials, or private configuration in them. The same applies to any value injected through `define` in `vite.config.ts`.
- Do not add API keys to source code.
- Do not use client-side password checks for private content.
- Keep `/proposta-etal` and `/presente-x*` out of the public portfolio flow.
- Do not expose proposals, pricing, passwords, client information, private records, or confidential ETAL information.
- Before making any change involving authentication, private routes, environment variables, server-side APIs, Firebase, or Vercel configuration, explain the security impact and ask Hugo for approval.

## Content Backend and Hidden Admin (Firebase)
Approved by Hugo and delivered in October 2026 in five PRs: foundation, content layer, admin editors, file uploads, and the cutover cleanup. Firestore is now the only source for the content listed under "Content split".

Project:
- Firebase project ID: `assistente-virtual-e4322` (public identifier). Do not share it with Big Bang Duel.
- Firestore region: `europe-west2` (London). The region is permanent once the database exists.
- Services used: Firebase Authentication (Google provider only) and Cloud Firestore on the Spark plan. No Firebase Storage, App Check, Cloud Functions, or Hosting.
- Files (CV, profile photo, project images) go to the public Vercel Blob store `sb7cb98htp9acpqo` through one Vercel serverless route. See "File uploads" below.

Security model:
- Google sign-in only, with `signInWithPopup`. Every other provider stays disabled, and there are no passwords. After Hugo's first sign-in, "Enable create (sign-up)" is turned off in Authentication settings.
- `firestore.rules` is the access control. The owner check is `request.auth.uid == '<HUGO_UID>'`, `email_verified == true`, and `sign_in_provider == 'google.com'`.
- Public reads are allowed only for docs with `published == true`. `settings/site` is public. `admin/ping` and `contentHistory` are owner-only. Everything else is implicitly denied.
- Writes are owner-only and validated per collection: exact keys, length limits, `updatedAt == request.time`, and sequential `version`.
- The admin page checks access by reading `admin/ping`. On `permission-denied` it signs the user out immediately. The client never decides who is allowed.
- The admin route is an unguessable slug in `src/config/admin.ts`, repeated in `vercel.json` for the slug and every view under it (`<slug>/(.*)`: rewrite plus `X-Robots-Tag`; a test keeps them in sync). Each admin view has its own address (`src/pages/admin/adminRoutes.ts`). It is unlinked, `noindex` (route SEO config plus `X-Robots-Tag`), and absent from the sitemap and `robots.txt`. This is obscurity only; the rules are the protection.
- The admin page and the Firebase SDK load only in the lazy admin chunk (`src/pages/admin/`). Public pages must never import the Firebase SDK. Public content is read through the Firestore REST API.
- Hugo runs the Firebase CLI, console steps, rule deploys, and sign-in himself.

Config and secrets:
- Only the public Firebase web config (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`) may live in `.env.sample`, `.env.local`, Vercel env vars, or the repo. Restrict that API key to Firebase APIs only.
- Never commit, or place in `VITE_*` or `define`: service-account JSON, Admin SDK keys, Firebase CLI tokens, Vercel tokens, `BLOB_READ_WRITE_TOKEN`, `GEMINI_API_KEY`, or deploy-hook URLs.
- `BLOB_READ_WRITE_TOKEN` is a server-only Vercel environment variable (Production and Preview), read only by `api/blob-upload.ts`. Hugo manages it in Vercel.

Content split:
- Moves to Firestore: experience, education, projects, project detail pages (stack, lists, FAQ, story), skills and certifications, and About (summary, highlights, full story). Collections: `experience`, `education`, `projects`, `projectDetails`, `skills`, `about`, `settings/site`, `contentHistory`.
- Every content doc has `en` and `ptBR` blocks, `published`, `order`, `updatedAt`, and `version`. Publishing is blocked when either language is empty.
- In `settings/site`: the CV link (`cv`), the hero's two avatar faces (`profilePhoto` and `avatarMinifig`: URL, width, height, EN and PT-BR alt text, version) and which face is shown first (`avatarFirst`, `photo` or `minifig`; only `minifig` is stored, absent means `photo`). When absent, the site uses the CV URL in `src/content/siteFiles.ts` (`FALLBACK_CV_URL`), the bundled `src/assets/hugo-hero.webp` and `src/assets/brand/hugo-minifig.webp`. The hero preload follows the first face.
- Stays in code: hero copy, contact and social links, SEO titles and descriptions (`seo.*`, read at build time), UI chrome strings (section headings, buttons, chatbot prompts), `currentFocusText`, the languages card, chatbot context, Fun Stuff, and archived pages.
- A project's `image` is either a key that maps to a bundled asset (`src/content/images.ts`) or the URL of an image uploaded to Blob. Skills store an `iconKey` mapped in `SkillsSection.tsx`.
- `public/og-image.jpg` stays in the repository: social scrapers need a fixed URL. JSON-LD and Open Graph keep using it.

Content layer (`src/content/`):
- `types.ts` is the model, and `schema.ts` holds the Zod schemas with `LIMITS`. Keep `LIMITS` and the limits in `firestore.rules` in sync.
- The schemas are used by the admin, the snapshot script, the lazy refresh, and tests. Never import Zod or the Firebase SDK into the homepage entry.
- `snapshot/core.json` holds the homepage collections and ships in the entry. `snapshot/details.json` holds `projectDetails` and ships in the project-page chunk.
- Both snapshot files are committed and contain published docs only. `npm run content:snapshot` regenerates them from Firestore through public REST reads. The `prebuild` script runs it on every build.
- If Firestore is unreachable or invalid, or `useRemote` is off, the script keeps the committed files.
- Runtime: the snapshot renders first. After idle, `remoteCheck.ts` reads `settings/site` once (no Zod).
- Only when `useRemote` is on and `settings/site.updatedAt` is newer than the snapshot does `refresh.ts` (with Zod) load the published docs and swap them in. Invalid docs are dropped.
- A core collection that comes back empty keeps its snapshot docs.
- Every admin write must also bump `settings/site.updatedAt`, or the public refresh will not notice it.
- Recovery: published content is in the committed snapshot, and every earlier version (drafts included) is in `contentHistory`, restorable from the admin. There is no hard-coded seed or import tool any more.
- Admin editors (`src/pages/admin/`):
  - The admin is a separate shell (`AdminShell.tsx`): its own header, a left rail from 1024 px and a section sheet below; the public navigation, controls and background layers are not rendered on the admin route (`App.tsx`). Sign-in screens are in `AdminGate.tsx`.
  - `AdminNavigation.tsx` drives the view from the address and holds any move away from unsaved changes (links, Back, Cancel, browser back) behind a Keep editing / Save and leave / Discard dialog; reload and closing the tab use `beforeunload`.
  - `AdminDashboard.tsx` picks the view for the address: the overview (counts, settings and files status), each collection, files, and settings.
  - `FilesPanel.tsx`: the CV (replace, reset to the bundled file), the two avatar slots (Photo and Minifigure: replace or re-crop square, EN and PT-BR alt text, reset), which face is shown first with a flip preview, and the upload limits. `SettingsPanel.tsx`: the remote-content switch (turning it off asks first) and the settings history, where any earlier version can be restored (`restoreSettings`). Project images upload from the project editor (`ProjectImageField.tsx`). `collectionConfig.ts` declares each collection's fields.
  - `DocEditor.tsx` is the EN and PT-BR form (side by side from 1024 px, language tabs below) built with React Hook Form and validated by the same Zod schema, so publishing with an empty language is blocked. Required fields carry a REQUIRED tag and a live Missing tag per language; trying to publish shows a summary that links to each missing field. A sticky bar holds Save and Cancel. Repeatable groups can be reordered; `story` has a Markdown preview (React elements only, no HTML injection); the skill icon is a visual picker. Project image width and height are set from the image, its alt text sits beside it, and earlier uploads are offered from the project's history.
  - `HistoryPanel.tsx` shows the current version and each earlier one with what it changed; a version that no longer passes validation as published can be restored as a draft.
  - `CollectionPanel.tsx` handles create, edit, publish, reorder (per skill group), delete, history, and restore; `CollectionList.tsx` is the list: search and status filter, dense rows from 1280 px and cards below, drag-and-drop reorder with Move up / Move down as the keyboard path, 44 px actions, and "Recently deleted" with title and preview (restored docs come back as drafts). Publishing checks `publishProblems` (the Zod schema with Published on) and names each missing field and language. Quick results are toasts (`AdminToasts.tsx`); decisions are in-page notices or `ConfirmDialog` (red for destructive actions).
  - Every write goes through `adminContent.ts`, which copies the previous version to `contentHistory` and bumps `settings/site`. Deleted docs stay restorable from history.
  - Skill icon keys live in `src/content/skillIcons.ts`; `SkillsSection.tsx` must map every key.
- Tests use `src/test/contentFixtures.ts`, a frozen test-only copy of the first imported docs (`src/test/fixtures/content-docs.json`), not the committed snapshot, which changes whenever content is edited.
File uploads (Vercel Blob):
- Flow: the admin asks `POST /api/blob-upload` for a client token, sending the Firebase ID token as `Authorization: Bearer`. The browser then uploads straight to Blob, and the admin saves the URL to Firestore through the normal owner-only writes (with history).
- `api/blob-upload.ts` verifies the ID token before reading the body: RS256 signature against Google's public keys (`jose`), `aud` and `iss` for the project, expiry, `sub` equal to Hugo's UID, `email_verified`, and the `google.com` provider (`src/server/ownerToken.ts`, mirroring `isOwner()`). Anything else gets 401. There is no service account and no Admin SDK, so a revoked session's token stays valid until it expires (at most one hour).
- `src/content/uploadPolicy.ts` is the single source for the store host, allowed pathnames, types, and size limits: `cv/*.pdf` up to 5 MB; `profile/*` and `projects/<id>/*` as WebP, AVIF, JPEG, or PNG up to 2 MB and 3 MB. No SVG or HTML. Tokens last five minutes, add a random suffix, and never overwrite. `firestore.rules` repeats the stored-URL patterns: change both together.
- Upload-completed callbacks are not used. Relative imports in `api/` need the `.js` extension because Vercel runs the route as Node ESM.
- Blob URLs are public. Replacing a file does not delete the old one; Hugo removes old files in the Vercel dashboard.
- Runtime: the CV link, photo, and project images update through the runtime refresh. The hero photo `<link rel="preload">` in the static home head comes from the snapshot and updates on the next deploy. Never add a deploy-hook URL to client code.
- The admin loads `@vercel/blob/client` only when an upload starts.
- Images: before upload the admin opens a canvas crop editor (`CropDialog.tsx`, square for the profile photo; 16:9, 4:3, 1:1 or original for projects). `imageFit.ts` then re-encodes any decodable image that is cropped, too large, or in another format as WebP, keeping the highest quality that fits (quality 0.92 down to 0.8, then the smallest needed downscale). Files up to 40 MB are accepted as input. No image library is used.

- Cutover (October 2026): `legacy.ts`, `seed.ts`, the content translation keys, the Big Bang Duel story Markdown files, the import tool, and the dual-run test were removed. Do not reintroduce content in code or translations; edit it in the admin. Kept translation keys that are UI chrome or SEO: `darcyTitle`, `bigBangTitle`, `bigBangStoryTitle`, `bigBangStoryError`, `bigBangTechTitle`, `bigBangFaqTitle`, `bigBangFaqIntro`, `fullStoryTitle`.

## Chatbot
Redesign approved by Hugo in October 2026 (UI from the Claude Design "Portfolio assistant" boards, plus a server-side proxy).
- The assistant is labelled as an AI ("Portfolio assistant", AI badge, "Not Hugo"). It never speaks as Hugo.
- The browser only calls `POST /api/chat` (`api/chat.ts`). No LLM key, prompt, or model details ship to the client.
- `GEMINI_API_KEY` is a server-only Vercel environment variable (Production and Preview), read only by `api/chat.ts` and by the Vite dev middleware (`.env.local`). Never prefix it with `VITE_`. `CHAT_MODELS` optionally overrides the model list.
- The system instruction is built in `src/server/chat/knowledge.ts` from the published content snapshot, the approved project contexts (`src/lib/project-contexts/*.json`), and the contact details above. Update those, not the prompt, to change what it knows.
- `api/chat.ts` checks the Origin (production host, the current Vercel deployment, localhost outside production), validates the body (`src/server/chat/request.ts`), and rate-limits per IP in memory (`src/server/chat/rateLimit.ts`: 6/minute, 40/day per visitor, 300/hour per instance). The limiter is per warm instance, so it slows abuse but is not global; a shared store would need a separate approval.
- UI: `src/components/assistant/AssistantPanel.tsx` is the shared panel (floating, sheet, embedded). `src/components/ChatBot.tsx` is the lazy home launcher: a non-modal floating panel from 1024px, a modal sheet with scroll lock and focus trap below it. Project pages use `ProjectAssistant` in `src/components/project/ProjectParts.tsx`, which mounts the panel only after the visitor starts a conversation. Strings live under `assistant.*` in translations.
- Do not add attention-seeking ping, pulse, or autoplay behaviour, and do not increase its visual prominence.
- The chatbot must only answer from verified portfolio content, be keyboard accessible, be dismissible with Escape, and not cover focused content.

## SEO Requirements
Before SEO implementation, inspect the current source and deployment configuration.

Required future SEO outcomes:
- Accurate, unique title, meta description, canonical URL, Open Graph tags, and social image for each public route.
- Correct `lang` attribute.
- Real `404` response for unknown routes.
- Valid sitemap and robots configuration.
- One canonical production host.
- Noindex for demos, private surfaces, archived features, and non-portfolio routes where appropriate.
- Accurate Person/ProfilePage structured data using only verified facts.
- Never use placeholder emails, unverified social handles, dead URLs, or third-party product ads in metadata or social previews.
- Do not add schema fields without verified values.

## Accessibility Requirements
- Target WCAG 2.2 AA.
- Use semantic headings and landmarks.
- Include a skip link and one `<main>` landmark.
- Use real links for navigation and external destinations.
- All buttons and icon-only controls need accessible names.
- All interactive elements need visible keyboard focus in light and dark themes.
- Support keyboard navigation, Escape closing behaviour, logical focus return, and adequate touch targets.
- Use visible form labels, accessible validation, and persistent success/error feedback.
- Respect `prefers-reduced-motion`.
- Do not duplicate section IDs.
- Verify light and dark theme contrast before considering a UI task complete.

## Performance Requirements
- Do not load WebGL, three.js, large 3D assets, chatbot code, lab content, or private features on the primary homepage critical path unless Hugo explicitly approves.
- Use lazy route loading where appropriate.
- Use modern image formats and right-sized responsive images.
- Include width and height for content images to prevent layout shift.
- Prioritize the hero image correctly.
- Keep below-the-fold content lazy-loaded.
- Do not add animation libraries or large dependencies without Hugo's approval.
- Measure build output before and after performance work.
- Preserve a usable experience on mobile networks and mid-range mobile devices.

## Codebase Rules
- Stack source of truth: `package.json` first, then `README.md` (README is partly outdated; see Repository Notes).
- React 18, TypeScript 5, Vite 5, React Router DOM 6.
- Tailwind CSS 3, shadcn/ui, Radix UI primitives.
- State: React Context API, hooks, TanStack Query v5.
- Forms: React Hook Form and Zod.
- Icons: Lucide React.
- Testing: Vitest.
- Hosting: Vercel.
- Single application only. No monorepo.
- Existing relevant directories include `src/`, `app/`, `pages/`, `contexts/`, `config/`, and `specs/`.
- Inspect existing patterns before changing architecture.
- Do not make architecture decisions without Hugo's approval.
- Do not introduce a new framework or migrate to Next.js, Astro, or another stack without explicit approval.
- Prefer small, focused changes.
- Preserve existing working functionality unless a task explicitly replaces it.
- Do not remove code, pages, routes, files, or dependencies without identifying usages and getting Hugo's approval when the change is destructive.
- Use English comments only, and keep them concise.
- Use strict TypeScript where practical; do not silence errors with `any`, `@ts-ignore`, or broad type escapes without documented justification.
- Run relevant tests, type checking, linting, and production build checks after implementation tasks.
- Report failures honestly; do not claim success when checks fail.

## Repository Notes
Observed during the September 2026 audit. Re-verify before relying on them.

- Commands:
  - Dev: `npm run dev` (Vite on port 5173; `.claude/launch.json` currently says 8080).
  - Build: `npm run build` (its `prebuild` refreshes the content snapshot from Firestore). For audits, build outside the repo: `npx vite build --outDir <tmp> --emptyOutDir`, which skips the snapshot refresh.
  - Content snapshot: `npm run content:snapshot` (from Firestore).
  - Tests: `npx vitest run --dir src` (limit to `src` so `.claude/worktrees` is not picked up).
  - Types: `npx tsc --noEmit -p tsconfig.app.json`.
  - Lint: `npx eslint src`.
- Baseline at audit time: Vitest 73 of 197 tests failing (9 empty test files, incomplete three.js mocks); `tsc` 122 errors (115 in tests); ESLint 18 errors. Do not treat pre-existing failures as caused by a new change, but do not add new ones.
- App code lives in `src/`. Root `app/layout.tsx` and `pages/_app.tsx` are Next.js leftovers; root `config/translations.ts` and `contexts/LanguageContext.tsx` are empty. The active translation system is `src/config/translations.ts` + `src/hooks/useLanguage.tsx`.
- Homepage composition: `src/pages/Index.tsx`. Routes: `src/App.tsx`. Global nav: `src/components/DynamicSidebar.tsx` + `src/components/TopControls.tsx`.
- Stack notes: Zod and `@hookform/resolvers` are installed but not yet used; the contact form (`src/components/ContactSection.tsx`) uses manual validation and Web3Forms. `@vercel/analytics` is installed but not mounted. Framer Motion (mentioned in README) is not installed.
- Theme tokens: `src/styles/design-tokens.css` and `src/styles/theme-tokens.css`; global styles in `src/index.css`.
- The Gemini key moved server-side in October 2026 (`api/chat.ts`). The old `VITE_GEMINI_API_KEY` was public in earlier bundles: it must be deleted from Vercel and the key rotated.
- `/proposta-etal` and `/presente-x*` were removed from the app in September 2026. Their source is archived at the git tag `archive/private-routes-2026-09`; do not restore them to the deployed app.
- `dist/` is gitignored. `.env` and `*.local` are gitignored; `.env.sample` documents variables.
- Firebase files: `firestore.rules`, `firestore.indexes.json`, `firebase.json`, and `.firebaserc` at the repo root. Admin code: `src/pages/admin/`. Admin route constant: `src/config/admin.ts`.

## Working Method
For every task:
1. Inspect relevant files before proposing changes.
2. Summarize the existing implementation and risks.
3. State the smallest viable plan.
4. Ask one clarifying question only if a required product, security, content, or architecture decision is unresolved.
5. Implement only the approved scope.
6. Validate with relevant commands.
7. Report files changed, validation results, risks, and any deferred work.

Do not:
- Rewrite the entire website in one task.
- Combine unrelated security, SEO, visual redesign, content, and infrastructure changes into one pull request.
- Replace the established architecture without approval.
- Invent facts, metrics, credentials, client names, outcomes, or project features.
- Expose secrets or internal data.
- Prioritize visual novelty over recruiter clarity, accessibility, content truthfulness, SEO, or performance.

## Delivery Phases
Follow this order unless Hugo explicitly reprioritizes:

1. Security and public-content corrections.
2. Positioning, project trust, and recruiter clarity.
3. Navigation, accessibility quick wins, and homepage decluttering.
4. SEO foundations and metadata correctness.
5. Performance, image optimization, route splitting, and caching.
6. Content/case-study improvements and PT-BR parity.
7. Visual redesign and optional interactive polish.

## Current Explicitly Deferred Work
Do not start these without a separate approved task:
- Full portfolio redesign.
- 3D LEGO room/camera experience.
- New Fun Stuff route.
- PT-BR indexable route strategy and hreflang.
- Framework migration.
- Full private-route authentication implementation.
