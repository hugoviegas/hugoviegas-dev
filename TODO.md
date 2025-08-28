# TODO — Evolution Path

Short, actionable ideas to improve the project. Pick one small task at a time and open a PR with a concise description.

## Checklist
- [ ] Create automated build & deploy (CI)
- [ ] Add unit tests (critical components)
- [ ] Add E2E test (smoke flow)
- [ ] Improve accessibility (a11y)
- [ ] Optimize images & assets
- [ ] Add analytics & SEO improvements
- [ ] Improve i18n workflow and tests
- [ ] Add Lighthouse checks in CI

## High priority (short-term)
- Add GitHub Actions workflow: install, build, lint, test, run Lighthouse/coverage report.
- Add basic unit tests for `HeroSection`, `Navbar`, and `ProjectsSection` using Vitest/React Testing Library.
- Ensure `tsconfig` strictness where reasonable and fix obvious type gaps.
- Add image optimization: replace large photos with webp and add responsive `srcset`.

## Medium priority
- Add E2E test (Playwright) for main navigation and contact form submission.
- Add Lighthouse score gating in CI and a badge in `README.md`.
- Implement a small content CMS flow (Markdown or JSON) for projects so content updates don't require code changes.
- Add caching headers and manifest for better PWA installability.

## Low priority / Stretch
- Add a small admin UI to manage project items (auth optional) or use Netlify/Vercel CMS.
- Add animations polish and reduce motion preference handling.
- Add localized SEO metadata per language and per route.

## Quick wins (<= 1 hour)
- Add an ESLint + Prettier pre-commit hook (husky) to enforce style.
- Add a CONTRIBUTING.md with a PR checklist and branch naming rules.
- Add a small smoke script in `package.json` (e.g., `npm run check`) to run lint + build.
- Add `TODO.md` (this file) to repo root and reference it in `README.md`.

## Tests & quality
- Write 3-5 unit tests (happy path + one edge case) per core component.
- Add a simple CI job to run tests and fail on coverage drop.

## Accessibility
- Run axe-core (or jest-axe) in tests for critical components.
- Ensure proper semantic HTML, labels for forms, and keyboard navigation for menus and toggles.

## Deployment & observability
- Add a CI/CD pipeline to deploy to Vercel (or Netlify) on `main` branch.
- Add basic error monitoring (Sentry or similar) and a lightweight analytics (Plausible or GA4) with opt-out.

## Notes and priorities
- Start with quick wins to improve DX (lint, husky, small unit tests).
- Add CI next so changes are validated automatically.
- After CI, focus on tests (unit → E2E) and performance (images, Lighthouse).

If you want, I can implement the first quick win (ESLint + husky pre-commit) or create the GitHub Actions CI skeleton next.
