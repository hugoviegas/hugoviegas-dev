# Quickstart Guide: Portfolio Refresh & Cube Modal Validation

## Goal

Validate the simplified landing page, skills grid, experience tabs, hero cube modal, and `/bricks` viewer interaction before implementation.

## Prerequisites

- Node 22.x with npm 10.x (project already configured via Vite).
- Assets committed under `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\assets\` including new skill icons.
- Existing Three.js viewer components available in `src/components` and `src/features/proposta`.

## 1. Install & Run Dev Server

```bash
cd C:/Users/hugov/OneDrive/Documentos/GitHub/evolution-path
npm install
npm run dev
```

Visit `http://localhost:5173`.

## 2. Smoke Checklist (Desktop ≥1280px)

1. **Hero**

   - Confirm hero buttons show Email, See Résumé, and new Lego Cube button.
   - Click the cube button → modal opens, focus trapped on close button.
   - Press `Esc` → modal closes and focus returns to cube button.

2. **Lightsaber Background**

   - Observe floating saber + Lego pieces behind hero with no floor glow under profile photo.
   - Open cube modal; confirm background animation pauses. Close modal and wait ≥10s idle; saber resumes rotation.

3. **Section Order**

   - Scroll to verify order: Me → Experience → Projects → About → Contact.
   - Navbar highlight updates as each section enters viewport.

4. **Skills Grid**

   - Each category uses official/fallback icon assets arranged in 3-column grid.
   - No numeric proficiency badges remain; optional tags acceptable.

5. **Experience Tabs**

   - Section displays tabs: Work (default) / Education / Certificates.
   - Switching tabs updates content without layout shift >16px.

6. **Contact Section**
   - Displays concise copy, cards or list of channels with icons and secondary text.
   - Mailto link opens default client; external links open in new tab.

## 3. Mobile Verification (≤390px wide)

- Use devtools responsive mode.
- Ensure hero layout stacks vertically, cube modal covers viewport, skills grid collapses to 2 columns, navbar remains accessible (hamburger or condensed links).
- Check contact cards remain tappable with 44px min height.

## 4. `/bricks` Page

- Navigate directly to `/bricks` (manually or via nav).
- Confirm OBJ model auto-rotates, supports drag rotation + scroll zoom, and resumes auto-rotate 10s after user interaction.
- Simulate failure by renaming model path (during dev) → placeholder + friendly message appear.

## 5. Testing Hooks

Run lint + test suite to ensure baseline remains green.

```bash
npm run lint
npm test
```

Add Jest/RTL tests during implementation for:

- Cube modal focus trap + ESC close.
- Section order rendering snapshot.
- `shouldResumeRotation` helper (10s timeout expectation).

## 6. Content Authoring Tips

- Draft new copy in `src/features/proposta` or `config/translations.ts`. Keep sentences ≤18 words.
- Store new skill icons under `src/assets/skills/` using consistent kebab-case filenames.
- Update `config/languages.ts` if translation keys change.

## 7. Rollback Plan

- Keep existing sections in Git history; feature flag via boolean in `features/proposta` until QA complete.
- If modal causes regressions, fallback to simple link to `/bricks` without removing new assets.

## Ready for Implementation When

- Research decisions recorded (see `research.md`).
- Data model approved by stakeholders.
- Contracts reviewed and no blockers identified.
- Dev environment prepared with icons and assets.
