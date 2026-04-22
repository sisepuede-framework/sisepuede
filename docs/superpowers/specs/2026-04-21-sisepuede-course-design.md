# SISEPUEDE Course — Design Spec

**Date:** 2026-04-21
**Author:** Fabian Fuentes (with Claude)
**Status:** Approved — ready for implementation plan

---

## 1. Goal

Build a Coursera-style, bilingual (EN/ES), self-hostable static website that teaches SISEPUEDE end-to-end. Source material: official ReadTheDocs (`https://sisepuede.readthedocs.io/`), the SISEPUEDE codebase (`jcsyme/sisepuede`), and James Syme's official tutorial notebooks (`jcsyme/sisepuede_tutorials`). Final site lives in the fork at `sisepuede-framework/sisepuede` and deploys to GitHub Pages.

## 2. Non-Goals

- Executing real SISEPUEDE runs in the browser (Julia/NeMo-Mod dependency makes Pyodide impractical).
- Replacing the ReadTheDocs reference docs — the course is pedagogical, not API reference.
- Tracking student progress server-side. No backend, no auth.

## 3. Audience

Three concentric audiences:
- **Primary:** decarbonization analysts, climate-policy researchers, country implementation teams (LAC focus given partners).
- **Secondary:** graduate students in climate/energy modeling.
- **Tertiary:** developers extending SISEPUEDE.

Course assumes intermediate Python, basic IPCC GHG accounting familiarity, no Julia required.

## 4. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Docusaurus 3 (TypeScript) | First-class i18n EN/ES, MDX for React-in-Markdown, Coursera-like module layout, mature GitHub Pages deploy |
| Styling | Tailwind CSS | Maps cleanly to Swiss Modernism 2.0 grid system; integrates with Docusaurus via `@docusaurus/preset-classic` + custom CSS |
| Diagrams | `@docusaurus/theme-mermaid` | Pipeline phases, sector dependencies, Markov diagrams |
| Notebook conversion | `nbconvert --to markdown` (Python, build-time) | Renders the 6 official tutorials into MDX; preserves code + outputs |
| Search | `@easyops-cn/docusaurus-search-local` | Offline search, no Algolia account needed |
| Deploy | GitHub Actions → `gh-pages` branch | Standard Docusaurus CI |

## 5. Visual Design (UI/UX Pro Max output)

**Style:** Swiss Modernism 2.0 + Editorial Grid hybrid. WCAG AAA. 12-column grid, mathematical 8px spacing.

**Palette (climate/decarbonization theme):**
- Primary `#0F766E` — deep teal (sustainability, climate science)
- Secondary `#1E3A8A` — IPCC blue (institutional authority)
- Accent `#EA580C` — emissions orange (CTAs, highlights)
- Sector colors for charts/cards:
  - AFOLU `#15803D` (forest green)
  - Energy `#D97706` (amber)
  - IPPU `#7C3AED` (violet)
  - Circular Economy `#0891B2` (cyan)
  - Socioeconomic `#475569` (slate)
- Neutrals: `#FAFAFA` (bg), `#0A0A0A` (text), `#E5E7EB` (border)
- Full dark mode with palette-shifted equivalents

**Typography:**
- `Inter` (400/500/600/700) — UI and body
- `Crimson Pro` (500/600) — module/section titles (academic register)
- `JetBrains Mono` (400/500) — code, variable names (`agrc_lvst_pop_cattle_dairy`)

**Custom React components (MDX):**
- `<SectorCard sector="afolu" />` — sector summary with icon + color
- `<PipelinePhase n={3} />` — phase card with description and code link
- `<VariableTable category="..." />` — searchable, mono-font, copy button
- `<Quiz>` — multi-choice with feedback, no scoring persistence
- `<TutorialCallout id="t1" />` — links to converted notebook + Colab + raw `.ipynb`
- `<MathInline />` / `<MathBlock />` — KaTeX for Markov, LURF, soil-carbon equations

## 6. Content Structure

### Course outline (15 modules + 6 tutorial chapters)

**Part I — Foundations**
1. What is SISEPUEDE? (DMDU context, partners, publications)
2. Architecture overview (Python+Julia, 7-phase pipeline)
3. Installation & first steps

**Part II — Variable schema**
4. ModelAttributes & attribute tables
5. Variable naming schema + `VariableSchema` tokens
6. Categories, units, GWP

**Part III — Sectoral models**
7. AFOLU (Markov land use, LURF η, crops, livestock, soil carbon)
8. Circular Economy (WALI → TRWW → WASO FOD → INEN)
9. Energy Consumption (FGTV, INEN, SCOE, TRNS, TRDE)
10. Energy Production (NeMo-Mod / Julia LP handshake)
11. IPPU (F-gases, cement, CCS, recycled-fraction coupling)
12. Socioeconomic drivers

**Part IV — Transformers & strategies**
13. Transformer vs Transformation (terminology disambiguation)
14. Composing strategies (ATTRIBUTE_STRATEGY)

**Part V — DMDU**
15. Experimental design: LHS, `FutureTrajectories`, 4-design structure, `primary_id`, `OrderedDirectProductTable`

**Part VI — Hands-on tutorials (James's notebooks)**
- T1: Sector Models
- T2: Model Attributes
- T3: Transformations
- T4: SISEPUEDE object
- T5: Peru Article 6 end-to-end
- T6: Uncertain trajectories

Each module: intro → 3-6 lessons (MDX) → key takeaways → quiz → "next" link.
Each tutorial chapter: intro context → embedded notebook (rendered) → "open in Colab" + download `.ipynb`.

### Per-lesson template
```
1. Learning objectives (3-5 bullets)
2. Body (concept + code + diagram)
3. "In the codebase" callout (file + class + line link to GitHub)
4. Try it yourself (optional snippet)
5. Recap
```

## 7. Internationalization

- Default locale: `en`
- Secondary locale: `es`
- Both versions written from scratch (not auto-translated). User Fabian writes ES; Claude drafts EN.
- File layout per Docusaurus convention:
  ```
  course/
  ├── docs/                         # default (en) source
  ├── i18n/
  │   └── es/
  │       ├── docusaurus-plugin-content-docs/current/
  │       └── code.json
  ```
- Locale switcher in navbar (top-right). Persists via cookie.

## 8. Repository Layout

```
course/                              # NEW — lives in sisepuede-framework/sisepuede
├── README.md                        # how to dev/build/deploy
├── package.json                     # docusaurus + tailwind deps
├── docusaurus.config.ts
├── sidebars.ts
├── tsconfig.json
├── tailwind.config.js
├── src/
│   ├── components/                  # SectorCard, Quiz, etc.
│   ├── css/custom.css               # Swiss Modernism + Tailwind layer
│   └── theme/                       # swizzled components if needed
├── docs/                            # EN content (modules 1-15 + tutorials)
│   ├── 01-foundations/
│   ├── 02-architecture/
│   └── ...
├── i18n/es/...                      # ES content mirror
├── static/
│   ├── img/                         # diagrams, sector icons (SVG)
│   ├── notebooks/                   # raw .ipynb downloads
│   └── design-system/MASTER.md      # generated by ui-ux-pro-max --persist
├── scripts/
│   ├── build_notebooks.py           # nbconvert pipeline
│   └── sync_tutorials.py            # pulls from jcsyme/sisepuede_tutorials
└── .github/workflows/deploy-course.yml
```

## 9. Notebook Pipeline

`scripts/sync_tutorials.py`:
1. `git clone --depth 1 https://github.com/jcsyme/sisepuede_tutorials.git`
2. For each `.ipynb`: `jupyter nbconvert --to markdown --output-dir docs/06-tutorials/<lang>/`
3. Post-process: rewrite image paths, wrap in MDX frontmatter, add `<TutorialCallout>` header
4. Copy raw `.ipynb` to `static/notebooks/` for download

Run as a step in the GitHub Actions workflow before `docusaurus build`.

## 10. Deployment

**Repo:** `sisepuede-framework/sisepuede` (fork)
**Branch:** content lives in `main` under `course/`; built site published to `gh-pages` by Actions.
**URL:** `https://sisepuede-framework.github.io/sisepuede/`
**Docusaurus config:** `baseUrl: '/sisepuede/'`, `url: 'https://sisepuede-framework.github.io'`

GitHub Actions workflow (`deploy-course.yml`):
- Trigger: push to `main` touching `course/**`
- Steps: setup-node 20 + setup-python 3.11 → `pip install jupyter nbconvert` → `python scripts/sync_tutorials.py` → `npm ci` (in `course/`) → `npm run build` → `peaceiris/actions-gh-pages@v3` deploy

## 11. Out-of-Scope (for now, may revisit)

- JupyterLite / Pyodide live execution
- Authenticated progress tracking
- Translation memory / auto-translation
- Video lessons
- Certificate generation
- Comment/discussion threads (e.g., Giscus) — easy to add later
- More than EN/ES locales

## 12. Success Criteria

- All 15 modules + 6 tutorials present in EN and ES
- Site builds clean on GitHub Actions, deploys to Pages URL
- WCAG AA verified for all pages (AAA target for typography contrast)
- Mobile-responsive at 375px, 768px, 1024px, 1440px
- All code examples use real SISEPUEDE variable names (no invented `transformation_id` values)
- Every concept linked back to a file:line reference in `jcsyme/sisepuede`
- Locale switch round-trips cleanly across all pages

## 13. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Notebooks go stale when James updates `sisepuede_tutorials` | `sync_tutorials.py` runs on every build; CI rebuild on schedule |
| Tutorial outputs assume local SISEPUEDE install — won't render in Colab without setup | Add a "Setup in Colab" callout cell at top of each notebook chapter |
| ES translation drift from EN | Convention: PRs must update both locales; lint script flags missing pages |
| Course conflicts with existing `docs/` (Sphinx ReadTheDocs source) | Keep `course/` as a fully isolated sibling; no shared deps |
| Heavy client bundle from MDX components | Lazy-load `<Quiz>` and Mermaid; lighthouse budget enforced in CI |

## 14. Open Questions (resolved)

- ✅ Stack: Docusaurus
- ✅ Depth: exhaustive (option C)
- ✅ Interactivity: medium (quizzes + Colab links, no live exec)
- ✅ Repo location: `sisepuede-framework/sisepuede`, folder `course/`
- ✅ Default locale: EN

---

**Next step:** invoke `superpowers:writing-plans` to break this into a phased implementation plan.
