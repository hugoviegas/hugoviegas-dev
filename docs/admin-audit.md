# Admin Area Discovery Audit

Read-only audit of the hidden admin and the ChatBot, written so it can be briefed to a design tool.
Facts and open questions only: no designs, fixes, or schema changes are proposed.

- Audited commit: `dd622b9` (`main`), 2026-10-02.
- Citation format: `path:line` (or `path:start-end`), relative to the repo root.
- "Not found" marks something searched for and absent. "Not verified" marks something that could not be confirmed by reading code (the app was not run; sign-in needs Hugo's Google account).
- No secrets, tokens, or environment values appear here. Variables are referenced by name only.

## Contents

1. [Admin shell and flow](#1-admin-shell-and-flow)
2. [Panels and editors](#2-panels-and-editors)
3. [Data layer](#3-data-layer)
4. [Uploads and images](#4-uploads-and-images)
5. [Profile photo, end to end](#5-profile-photo-end-to-end)
6. [Skills and icons](#6-skills-and-icons)
7. [Admin visual layer](#7-admin-visual-layer)
8. [ChatBot](#8-chatbot)
9. [Dead code, usability gaps, open questions](#9-dead-code-usability-gaps-open-questions)

---

## 1. Admin shell and flow

### 1.1 How the hidden route is mounted

| Fact | Source |
| --- | --- |
| Route path is the constant `ADMIN_PATH` (`/admin-` plus 16 hex characters). | `src/config/admin.ts:4` |
| The page is lazy-loaded, so the Firebase SDK stays out of public chunks. | `src/App.tsx:30-31` |
| Route registered above the `*` catch-all. | `src/App.tsx:75` |
| Routes render inside `<Suspense fallback={null}>`: a blank area shows while the admin chunk loads. | `src/App.tsx:64` |
| Vercel rewrites the path to `/index.html` and sets `X-Robots-Tag: noindex, nofollow`. | `vercel.json:34-37`, `vercel.json:48` |
| Route SEO config marks it `noindex`; title key `seo.admin.title` ("Admin \| Hugo Viegas"). | `src/config/seo.ts:71-75`, `src/config/translations.ts:724-730` |
| A test keeps `ADMIN_PATH`, `vercel.json`, SEO config, and the sitemap/robots files in sync. | `src/config/__tests__/adminRoute.test.ts:14-41` |
| Nothing in the public components links to the admin path (grep for `ADMIN_PATH` outside admin/config/test finds only `App.tsx` and `seo.ts`). | `src/App.tsx:16`, `src/config/seo.ts:2` |

The admin renders inside the global app shell. `StarField`, `SpaceshipLayer`, `DynamicSidebar`, and `TopControls` are mounted above `<Routes>` for every route (`src/App.tsx:60-63`). `DynamicSidebar` has no admin check (it only tests `pathname === "/"` and `startsWith("/projects")`, `src/components/DynamicSidebar.tsx:51-55`). So the public navigation pill, language/theme/spaceship controls, and background layers are present on the admin route. `RouteSeo` also runs (`src/App.tsx:58`).

### 1.2 Shell: `AdminPage.tsx`

`src/pages/admin/AdminPage.tsx` is a single `<main id="main-content" tabIndex={-1}>` (`:85-89`) containing a centred column (`max-w-6xl space-y-6 text-center`, `:90`), a header (`t("title")`, `t("intro")`, `:91-94`), a live status region (`:96-100`), and the dashboard once access is granted (`:139`).

Status machine (`:15-22`, initial value `:28-30`):

| Status | Entered when | What renders |
| --- | --- | --- |
| `unconfigured` | `isFirebaseConfigured` is false at load (`firebase.ts:16`). `watchAuth` is never called (`:55`). | `role="alert"` text `unconfigured` (`:102`). No sign-in button. |
| `loading` | Firebase is configured; waiting for the first auth callback. | Live text `loading` (`:97`). |
| `signedOut` | Auth callback gives no user and the denied flag is false (`:61-65`). | Sign-in button (`:82`, `:122-126`). |
| `checking` | A user exists; `verify()` is running the access probe (`:38-41`). | Live text `checking` (`:98`). |
| `granted` | Probe returned `granted` (`:50-51`). | Live text `granted`, "Signed in as {email}" plus Sign out button (`:128-137`), then `AdminDashboard` (`:139`). |
| `denied` | Probe returned `denied`: the page sets `denied.current`, clears the user, calls `signOutAdmin()` (`:43-48`). | `role="alert"` `denied` (`:103`) and the sign-in button again (`:82`). |
| `error` | Probe failed with anything other than `permission-denied` (`adminAuth.ts:34-44`). | Alert `error`, "Try again" (only if a user is held) and Sign out (`:106-120`). |

Other states:

- `signInFailed` (`:32`, `:104`) shows an alert for sign-in failures. A closed or superseded popup is ignored (`adminAuth.ts:47-50`, `AdminPage.tsx:73`).
- A stale-check guard (`checkId`, `:34`, `:42`, `:62`) drops results of superseded probes.
- The sign-in button has no busy or disabled state while the popup is open (`:68-75`, `:122-126`).
- The shell shows the signed-in email (`:131`). There is no avatar, profile menu, or link back to the public site (not found).

### 1.3 Auth and access check: `adminAuth.ts`, `firebase.ts`

- Providers: `GoogleAuthProvider` with `prompt: "select_account"`, `signInWithPopup` (comment: redirect breaks with blocked third-party storage) (`adminAuth.ts:21-27`).
- Access probe: `getDoc(doc(db, "admin", "ping"))` using Firestore **Lite** (always hits the server). Only `permission-denied` maps to `denied`; any other error maps to `error` (`adminAuth.ts:31-44`).
- The rule behind the probe: `match /admin/ping { allow read: if isOwner(); }` (`firestore.rules:223-225`). `isOwner()` checks UID, `email_verified`, and `sign_in_provider == 'google.com'` (`firestore.rules:16-21`).
- Firebase init is lazy and reads `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` (`firebase.ts:9-26`). `isFirebaseConfigured` is true only when all four are truthy (`firebase.ts:16`).
- Imports: `firebase/auth` and `firebase/firestore/lite` only (`firebase.ts:3-5`, `adminAuth.ts:2-9`).
- Session expiry or token refresh handling: not found in the admin code.

### 1.4 Dashboard and navigation: `AdminDashboard.tsx`

- Radix `Tabs` with `defaultValue="overview"` (`AdminDashboard.tsx:76`). The active tab is local state: it is not in the URL or in storage (not found).
- Tab list (`:77-86`, `flex h-auto w-full flex-wrap justify-start gap-1`): Overview, then one tab per entry of `ADMIN_COLLECTIONS` (experience, education, projects, projectDetails, skills, about; `collectionConfig.ts:173-180`), then Files, then Settings. Nine tabs total.
- Each tab body: Overview (`:87-89`), `CollectionPanel` per collection (`:90-94`), `FilesPanel` (`:95-97`), `SettingsPanel` (`:98-100`). No `forceMount` is set, so Radix's default applies and an inactive tab's content unmounts; each panel's own `useEffect` reloads from Firestore on every visit (`CollectionPanel.tsx:64-66`, `FilesPanel.tsx:96-98`, `SettingsPanel.tsx:28-30`). The unmount behaviour comes from the library default and was not observed in the browser.
- Overview (`:13-70`): calls `loadExistingContent()` (all six collections plus settings, `adminContent.ts:73-84`), then shows a table of published and draft counts per collection (`:20-30`, `:44-67`). States: loading text `role="status"` (`:43`), error `role="alert"` (`:38-42`), table. It ignores the `settings` part of the result (`:20`).
- Nothing else exists in the shell: no search, no dashboard activity feed, no site preview, no deploy status (not found).

---

## 2. Panels and editors

Shared notice pattern: a `<p role="status|alert">` inside or beside an `aria-live="polite"` wrapper. Error text is red (`text-destructive`); status text is plain or muted.

### 2.1 `CollectionPanel.tsx` (`src/pages/admin/CollectionPanel.tsx`, 336 lines)

**Purpose:** list, create, edit, publish, reorder, delete, and restore for one collection.

**Inputs:** prop `collection` (`:39`). Loads `loadCollection(collection)`, `loadSettings()`, and `listDeletedIds(...)` (`:50-62`).

**Internal modes** (`:26-29`): `list`, `edit` (`doc`, `isNew`), `history` (`id`). The mode is local state (not in the URL).

**States:**

| State | Behaviour | Source |
| --- | --- | --- |
| Loading | `<p role="status">` "Loading…". | `:152` |
| Load error | Alert plus Reload button. | `:140-151` |
| Empty | Plain text `emptyList` ("No docs yet."). | `:211` |
| Busy | `busy` disables every row button and "New" during a write. | `:47`, `:69-89`, `:202`, `:240`, `:260` |
| Success | Status line `saved`, `deleted`, or `restored`. The notice stays until the next action clears it. | `:69-76`, `:154-161` |
| Error | `permission-denied` shows `staleError` ("This doc changed since it was loaded"); any other error shows `saveError` plus the message. | `:77-85` |
| Publish blocked | `publishBlocked` notice when the Zod schema rejects the toggled doc. The message is generic: it does not name the missing field. | `:101-108` |

**Row layout** (`:218-299`): title (`rowTitle`, language follows the site language via `useContentLang`, `:41`, `:219`), `Badge` for published/draft, `<code>` id, order number, then buttons: Edit, Publish/Unpublish, ↑, ↓, History, Delete. Rows are `flex-col` below `md` and `md:flex-row` from 768 px (`:221`). Row buttons use `size="sm"` (`h-9`, `src/components/ui/button.tsx:32`); the project's own touch size is `h-11` (`button.tsx:34`).

**Skills grouping:** `def.scope` splits the list into groups (programming, it, certification, focus) with an `<h4>` per group; reorder works within a group (`:132-138`, `:212-216`).

**Actions:**
- New: `newDoc(collection, data.docs)` (`:200-206`; defaults in `editorModel.ts:17-25`).
- Edit: opens `DocEditor` (`:163-178`).
- Publish toggle: flips `published`, validates with `schemaByCollection[collection].safeParse`, then `saveContentDoc` (`:101-108`).
- Move up/down: `reorderChanges` computes the changed docs and `saveContentDocs` writes them in one batch (`:110-115`). First/last rows disable the matching arrow (`:260`, `:270`). Drag-and-drop reorder: not found.
- Delete: `ConfirmDialog` (`:325-331`) then `deleteContentDoc` (`:117-122`).
- History: switches to `HistoryPanel` (`:180-192`).
- Deleted docs: ids that have history but no live doc show as outline buttons labelled by id only, each opens history (`:304-323`).

### 2.2 `DocEditor.tsx` (150 lines)

**Purpose:** side-by-side EN and PT-BR form for one doc. React Hook Form with `zodResolver(schemaByCollection[collection])`, run on `cleanDoc(collection, values)` so blank lines are dropped before validation (`:33-40`).

**Layout:**
- Header with title `{New|Edit} · {collection}` and Back button (`:61-68`).
- Meta row, `grid gap-4 sm:grid-cols-3`: `id` text input, `order` number input, `published` switch (`:72-103`).
- Optional "Shared fields" fieldset for language-neutral fields (`:105-112`).
- Two fieldsets (English, Portuguese), each `lang`-tagged, in `grid gap-4 lg:grid-cols-2` (`:114-129`). Two columns appear from 1024 px; below that they stack.
- Footer: Save (label becomes "Saving…") and Cancel (`:137-144`).

**States:**
- Per-field errors, linked with `aria-describedby`, mapped by `errorKey` (`FieldInputs.tsx:11-24`): `custom` → `err.publishBoth`, `too_big` → `err.tooLong`, `invalid_string` → `err.format`, `idTaken` → `err.idTaken`, otherwise `err.invalid`.
- A form-level alert `formHasErrors` after a failed submit (`:131-135`).
- Saving: Save is disabled and shows `saving` (`:138-140`).
- `id` is read-only when editing; for a new doc a taken id sets an `idTaken` error and focuses the field (`:43-47`, `:75-81`).
- Unsaved-changes guard: not found. Back and Cancel call `onCancel` directly (`:65`, `:141`); there is no `isDirty` or `beforeunload` use anywhere in `src/pages/admin`.
- Preview of the doc as the site renders it: not found.

### 2.3 `FieldInputs.tsx` (141 lines)

- `FieldInput` renders a label, the control, an optional hint, and an error for one `FieldDef` (`:30-99`).
- Kinds: `text`, `textarea`, `number` (`valueAsNumber`), `select`, `lines` (one item per line in a textarea; blank lines kept while typing), `objects` (repeatable group), `image` (delegates to `ProjectImageField`) (`:38-81`).
- `ObjectList` (`:105-141`): `useFieldArray`; each item has a numbered header, a Remove button, and its sub-fields; one "Add item" button. No reorder control for items (not found).
- `select` options show the raw option string, or `noneOption` for `""` (`:52-56`).
- The `selectClass` string is duplicated in three files (`FieldInputs.tsx:26-27`, `CropDialog.tsx:28-29`, `ProjectImageField.tsx:16-17`).

### 2.4 `HistoryPanel.tsx` (101 lines)

- **Purpose:** list earlier versions of one doc, newest first, each restorable.
- Props: `collection`, `docId`, `onRestore`, `onBack` (`:11-16`).
- States: loading (`role="status"`), error (`role="alert"`), empty `historyEmpty`, list (`:63-89`).
- Row content: "Version {n} · {date}" and a Restore button (`:73-86`). Date uses `pt-BR` or `en-IE` by site language (`:50-51`). Entry contents, a diff, or a preview are not shown (not found).
- Restore: opens `ConfirmDialog` (`:90-96`), re-validates the old data with the current Zod schema, and shows `restoreInvalid` if it no longer passes (`:39-48`). The restored doc is saved through `CollectionPanel.restore` (`CollectionPanel.tsx:124-130`).
- It accepts only `ContentCollection` (`:5`, `:11`). History entries written for `settings/site` (`adminContent.ts:189`, `:198`) have no viewer or restore UI in the admin (not found).

### 2.5 `SettingsPanel.tsx` (87 lines)

- **Purpose:** edit `settings/site.useRemote` (the kill switch).
- Controls: one `Switch` with label and hint, a "last updated" line when `updatedAt` exists, Save (`:53-82`).
- States: loading, load error (as a notice), saving (button label), success `saved`, error `saveError` (`:32-46`).
- It does not show or edit `cv` or `profilePhoto`. Those are in `FilesPanel`.
- Save writes through `saveSettings`, which adds a history entry and bumps the doc (`adminContent.ts:187-192`).

### 2.6 `FilesPanel.tsx` (265 lines)

- **Purpose:** upload the CV and the profile photo to Vercel Blob and point `settings/site` at them.
- Two independent forms in one tab (`:175-199`, `:201-260`). Each has its own busy flag and notice line.
- **CV form:** shows a link to the current CV with its version (`:179-187`), a file input restricted to PDF (`:188-194`), and "Upload and use". Flow: `uploadFile("cv", file, "hugo-viegas-cv")` then `saveSiteFiles({ cv: { url, version: n+1 } })` (`:100-118`). The Blob file name is fixed in code (`:109`).
- **Photo form:** 96×96 preview (current photo, else the bundled `hugo-hero.webp`, `:205-216`), file input, `CropField` (square only), and EN/PT alt-text inputs (max 200, both required, `:225-255`). Flow: if a new file was chosen, `fitImage` (with the crop) then `uploadFile("profile", file, "hugo-viegas")`; the form then calls `saveSiteFiles({ profilePhoto: {url, width, height, alt, version: n+1} })` (`:120-157`). Saving with no new file re-saves the existing URL with new alt text (`:130-133`, `:138`).
- Alt-text defaults come from the `heroImageAlt` translation (`:89-90`), "Hugo Viegas, Software Developer" (`src/config/translations.ts:515-518`).
- States per form: idle, "Preparing the image…", "Uploading…" (plus a "Compressed from X MB to Y MB" note), saved, error (`upload.type|size|name|auth|failed|decode|sourceSize|noFit`) (`:15-25`, `:135-155`).
- Resetting to the bundled photo or the fallback CV: the data layer supports `null` (`adminContent.ts:194-196`) but `FilesPanel` never passes it; only the tests do (`src/pages/admin/__tests__/adminContent.test.ts:75`). Not found in the UI.
- Deleting or replacing an old Blob file: not found (`CLAUDE.md` says Hugo does this in the Vercel dashboard).

### 2.7 `ConfirmDialog.tsx` (44 lines)

Wrapper over the shadcn `AlertDialog` (`:1-10`) with title and body as admin-string keys, Cancel and Confirm buttons. Used by `CollectionPanel` (delete) and `HistoryPanel` (restore). Confirm uses the default button style for both destructive and non-destructive actions (`:37`).

### 2.8 `CropDialog.tsx` (259 lines) and `CropField.tsx` (58 lines)

- `CropField` opens `CropDialog` whenever a new file is chosen, resets the crop on a new file, and shows a one-line summary ("Crop: W × H px (shape)" or "No crop: the whole image will be used") plus an "Adjust crop" button (`CropField.tsx:23-41`). Cancelling keeps the whole image (`:7-8`).
- `CropDialog` is a shadcn `Dialog` (`max-h-[95vh] max-w-2xl overflow-y-auto`, `:167-168`). The preview is a 640 px-wide `<canvas>` (`:25`, `:98-101`) with rule-of-thirds guides (`:102-112`).
- Controls: drag (pointer capture), arrow keys (Shift = ×5 step), `+`/`=`/`-` for zoom, a zoom range slider (1 to 4, `cropModel.ts:42`), an aspect select shown only when more than one aspect exists (`:213-229`), Reset, Cancel, Apply (`:238-253`).
- States: loading text (`:179`), decode failure alert `upload.decode` (`:174-178`), ready.
- Aspect sets: profile = square only; project = 16:9, 4:3, 1:1, original (`cropModel.ts:12-20`).
- Apply returns `{ rect, aspect }` in source pixels; nothing is uploaded until the parent form submits or the project Upload button is pressed.

### 2.9 `ProjectImageField.tsx` (126 lines)

- **Purpose:** the `image` field of a project doc. A select of bundled image keys (`contentImages`) plus, when the current value is an `https://` URL, an extra "Uploaded image" option (`:63-85`). Only the current uploaded URL is offered; earlier uploads are not listed (not found).
- 160×90 preview (`resolveContentImage`, `:86-94`) with empty `alt`.
- File input, "Upload" button, `CropField` (project aspects), and a notice line (`:95-121`).
- Flow (`:37-60`): `fitImage` (limit `UPLOAD_KINDS.project.maxBytes`) then `uploadFile("project", file, "cover", docId)`, then `setValue` for `image`, `imageWidth`, and `imageHeight` as dirty form values. The notice says "Uploaded. Save the project to use the new image."
- The upload happens when the Upload button is pressed, before the doc is saved. If the project is never saved, the Blob file stays in the store (Blob files are never deleted by the app).
- The file path uses the form's current `id`. An empty or invalid id makes `checkFile` throw `UploadError("name")` (`blobUpload.ts:35-37`).
- Width and height are also separate editable number fields in the form (`collectionConfig.ts:82-83`).

---

## 3. Data layer

### 3.1 Collections and fields written by the editors

Source of the admin field list: `src/pages/admin/collectionConfig.ts`. Model: `src/content/types.ts`. Limits: `src/content/schema.ts:8-18` mirrored by `firestore.rules`. Every doc also stores `published`, `order` (0 to 10000), `updatedAt` (server time), `version`, and the `en` and `ptBR` blocks (`schema.ts:25-31`, `firestore.rules:63-77`). Required-for-publish fields (non-empty in both languages) are listed per row.

| Collection | Shared (language-neutral) fields | Localized fields (`en` and `ptBR`) | Required to publish | Source |
| --- | --- | --- | --- | --- |
| `experience` | none | title, organization, location, period, description, bullets (lines) | title, organization, period | `collectionConfig.ts:39-64`, `schema.ts:61-71` |
| `education` | none | same as experience | same | `collectionConfig.ts:65-71`, `schema.ts:72` |
| `projects` | `image` (key or Blob URL), `imageWidth`, `imageHeight`, `technologies` (lines), `liveUrl`, `githubUrl`, `detailPath` | title, description, imageAlt | title, description, imageAlt | `collectionConfig.ts:72-100`, `schema.ts:74-93` |
| `projectDetails` | `stack` (lines) | title, summary, `sections` (id, title, body, items), `faq` (question, answer), storyTitle, storyIntro, story (Markdown) | title, summary | `collectionConfig.ts:101-137`, `schema.ts:111-130` |
| `skills` | `group` (select), `iconKey` (select) | label | label | `collectionConfig.ts:138-148`, `schema.ts:95-99` |
| `about` | none | summary (lines, one paragraph per line), `highlights` (title, description), fullStory | summary, fullStory | `collectionConfig.ts:149-170`, `schema.ts:101-109` |
| `settings/site` (not a collection tab) | `useRemote`, `cv {url, version}`, `profilePhoto {url, width, height, alt{en,ptBR}, version}` | none | none | `types.ts:100-124`, `schema.ts:135-157`, `firestore.rules:176-208` |
| `contentHistory` | `collection`, `docId`, `version`, `data`, `savedAt` | none | none | `adminContent.ts:92-98`, `firestore.rules:210-217` |

Notable limits (`schema.ts:8-18`): id 100, short 120, title 200, period 80, text 1000, url 300, story 20000, list 30 items. URLs must be empty or `https://` (`schema.ts:23`). `detailPath` must match `^/[a-z0-9/-]*$` (`schema.ts:89`).

Public rendering consumes only `about[0]` (`src/components/AboutSection.tsx:25`), although the admin can create several `about` docs (`CollectionPanel.tsx:200-206`). The committed snapshot holds 1 about, 2 projects, 4 experience, 3 education, and 42 skills docs (counted from `src/content/snapshot/core.json`).

### 3.2 `collectionConfig.ts` (197 lines)

- `FieldKind` = `text | textarea | lines | number | select | objects | image` (`:13`). `FieldDef` carries `name`, `label` (an `AdminStringKey`), `kind`, optional `rows`, `options`, `fields`, `hint` (`:15-24`).
- `CollectionDef` carries `localized`, `shared`, `empty()`, optional `scope` (reorder grouping, only used by skills) and `hint` (`:26-37`).
- `rowTitle` picks the list label: `title`/`label` of the site language; for experience and education it appends the organization; for `about` it returns the id (`:183-197`).

### 3.3 `editorModel.ts` (90 lines)

Pure helpers, no React or Firebase:
- `fieldId` turns a form path into a DOM id (`:8`).
- `sortByOrder`: by `order`, then `id` (`:10-11`). `nextOrder`: max order + 10, capped at 10000 (`:14-15`). `newDoc`: id `""`, `published: false`, next order, collection defaults (`:17-25`).
- `cleanDoc`: drops blank lines from `lines` fields, recursing into `objects` (`:27-54`).
- `reorderChanges`: swaps a doc with its neighbour inside its scope, renumbers that scope in steps of 10, and returns only docs whose `order` changed (`:61-86`).
- `restoredDoc`: stored fields with `id` set and `updatedAt: null`, `version: 0` (`:88-90`).

### 3.4 `storedDoc.ts` (16 lines)

Types `ExistingDoc { version, data }` and `ExistingDocs` (`:4-10`). `storedFields` strips `id`, `updatedAt`, and `version` before a doc is written (`:12-16`).

### 3.5 `adminContent.ts` (246 lines): reads and writes

All writes use Firestore Lite `writeBatch` and run under Hugo's sign-in.

- **Reads:** `loadCollection` (all docs, `:49-57`), `loadSettings` (`:59-71`), `loadExistingContent` (`:73-84`), `listHistory` (two equality filters, sorted client-side by `savedAt` then `version`, `:218-237`), `listDeletedIds` (`:240-246`).
- **`listDeletedIds`** queries all `contentHistory` entries of a collection with no limit and keeps ids that no longer exist (`:241-245`). `CollectionPanel` calls it on every load (`CollectionPanel.tsx:57`), so each load downloads every history entry of that collection, including each entry's full `data` field.
- **Write batch** (`saveContentDoc`, `:146-156`): if the doc exists, copy its previous stored data to `contentHistory` (`addHistory`, `:86-99`); write the doc with `updatedAt = serverTimestamp()` and `version = previous + 1` (`writeDoc`, `:101-114`); rewrite `settings/site` with a new `updatedAt` and `version + 1` (`bumpSettings`, `:121-136`).
- `bumpSettings` rewrites the whole settings doc, keeping `cv` and `profilePhoto` unless replaced (`:121-136`). `null` file fields are not stored (`:116-118`).
- `saveContentDocs` (reorder/restore, `:159-170`), `deleteContentDoc` (history copy, delete, bump, `:173-185`), `saveSettings` (`:187-192`), `saveSiteFiles` (`:196-208`).
- A batch is capped at 500 writes (`:36`, `:138-143`).
- **Version checks live in the rules.** `validMeta` requires `version == previous + 1` for updates (`firestore.rules:63-73`), and `validSettings` does the same for `settings/site` (`:197-208`). `CollectionPanel` passes the settings it loaded at panel load into every write (`CollectionPanel.tsx:53`, `:95`, `:107`, `:114`, `:121`). A settings version that went stale (for example a second browser tab) makes the whole batch fail with `permission-denied`, and the panel shows the same `staleError` text ("This doc changed since it was loaded") (`CollectionPanel.tsx:80-82`).

### 3.6 EN and PT-BR editing model

- Every content doc is `{ ...shared, en: {...}, ptBR: {...} }` (`types.ts:20`, `schema.ts:34-59`).
- The editor always shows both languages side by side regardless of the UI language (`DocEditor.tsx:114-129`).
- Publishing: the schema's `superRefine` adds a `custom` issue for each empty required field in either language when `published` is true (`schema.ts:41-58`). The rules repeat the check (`firestore.rules:92-96`, etc.).
- Drafts may be incomplete: required-text checks apply only to published docs.

### 3.7 Publish, reorder, history, restore

- **Publish/unpublish:** the list button flips `published` and saves, or shows `publishBlocked` (`CollectionPanel.tsx:101-108`). The same switch is in the editor (`DocEditor.tsx:89-102`).
- **Reorder:** `order` is renumbered in steps of 10 within the scope; only changed docs are written, in one batch (`editorModel.ts:61-86`, `CollectionPanel.tsx:110-115`).
- **History:** every write of an existing doc stores its previous `data` with `version` and `savedAt` (`adminContent.ts:86-99`). A first write of a new doc stores nothing.
- **Restore:** the chosen entry becomes the new current doc through `saveContentDoc`, so it gets a new version number (`HistoryPanel.tsx:39-48`, `CollectionPanel.tsx:124-130`). The restored doc keeps the `published` value it had in that entry. Restoring a deleted doc has no current doc, so it is created at `version: 1` (`adminContent.ts:108-113`, `rules:70-72`); history entries from the earlier life of the id keep their old version numbers, and the list sorts by `savedAt` first, then version (`adminContent.ts:236`).
- **Delete:** copies the doc to history, then deletes it (`adminContent.ts:173-185`). `contentHistory` is create-only and owner-only (`firestore.rules:273-276`).

### 3.8 `adminStrings.ts` (302 lines)

- Admin-only strings, kept in the admin chunk (`:5-6`). Shape `{ EN, PT }` per key, enforced with `satisfies Record<string, Translation>` (`:212`). A regex count of key declarations gives 174.
- `useAdminT()` returns `t(key)` bound to the active site language (`:215-221`). It is the only i18n path for the admin; the admin does not use `src/config/translations.ts` except `getTranslation("heroImageAlt")` in `FilesPanel.tsx:6`, `:89-90`.
- Several keys are built dynamically (`group.${key}`, `upload.${problem}`, `crop.aspect.*`: `CollectionPanel.tsx:215`, `FilesPanel.tsx:17-20`, `ProjectImageField.tsx:56`), so a plain search for the full key string will not find them. Checked: every one of them has an entry (`adminStrings.ts:166-169`, `:263-289`).
- The shared document language (`document.documentElement.lang`) follows the toggle (`src/hooks/useLanguage.tsx:19-27`).

---

## 4. Uploads and images

### 4.1 End-to-end flow

1. Admin picks a file. For images, `CropField` opens `CropDialog` (`CropField.tsx:23-28`).
2. On submit (CV, photo) or on the Upload button (project), images go through `fitImage` (`imageFit.ts:72-145`). CV PDFs skip it.
3. `uploadFile(kind, file, name, projectId?)` (`blobUpload.ts:40-65`):
   - `checkFile` validates the type, size, and pathname against `uploadPolicy` (`:27-38`).
   - Reads the current Firebase user; none → `UploadError("auth")` (`:47-48`).
   - Gets an ID token and calls `upload()` from `@vercel/blob/client`, imported only on first upload (`:49-52`), with `handleUploadUrl: "/api/blob-upload"`, header `authorization: Bearer <ID token>`, `access: "public"`, `multipart: false` (`:53-59`).
   - Rejects any returned URL that does not match the stored-URL pattern (`:60`).
4. `POST /api/blob-upload` (`api/blob-upload.ts:26-73`):
   - Verifies the bearer token before reading the body (`:28-30`) with `isOwnerToken` (RS256 signature, issuer, audience, `sub` = owner UID, `email_verified`, `google.com` provider, `auth_time`; `src/server/ownerToken.ts:28-48`). Failure → 401.
   - `BLOB_READ_WRITE_TOKEN` missing → 500 "Uploads are not configured" (`:31-33`); the variable is read only at `:72`.
   - Accepts only `type: "blob.generate-client-token"` and rejects multipart (`:43-46`).
   - Allowed pathname and type come from `parseUploadPathname` (`:47-51`).
   - Issues a client token valid 5 minutes, limited to one pathname, one content type, and a maximum size, with `addRandomSuffix: true` and `allowOverwrite: false` (`:53-63`).
5. The browser uploads straight to the Blob store.
6. The admin writes the resulting URL to Firestore through the normal owner-only rules: CV and photo through `saveSiteFiles` (`FilesPanel.tsx:110`, `:146-149`), project images when the project doc is saved (`ProjectImageField.tsx:49-51`).

### 4.2 Limits (single source `src/content/uploadPolicy.ts`)

| Kind | Folder / pathname pattern | Types | Max size | Source |
| --- | --- | --- | --- | --- |
| `cv` | `cv/<name>.pdf` | PDF | 5 MB | `uploadPolicy.ts:17`, `:20`, `:36` |
| `profile` | `profile/<name>.<ext>` | WebP, AVIF, JPEG, PNG | 2 MB | `:10-15`, `:21`, `:37` |
| `project` | `projects/<docId>/<name>.<ext>` | WebP, AVIF, JPEG, PNG | 3 MB | `:22`, `:38` |

- `<name>` is `[a-z0-9-]{1,60}`, `<docId>` is `[a-z0-9-]{1,100}` (`:30-32`).
- Token lifetime: `UPLOAD_TOKEN_TTL_MS` = 5 minutes (`:28`).
- Stored URLs must match the store host plus pathname and the store's random suffix (`:75-85`). The host constant is `BLOB_STORE_HOST` (`:6`).
- The same patterns are repeated in `firestore.rules:56-61`, `:109-113`, `:176-193` ("change both together").
- SVG and HTML are not allowed (not in `IMAGE_TYPES`, `:10-15`).

### 4.3 `imageFit.ts` (153 lines)

- Input limit before decoding: 40 MB (`MAX_SOURCE_BYTES`, `:11`); over it → `ImageFitError("sourceSize")` (`:86`).
- A file that is already an allowed type, uncropped, and under the limit is uploaded unchanged (`:97`).
- Otherwise it is re-encoded: tries WebP at quality 0.92, 0.86, 0.8 at full size (`QUALITIES`, `:15`, `:115-119`), then shrinks by an estimated scale at quality 0.86 for up to 6 attempts, down to a 5 % minimum scale (`:17-19`, `:120-140`); failing that → `ImageFitError("noFit")` (`:141`).
- Maximum side 8192 px (`:13`, `:113`).
- Encoder falls back to JPEG on a white background where the canvas cannot encode WebP (`:44-67`).
- `fitNote` produces the "Compressed from X MB to Y MB (W × H px)" suffix (`:150-153`).

### 4.4 `cropModel.ts` (108 lines)

Pure math: `CropState` {zoom 1 to 4, centre}, `clampCrop`, `cropRect` (rounded source rectangle), `panBy`, `zoomTo`, `isFullImage` (`:22-108`). `PROFILE_ASPECTS` and `PROJECT_ASPECTS` are at `:12-20`.

### 4.5 How each file is stored and referenced

| Item | Stored at | Shape | Read by |
| --- | --- | --- | --- |
| CV | `settings/site.cv` | `{ url, version }` (`types.ts:101-104`) | `HeroSection.tsx:28`, `:33`, `:142` (fallback constant `FALLBACK_CV_URL`, `:13-15`) |
| Profile photo | `settings/site.profilePhoto` | `{ url, width, height, alt{en,ptBR}, version }` (`types.ts:106-112`) | `HeroSection.tsx:28`, `:35-37`; `vite.config.ts:42-53` (preload) |
| Project image | `projects/<id>.image` plus `imageWidth`, `imageHeight` | bundled key or Blob URL (`types.ts:41-43`, `schema.ts:74-79`) | `resolveContentImage` (`src/content/images.ts:12-14`) in `ProjectsSection.tsx:127`, `DarcyProject.tsx:28`, `BigBangDuelProject.tsx:45`, `:140` |

Bundled image keys today: `darcy-mcgees`, `big-bang-duel` (`src/content/images.ts:7-10`).

---

## 5. Profile photo, end to end

### 5.1 Firestore field shape

`settings/site.profilePhoto` is optional. When present it is exactly `{ url, width, height, alt: { en, ptBR }, version }` (`firestore.rules:183-193`). Constraints: `url` matches `profile/<stored>.(webp|avif|jpg|png)` in the Blob store; `width` and `height` are integers 1 to 10000; both alt strings are non-empty, at most 200 characters; `version` integer ≥ 1. Allowed keys of the whole settings doc are exactly `useRemote, updatedAt, version, cv, profilePhoto` (`firestore.rules:197-201`).

The TypeScript type is `ProfilePhoto` (`src/content/types.ts:106-112`); the container is `SiteFiles { cv, profilePhoto }` (`:115-118`).

### 5.2 Admin upload and crop

`FilesPanel.tsx:201-260`, flow in §2.6: square-only crop (`PROFILE_ASPECTS`, `cropModel.ts:12`), re-encode to fit 2 MB, upload as `profile/hugo-viegas.<ext>` (the base name is hard-coded, `FilesPanel.tsx:143`; the store adds a random suffix), then `saveSiteFiles`. Each save increments `version` (`:147`). EN and PT-BR alt text are required (`:123-128`).

### 5.3 From Firestore to the page

1. `scripts/content-snapshot.ts:65-68` copies `site.profilePhoto` into `src/content/snapshot/core.json` under `files` (present at `core.json:1003`) on every build (`prebuild`).
2. `src/content/store.ts:6-9` ships that snapshot in the homepage entry. `useSiteFiles()` returns `files` (`:33`).
3. After idle, `remoteCheck` reads `settings/site` and, if newer, `refreshCore` swaps the snapshot's `files` for the live ones (`store.ts:40-62`, `src/content/refresh.ts:36-39`). Parsing uses `parseSiteFiles` without Zod (`src/content/siteFiles.ts:26-56`); a malformed photo becomes `null`.
4. `vite.config.ts:42-53` reads the snapshot at build time and, if a valid photo exists, injects a `<link rel="preload">` via `heroPreloadTag` (`src/config/seoHtml.ts:32`). A new upload reaches that tag only on the next deploy.

### 5.4 Where it renders

- **Only `HeroSection.tsx`.** `const { cv, profilePhoto } = useSiteFiles()` (`:28`); `photoSrc = !photoFailed && profilePhoto?.url ? profilePhoto.url : heroImage` (`:35`); photo face label `profilePhoto?.alt[lang] ?? t("heroFacePhoto")` (`:37`).
- The avatar is a flip card with two faces: `photo` and `minifig` (`:20`, `:36-39`, `:75-103`). The `<img>` elements are decorative (`alt=""`, `:84`, `:95`); the label is used in the button's `aria-label` and in a live announcement (`:44-48`, `:72`).
- The image `width` and `height` attributes are fixed at 368×368 in the markup (`:85-86`, `:96-97`), not taken from the stored `width` and `height`.
- If the uploaded photo fails to load, `onError` switches to the bundled photo (`:31`, `:88`, `:99`).
- The admin shows the same photo in a 96×96 preview (`FilesPanel.tsx:205-216`).
- No other component reads `profilePhoto` (grep over `src/`, tests aside). JSON-LD and Open Graph use `public/og-image.jpg`, per `CLAUDE.md`.

### 5.5 What is still hard-coded or bundled

| Item | Where |
| --- | --- |
| Fallback photo `src/assets/hugo-hero.webp` (also used by the admin preview) | `HeroSection.tsx:8`, `:35`; `FilesPanel.tsx:5`, `:207` |
| Second avatar face `src/assets/brand/hugo-minifig.webp`, not editable from the admin | `HeroSection.tsx:9`, `:38` |
| Which face shows first, `AVATAR_FIRST = "photo"` | `HeroSection.tsx:18`, `:40-42` |
| Labels `heroFacePhoto`, `heroFaceMinifig`, `heroNowShowing`, `heroFlipLabel`, `heroFlipHint` in translations | `HeroSection.tsx:37-38`, `:47`, `:72`, `:117`; `translations.ts:46-48` |
| Fallback CV URL | `HeroSection.tsx:13-15` |
| Fixed rendered size (368 px) and flip animation | `HeroSection.tsx:73`, `:85-86`, `:96-97` |

### 5.6 What a second (alternate) profile image would touch

No implementation here. These are the places that enumerate exactly `cv` and `profilePhoto`, or that would meet a second image:

| Layer | Where it is fixed to one photo |
| --- | --- |
| Types | `ProfilePhoto`, `SiteFiles { cv, profilePhoto }`, `SiteSettings`, `CoreSnapshot.files` (`src/content/types.ts:106-124`, `:146-152`) |
| Zod schema | `profilePhotoSchema`, `siteFilesSchema` (two keys), `siteSettingsSchema`, `coreSnapshotSchema.files` (`src/content/schema.ts:140-157`, `:168-177`) |
| Runtime parser | `parseProfilePhoto`, `parseSiteFiles` (`src/content/siteFiles.ts:26-56`), used by `remoteCheck.ts:13` |
| Firestore rules | `validPhoto`, `validSettings` with `hasOnly([... 'cv', 'profilePhoto'])` (`firestore.rules:183-208`) |
| Upload policy | `profile` kind: folder, pathname and stored-URL patterns accept any `<name>` under `profile/` (`uploadPolicy.ts:21`, `:37`, `:80`); the admin fixes the name `hugo-viegas` (`FilesPanel.tsx:143`) |
| Admin data layer | `bumpSettings` default and `saveSiteFiles` both spell out `{ cv, profilePhoto }` (`adminContent.ts:121-129`, `:202-206`) |
| Admin UI | one photo form: preview, crop, alt text, state (`FilesPanel.tsx:77-83`, `:201-260`) |
| Snapshot script and refresh | copy only `cv` and `profilePhoto` (`scripts/content-snapshot.ts:65-68`, `src/content/refresh.ts:36-39`); committed snapshot (`core.json:1003`) |
| Build preload | one preload tag from one photo (`vite.config.ts:42-53`, `seoHtml.ts:32`) |
| Rendering | `HeroSection.tsx:28`, `:35-37`, and the two-face flip card (`:36-42`, `:75-103`); the minifig face is already the alternate face |
| Tests that assert the exact shape | `src/pages/admin/__tests__/adminContent.test.ts:36-80`, `src/pages/admin/__tests__/FilesPanel.test.tsx:38-134`, `src/content/__tests__/refresh.test.ts:27-145`, `src/test/contentFixtures.ts:23`, `src/config/__tests__/seoHtml.test.ts:83-91` |

---

## 6. Skills and icons

### 6.1 Storage and editing

- Collection `skills`. Fields: `group` (enum `programming | it | certification | focus`, `types.ts:52-53`), `iconKey` (string up to 40 characters, `schema.ts:96`, `firestore.rules:138`), `en.label` and `ptBR.label` (`schema.ts:97`).
- Admin editor: `group` is a `select` over `SKILL_GROUPS`; `iconKey` is a `select` over `["", ...SKILL_ICON_KEYS]` (`collectionConfig.ts:138-148`). The select shows the raw key text, with no icon preview (`FieldInputs.tsx:49-58`).
- The list groups by `group` and reorders within a group (`CollectionPanel.tsx:132-138`, `:212-216`).
- Neither the Zod schema nor the rules check `iconKey` against the list: any string up to 40 characters is accepted (`schema.ts:96`, `firestore.rules:138`).

### 6.2 Icon reference format and source

- Reference format: a lowercase key string, for example `react`, `active-directory`, or `""` for none.
- Allowed keys, 17 in total (`src/content/skillIcons.ts:3-21`): `html, css, javascript, php, java, python, c, vue, react, shell, sql, active-directory, google-workspace, windows-server, linux, docker, network`.
- The comment says `SkillsSection` maps each key to an inline SVG and that both lists must be kept in sync (`skillIcons.ts:1-2`). The map is `Record<SkillIconKey, SkillIcon>` (`SkillsSection.tsx:364-382`), so a missing mapping fails at compile time.
- Icons are inline SVG React components defined in `SkillsSection.tsx:14-352` (hard-coded brand colours inside the SVG paths).
- A skill with an unknown or empty key falls back to the Lucide `Code2` icon (`SkillsSection.tsx:384-387`, `:417`).
- `tint` on each map entry is commented "legacy card tint, unused by the compact tags" (`:358-361`).

### 6.3 Where icons render

- Only `SkillsSection` renders skills, in compact tags: icon `h-4 w-4` plus label (`:398-406`).
- It builds exactly two groups from the docs, `programming` and `it` (`:420-423`). The groups `certification` and `focus` exist in `SKILL_GROUPS`, in the admin, and in the rules, but are not rendered by `SkillsSection` (not found in `:420-444`). The committed snapshot contains skills in all four groups (checked in `core.json`).
- 25 of the 42 skills in the committed snapshot have an empty `iconKey` (counted from `core.json`) and so render the fallback icon where their group is shown.
- The Languages card is static, outside the Firestore content (`:445-458`).
- The admin list itself shows no icons (`CollectionPanel.tsx:218-232`).

### 6.4 Choosing or uploading an icon today

- Choose: only from the fixed select of 17 keys (§6.1).
- Upload: not found. `UPLOAD_KINDS` has only `cv`, `profile`, and `project` (`uploadPolicy.ts:19-23`); `SkillDoc` has no URL field (`types.ts:55-59`).
- `src/assets/skills/` holds SVG files (`css, html, javascript, lucide, nodejs, radix, react, tailwindcss, threejs`) plus a README. No source file imports from `src/assets/skills` (grep: not found).

---

## 7. Admin visual layer

The app was not run for this section. Everything below is from code; screenshots and rendered sizes are not verified.

### 7.1 Layout

- Page: `<main>` is `flex min-h-screen items-center justify-center bg-background px-6 py-24` with an inner `w-full max-w-6xl space-y-6 text-center` column (`AdminPage.tsx:85-90`). Content is therefore centred horizontally and vertically (`items-center` on a `min-h-screen` flex row), with 24 px side padding.
- Dashboard: `Tabs` with `text-left` to undo the centring (`AdminDashboard.tsx:76`). Panels are `space-y-*` stacks inside `TabsContent` (`mt-2`, `src/components/ui/tabs.tsx:45-50`).
- Structure: tab list, then one panel; panel header (`h3.heading-card`) plus primary action, then bordered `rounded-lg` blocks (`divide-y divide-border rounded-lg border border-border` lists, `rounded-lg border border-border p-4` fieldsets and forms).
- Headings: `heading-section` for the page title (`AdminPage.tsx:92`), `heading-card` for panels, `text-sm font-semibold` for `h4` and legends. These come from global utility classes (`src/index.css:108-118`).
- Heading levels: `h1` in the shell, `h3` in panels (`AdminDashboard.tsx:34`, `CollectionPanel.tsx:197`), so no `h2` is used (the `h2` level is skipped).

### 7.2 Tailwind versus inline styles

- Inline `style=` attributes: none in `src/pages/admin/` (grep returned no match).
- `CropDialog` draws on a canvas and notes that no inline styles are needed (`CropDialog.tsx:31-33`). Hard-coded colours appear in canvas drawing code, not in styles: guide lines `rgba(255, 255, 255, 0.55)` (`CropDialog.tsx:103`) and a white background fill for the JPEG fallback (`imageFit.ts:62`).
- Colours use theme tokens (`bg-background`, `text-muted-foreground`, `text-destructive`, `border-border`, `bg-muted`, `ring-ring`). Delete buttons use `variant="outline"` with `text-destructive` (`CollectionPanel.tsx:284-295`).

### 7.3 Shared components

From `src/components/ui/`: `Button` (variants/sizes from `button.tsx`), `Badge`, `Input`, `Textarea`, `Label`, `Switch`, `Tabs*`, `Dialog*`, `AlertDialog*`. Native elements: `<select>` (three copies of the same class string, §2.3), `<input type="file">` via `Input`, `<input type="range">` (`CropDialog.tsx:198-211`), `<table>` (Overview), `<canvas>` (crop).

Admin-only components: `ConfirmDialog`, `FieldInput`, `ObjectList`, `NoticeLine` and `FileField` (both private to `FilesPanel.tsx:28-64`), `CropField`, `CropDialog`, `ProjectImageField`.

The notice markup (`<p role=... className="text-sm text-destructive">`) is repeated in `CollectionPanel.tsx:154-161`, `FilesPanel.tsx:56-64`, `SettingsPanel.tsx:73-79`, and `ProjectImageField.tsx:114-120`.

### 7.4 Theme and language behaviour

- Theme: the global `ThemeProvider` (`attribute="class"`, `defaultTheme="dark"`, `enableSystem`) wraps the whole app including the admin (`src/App.tsx:53`). The admin has no theme code of its own; it relies on tokens from `src/styles/*.css`.
- The theme, language, and spaceship controls come from the public `TopControls` (`src/components/TopControls.tsx:9-28`), fixed at the top right with `z-[60]` (`:15`), on top of the admin page.
- Language: one global state persisted in `localStorage["language"]`, shared with the public site (`src/hooks/useLanguage.tsx:5-27`, `:32-40`). `useAdminT` reads it (`adminStrings.ts:215-221`). Date formatting in `HistoryPanel` and `SettingsPanel` follows it (`HistoryPanel.tsx:50-51`, `SettingsPanel.tsx:70`). Row titles use the content language derived from it (`CollectionPanel.tsx:41`).
- `<html lang>` updates on language change (`useLanguage.tsx:19-27`). The editor's language fieldsets set their own `lang` (`DocEditor.tsx:118`, `FilesPanel.tsx:235`).
- The skip link exists globally (`src/App.tsx:59`); the admin `<main>` carries `id="main-content"` (`AdminPage.tsx:86`).

### 7.5 Responsiveness by code (Tailwind defaults: `sm` 640, `md` 768, `lg` 1024)

| Width | What the code produces |
| --- | --- |
| 320 and 390 px (below `sm`) | 24 px side padding, so about 272 and 342 px of content (`AdminPage.tsx:88`). Meta row is one column (`DocEditor.tsx:72`). EN and PT fieldsets are stacked (`:114`). Collection rows are a column with wrapping buttons (`CollectionPanel.tsx:221`). The tab list wraps; each trigger is `whitespace-nowrap` (`AdminDashboard.tsx:77`, `tabs.tsx:30`). The Overview table is `w-full text-sm` with no overflow wrapper (`AdminDashboard.tsx:45`). Crop dialog scrolls within `max-h-[95vh]` (`CropDialog.tsx:168`). |
| 768 px (`md`) | Collection rows become a horizontal row with six buttons wrapping on the right (`CollectionPanel.tsx:221`, `:234`). Meta row is three columns from 640 px (`DocEditor.tsx:72`). EN and PT are still stacked (two columns start at 1024 px). |
| 1440 px | Content is capped at `max-w-6xl` (1152 px, `AdminPage.tsx:90`). EN and PT sit side by side (`DocEditor.tsx:114`). Photo alt inputs are two columns (`FilesPanel.tsx:225`). |

Not verified: overlap of the fixed `TopControls` (top right, `TopControls.tsx:15`) and the public bottom pill (below `lg`, `DynamicSidebar`) with admin content at narrow widths. The page has `py-24` (96 px) top and bottom padding (`AdminPage.tsx:88`), which gives space for the top controls.

### 7.6 Accessibility facts visible in code

- Each field has a visible label and hint/error wiring (`FieldInputs.tsx:35-36`, `:83-97`); file inputs have `aria-describedby` hints (`FilesPanel.tsx:47`).
- Row buttons carry `aria-label` with the doc title (`CollectionPanel.tsx:239`, `:249`, `:259`, `:269`, `:279`, `:291`).
- The crop canvas has `role="img"`, `tabIndex={0}`, an `aria-label`, and keyboard handling (`CropDialog.tsx:182-194`, `:137-154`).
- `ConfirmDialog` uses Radix `AlertDialog` (focus trap and Escape come from the library, comment at `ConfirmDialog.tsx:13`).
- Row buttons are `h-9` (36 px) (`button.tsx:32`); `Input` is `h-10` (`input.tsx:11`).
- The Radix `Switch` has an `id` and a label via `htmlFor` (`DocEditor.tsx:93-101`, `SettingsPanel.tsx:54-62`).

---

## 8. ChatBot

### 8.1 Files

| File | Role |
| --- | --- |
| `src/components/ChatBot.tsx` (277 lines) | UI: launcher, floating panel, embedded panel. |
| `src/lib/chatbot-service.ts` (565 lines) | Context text, rate limit, Gemini request. |
| `src/lib/project-contexts/darcy.json`, `big-bang-duel.json` | Project-specific context, imported at `chatbot-service.ts:1-2`. |
| `src/components/project/ProjectParts.tsx` (`ProjectAssistant`, `:152-213`) | Frame, suggested questions, and mount for the embedded panel on project pages. |
| `src/config/translations.ts` | UI strings and suggested-question text (`chatOpen/Close/Greeting/Description` at `:209-212`; `darcySuggestedQuestions` `:188`, `darcyQuestion*` `:227-247`; `bigBangQuestion*` `:314-334`). |
| `src/lib/__tests__/chatbot-language.test.ts` | Test for `detectResponseLanguage`. |

### 8.2 Where it mounts

- **Home:** `Index.tsx` lazy-imports `ChatBot` (`:12`) and renders `<ChatBot />` inside `<Suspense fallback={null}>` (`:29-31`). It is the floating launcher variant.
- **Project pages:** `ProjectAssistant` renders `<ChatBot projectId=... initialPrompt=... embedded onClose=...>` once the visitor opens it (`ProjectParts.tsx:204-208`). `ProjectParts.tsx` imports `ChatBot` statically (`:6`); the project pages themselves are lazy routes (`src/App.tsx:22-26`). Used by `DarcyProject.tsx:70-76` (`projectId="darcy"`) and `BigBangDuelProject.tsx:119-125` (`projectId="big-bang-duel"`).
- **Admin route:** not mounted.

### 8.3 UI states

| State | Behaviour | Source |
| --- | --- | --- |
| Launcher (floating mode) | Round 56 px button, fixed bottom right, `aria-label` open/close, `aria-expanded`; no ping or pulse. | `ChatBot.tsx:263-271` |
| Panel, floating | Fixed `bottom-24 right-6`, 500 px tall, `w-[360px] max-w-[calc(100vw-48px)]`, dark `neutral-900` surface with blur. | `:144` |
| Panel, embedded | In-flow, 500 px tall, `max-w-2xl`, `border-primary/30 bg-neutral-900`. Open state starts true. | `:49`, `:142-143`, `:255-257` |
| Empty | Brick image, greeting (`chatGreeting`), description (varies by project). | `:171-182` |
| Messages | User bubbles right (`bg-primary`), assistant bubbles left (`bg-neutral-800`); plain text only (no Markdown or links). | `:184-200` |
| Loading | Text bubble (project-specific string); input disabled. | `:201-207`, `:238` |
| Error | `role="alert"` red text. `sendChatMessage` returns a string for most failures (not configured, rate limit, all models failed: `chatbot-service.ts:420`, `:427-429`, `:459`), so those appear as assistant messages; this state is reached only if the call throws. | `ChatBot.tsx:112-114`, `:208-212` |
| Rate counter | Footer "N/100 • M/15", initial values 100 and 15, refreshed every 10 s while open. No label text. | `:54-57`, `:81-85`, `:218-222` |

Input: labelled (`sr-only`), submit disabled when empty or loading (`:229-250`). Focus moves to the input on open (`:74-79`). Messages scroll into view (`:70-72`). Close button calls `onClose` then toggles (`:132-137`, `:159-167`).

Not found in `ChatBot.tsx`: an Escape-key handler, a focus trap or focus return, `aria-live` on the message list, persistence of the conversation, a clear/reset control, and a dark/light theme variant (panel colours are fixed `neutral-*` classes). The panel header and empty-state avatar use `bg-gradient-to-br` (`:149`, `:173`).

### 8.4 How context and suggested questions are provided

- **Portfolio context:** the exported constant `PORTFOLIO_CONTEXT` (`chatbot-service.ts:31-131`) holds hard-coded text: positioning, roles, education, skills, featured projects, personal story, goals, site description. It is not generated from Firestore content or from `translations.ts`. It is the only place it is used (`:492`).
- **Project context:** `getProjectContext` returns the Darcy or Big Bang Duel context block when `projectId` matches, or when no project is set and the message matches a keyword regex (`:133-145`, `:273-284`). The blocks are built from the two JSON files (`:197-271`).
- **Language:** `detectResponseLanguage` scores English and Portuguese marker words and falls back to the active site language (`:147-195`); an instruction line is added to the prompt (`:472-477`, `:492`).
- **Request shape:** system context sent as the first user turn, a canned model reply, the history, then the new message (`:485-511`); `maxOutputTokens: 800`, four safety categories at `BLOCK_MEDIUM_AND_ABOVE` (`:512-536`).
- **Models:** `gemini-2.5-flash` and `gemini-2.0-flash`, rotated, with fallback to the next on failure (`:16-28`, `:432-457`).
- **Suggested questions:** home: none (no such prop or strings in `ChatBot.tsx`). Project pages: `ProjectAssistant` shows six translated questions per project as buttons; clicking sets `initialPrompt` and opens the panel (`ProjectParts.tsx:185-202`), and `ChatBot` sends it once per distinct value (`ChatBot.tsx:120-125`).
- **Rate limits:** 15 per minute and 100 per day, counted in `localStorage` keys `chatbot_rate_minute` and `chatbot_rate_day` (`chatbot-service.ts:291-300`, `:311-397`). This is client-side only: clearing storage resets it.
- **Hours or days in messages:** user-facing limit messages are bilingual strings in the service (`:427-429`), not in the translation table.

### 8.5 Security note: API key read in the browser

- The key is read as `import.meta.env.VITE_GEMINI_API_KEY` in the browser bundle (`chatbot-service.ts:417`). A missing or placeholder value returns a "not configured" message (`:419-421`). Variable name documented at `.env.sample:11-13`.
- It is sent to `generativelanguage.googleapis.com` as a `?key=` query parameter from the browser (`chatbot-service.ts:538-547`).
- `VITE_*` values are public in the built JS (`CLAUDE.md` Security and Privacy; `.env.sample:19-20`). `CLAUDE.md` already records this as a known audit item and defers remediation. No remediation is proposed here.
- There is no server-side endpoint for chat (not found under `api/`; the only route is `api/blob-upload.ts`).

### 8.6 Content points to check against `CLAUDE.md`

Facts for Hugo's decision (see §9.3):
- `PORTFOLIO_CONTEXT` lists skills such as Node.js, Express.js, MySQL, Supabase, Three.js, React Three Fiber, and Figma basics (`chatbot-service.ts:83-88`) and describes 3D and Star Wars-inspired site features (`:122-128`).
- It states a goal of "Front-end or Full-stack developer positions" (`:117`).
- The project-page chat panel ships in `ProjectParts` and is visible as a dark panel on both themes.

---

## 9. Dead code, usability gaps, open questions

### 9.1 Dead or unused

- **Admin source files:** every file in `src/pages/admin/` is imported by at least one non-test file (checked per file: AdminDashboard, AdminPage, CollectionPanel, ConfirmDialog, CropDialog, CropField, DocEditor, FieldInputs, FilesPanel, HistoryPanel, ProjectImageField, SettingsPanel, adminAuth, adminContent, adminStrings, blobUpload, collectionConfig, cropModel, editorModel, firebase, imageFit, storedDoc). **No dead admin file found.**
- **Admin strings:** no key is unused. Keys that look unused to a plain search (`group.*`, `upload.*`) are built dynamically (§3.8).
- **Unused values inside live files:**
  - The `settings` returned by `loadExistingContent()` is not used by `Overview` (`AdminDashboard.tsx:20`).
  - `tint` on each skill icon entry (`SkillsSection.tsx:360`).
  - Skill groups `certification` and `focus` are editable in the admin but not rendered by `SkillsSection` (§6.3).
  - `saveSiteFiles` accepts `null` to reset a file, but no UI passes it (§2.6).
  - `settings` history entries are written, but no UI reads them (§2.4).
- **Unreferenced assets outside the admin:** `src/assets/skills/*.svg` (no importer found).
- **Admin tests present:** AdminPage, CollectionPanel, CropField, DocEditor, FilesPanel, adminContent, blobUpload, cropModel, editorModel, imageFit (`src/pages/admin/__tests__/`), plus `src/server/__tests__/blobUpload.test.ts`. Tests not found for: `AdminDashboard`, `HistoryPanel`, `SettingsPanel`, `ProjectImageField`, `CropDialog`, `ConfirmDialog`, `FieldInputs`.

### 9.2 Usability gaps verifiable from code

Admin shell and navigation
1. Blank page while the lazy admin chunk loads (`<Suspense fallback={null}>`, `src/App.tsx:64`).
2. The public nav pill, background layers, and spaceship toggle render behind and over the admin (§1.1).
3. Sign-in button has no busy state while the popup is open (`AdminPage.tsx:68-75`, `:122-126`).
4. Active tab is not in the URL, so a reload returns to Overview (`AdminDashboard.tsx:76`).
5. No link back to the public site, and no way to see how a change looks on it (not found).

Editing
6. No unsaved-changes warning on Back, Cancel, tab switch, or page close (§2.2).
7. No search, filter, or sort controls in lists (not found in `CollectionPanel.tsx`).
8. Reorder is one step at a time with ↑/↓ buttons; each click is a Firestore write plus a settings bump (`CollectionPanel.tsx:110-115`, `:254-273`).
9. "Publish blocked" does not say which field or language is missing (`CollectionPanel.tsx:101-108`, `adminStrings.ts:77-80`). The editor does show per-field errors.
10. `about` accepts several docs, but only the first is rendered (`AboutSection.tsx:25`), and the list label for an `about` doc is its id (`collectionConfig.ts:192-193`).
11. `projectDetails` has no field linking it to a project; the link is the matching `detailPath`/id by convention (`collectionConfig.ts:87`, `:101-137`). The admin does not check that a published project's `detailPath` has a published detail doc (not found).
12. Project `imageWidth` and `imageHeight` are editable numbers separate from the image (`collectionConfig.ts:82-83`).
13. Deleted-doc recovery lists ids only, with no title or preview (`CollectionPanel.tsx:304-323`). History rows show version and date only (`HistoryPanel.tsx:73-76`).
14. List and history notices are not dismissible and persist until the next action (`CollectionPanel.tsx:154-161`).
15. A stale settings version produces the doc-level "changed since loaded" message (§3.5).
16. Every `CollectionPanel` load downloads all history entries of the collection (§3.5).

Files and images
17. No way in the UI to reset the photo or CV to the bundled/fallback, or to remove a file (§2.6).
18. Project image upload happens before the doc is saved and old uploads are neither listed nor reusable except through history (§2.9).
19. The photo has one slot; the minifig face of the avatar is bundled and not editable (§5.5).
20. Alt text for a project image is required to publish; the profile photo alt is separate and required on every save (`FilesPanel.tsx:123-128`).

Skills
21. Icon `select` shows raw keys without preview (§6.1).
22. 25 of 42 snapshot skills have no icon; groups `certification` and `focus` are not shown on the site (§6.3).

Responsive and touch
23. Row buttons are 36 px high, below the project's own 44 px `touch` size (`button.tsx:32-34`).
24. The Overview table has no horizontal-overflow wrapper (`AdminDashboard.tsx:45`).
25. Heading level jumps from `h1` to `h3` (§7.1).

ChatBot (verifiable against `CLAUDE.md`)
26. No Escape handling, focus trap, or focus return (§8.3).
27. Gradient classes in the panel header and empty state (`ChatBot.tsx:149`, `:173`), and a fixed dark palette independent of the theme (`:143-144`).
28. Client-side-only rate limit and key (§8.4-8.5).

### 9.3 Open questions for Hugo

Decisions needed before a redesign brief can be final:

1. **Admin chrome:** should the public nav, controls, star field, and spaceship stay visible on the admin route, or is the admin a separate shell? (§1.1)
2. **Language of the admin UI:** should it keep sharing the public site's EN/PT toggle, or have its own setting? (§7.4)
3. **Second profile image:** what is it for (for example the minifig face, a light/dark variant, or a different crop), and should it be editable from the admin? Should it have its own alt text and its own preload? (§5.6)
4. **Skills:** should the admin let Hugo upload or pick an icon beyond the 17 bundled keys? Should `certification` and `focus` groups be shown on the site, or removed from the admin? Should skills without an icon keep the generic fallback? (§6)
5. **`about` docs:** should the admin allow only one `about` doc, given only the first is rendered? (§3.1)
6. **Project detail linkage:** is the `detailPath` and `projectDetails` id convention intended to stay implicit? (§9.2 item 11)
7. **Settings history:** should `settings/site` history be viewable and restorable, or is write-only history intended? (§2.4)
8. **Reset and removal of files:** should the admin offer "use the bundled photo / fallback CV" and a way to list or remove old Blob files? (§2.6)
9. **Dirty-state and navigation behaviour:** should leaving an edited doc require confirmation, and should the active tab and view be linkable? (§9.2 items 4, 6)
10. **Overview scope:** should the Overview include `settings`, files, last deploy or snapshot freshness, or stay as a count table? (§1.4)
11. **ChatBot content:** should `PORTFOLIO_CONTEXT` keep its current skills list (Node.js, Express.js, MySQL, Supabase, Three.js, Figma basics) and its description of 3D and Star Wars features, given the `CLAUDE.md` rules on evidence-based skills and the primary journey? (§8.6)
12. **ChatBot redesign scope:** `CLAUDE.md` defers a chatbot redesign and a backend proxy. Should the design-tool brief treat the chatbot as in scope for visuals only, or exclude it? (§8)
13. **ChatBot theme and accessibility:** should the panel follow the light/dark theme, drop the gradients, and add Escape, focus return, and a live region? (§8.3)
14. **Route and chunk loading:** should the lazy admin chunk show a loading state instead of a blank area? (§9.2 item 1)
15. **Touch-target size** in admin lists: stay at 36 px or follow the 44 px `touch` size used on the public site? (§7.6)

### 9.4 Scope check against the audit brief

| Brief item | Section |
| --- | --- |
| Admin shell and flow | §1 |
| Panels and editors (inputs, states, actions) | §2 |
| Data layer | §3 |
| Uploads and images | §4 |
| Profile photo end to end, alternate image requirements | §5 |
| Skills storage, editing, icons | §6 |
| Admin visual layer, theme, language, widths | §7 |
| ChatBot, mounts, states, context, key note | §8 |
| Dead files, gaps, open questions | §9 |

No file under `src/`, `api/`, rules, config, or dependencies was changed by this audit. The only file added is `docs/admin-audit.md`.
