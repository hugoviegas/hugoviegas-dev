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
- Organisation: ETAL Prestação de Serviços LTDA
- Location: Belo Horizonte, Brazil
- Period: 9 May 2020 to 1 June 2022
- Role: IT Systems Support Specialist
- Verified software work:
  - Developed a custom automation solution using JavaScript, Node.js, Express.js, PHP, and MySQL.
  - Reduced administrative processing time by 90%.
  - Built a full-stack application integrating on-premise systems with Google Workspace APIs for automated workflow management.
- Treat the 90% administrative processing reduction as the approved metric unless Hugo updates it.
- Never expose confidential ETAL documents, pricing, proposals, client data, credentials, or internal implementation details.

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
- Use one professional green accent colour. The final green tone and the system design will come later from Claude Design; do not redesign the palette before then.
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

## Chatbot
- Keep the existing chatbot only until its redesign is explicitly scheduled.
- Do not increase its visual prominence.
- Do not add attention-seeking ping, pulse, or autoplay behaviour.
- Do not expose an LLM provider key in the browser.
- A future chatbot implementation must call an authenticated or rate-limited server-side endpoint.
- The chatbot must only answer from verified portfolio content.
- The chatbot must be keyboard accessible, dismissible with Escape, and must not cover focused content.

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
  - Build: `npm run build`. For audits, build outside the repo: `npx vite build --outDir <tmp> --emptyOutDir`.
  - Tests: `npx vitest run --dir src` (limit to `src` so `.claude/worktrees` is not picked up).
  - Types: `npx tsc --noEmit -p tsconfig.app.json`.
  - Lint: `npx eslint src`.
- Baseline at audit time: Vitest 73 of 197 tests failing (9 empty test files, incomplete three.js mocks); `tsc` 122 errors (115 in tests); ESLint 18 errors. Do not treat pre-existing failures as caused by a new change, but do not add new ones.
- App code lives in `src/`. Root `app/layout.tsx` and `pages/_app.tsx` are Next.js leftovers; root `config/translations.ts` and `contexts/LanguageContext.tsx` are empty. The active translation system is `src/config/translations.ts` + `src/hooks/useLanguage.tsx`.
- Homepage composition: `src/pages/Index.tsx`. Routes: `src/App.tsx`. Global nav: `src/components/DynamicSidebar.tsx` + `src/components/TopControls.tsx`.
- Stack notes: Zod and `@hookform/resolvers` are installed but not yet used; the contact form (`src/components/ContactSection.tsx`) uses manual validation and Web3Forms. `@vercel/analytics` is installed but not mounted. Framer Motion (mentioned in README) is not installed.
- Theme tokens: `src/styles/design-tokens.css` and `src/styles/theme-tokens.css`; global styles in `src/index.css`.
- Known security item from the audit: a Gemini API key is read in the browser (`src/lib/chatbot-service.ts`). Follow the Security and Privacy rules before touching it.
- `/proposta-etal` and `/presente-x*` were removed from the app in September 2026. Their source is archived at the git tag `archive/private-routes-2026-09`; do not restore them to the deployed app.
- `dist/` is gitignored. `.env` is gitignored; `.env.sample` documents variables.

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
- Database-driven admin panel.
- CMS migration.
- New Fun Stuff route.
- Chatbot redesign or backend proxy.
- PT-BR indexable route strategy and hreflang.
- Framework migration.
- Full private-route authentication implementation.
