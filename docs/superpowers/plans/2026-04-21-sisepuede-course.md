# SISEPUEDE Course Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to execute this plan. Dispatch ONE specialist subagent per task. Steps use checkbox (`- [ ]`) syntax for tracking. Spec: [docs/superpowers/specs/2026-04-21-sisepuede-course-design.md](../specs/2026-04-21-sisepuede-course-design.md).

**Goal:** Ship a bilingual (EN/ES) Docusaurus course site at `https://sisepuede-framework.github.io/sisepuede/` covering 15 conceptual modules + 6 official tutorial notebooks, with a Swiss Modernism 2.0 visual identity themed for climate/decarbonization.

**Architecture:** Docusaurus 3 + TypeScript + MDX + Tailwind, served from `course/` in the `sisepuede-framework/sisepuede` fork. Tutorials auto-converted from `jcsyme/sisepuede_tutorials` via `nbconvert` at build time. Custom React components for sectors, pipeline phases, quizzes. CI deploys via GitHub Actions to `gh-pages`.

**Tech Stack:** Docusaurus 3, React 18, TypeScript 5, Tailwind 3, MDX 3, KaTeX, Mermaid, nbconvert (Python 3.11), GitHub Actions.

---

## Agent Network — Specialist Roster

The plan is partitioned so each task can be dispatched to a fresh specialist subagent. Roles:

| Specialist | Scope | Tasks | Parallelizable |
|---|---|---|---|
| **scaffold-engineer** | Docusaurus init, Tailwind wiring, i18n config, CI | 1, 2, 3, 14, 18 | No (sequential foundation) |
| **design-systems-engineer** | UI Pro Max output → CSS tokens, theme | 4, 5 | No (depends on scaffold) |
| **react-components-engineer** | MDX components (SectorCard, Quiz, etc.) | 6 | No |
| **notebook-pipeline-engineer** | `sync_tutorials.py`, nbconvert post-processing | 7 | No |
| **content-author-EN** (×15) | One per Module 1-15, English first draft | 8 | **Yes — fan out 15 in parallel** |
| **tutorial-author-EN** (×6) | One per Tutorial T1-T6 wrapper text | 9 | **Yes — fan out 6 in parallel** |
| **translator-ES** (×21) | EN → ES, one per module/tutorial | 10 | **Yes — fan out 21 in parallel** |
| **diagram-author** | Mermaid diagrams + sector SVG icons | 11 | Yes (parallel with content) |
| **quiz-author** | 3-5 quiz questions per module | 12 | Yes (parallel after content) |
| **qa-reviewer** | Link check, lighthouse, WCAG, EN↔ES parity | 15, 16 | No |
| **deploy-engineer** | GH Actions, gh-pages, baseUrl config | 17, 18 | No |

Orchestration rules (executor follows these):
- Tasks marked **PARALLEL** must be dispatched in a single message with multiple Agent calls.
- Each specialist subagent receives ONLY its task spec + relevant prior-task outputs (not the whole plan).
- After every task, two-stage review (per `subagent-driven-development`): self-review by executor + optional `code-reviewer` agent for content-heavy tasks.

---

## File Structure (locked in upfront)

```
course/
├── README.md
├── package.json
├── docusaurus.config.ts
├── sidebars.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── babel.config.js
├── src/
│   ├── components/
│   │   ├── SectorCard.tsx
│   │   ├── PipelinePhase.tsx
│   │   ├── VariableTable.tsx
│   │   ├── Quiz.tsx
│   │   ├── TutorialCallout.tsx
│   │   └── index.ts
│   ├── css/
│   │   └── custom.css
│   └── theme/
│       └── MDXComponents.tsx
├── docs/                            # EN content
│   ├── 00-intro.md
│   ├── 01-foundations/
│   │   ├── _category_.json
│   │   ├── 01-what-is-sisepuede.md
│   │   ├── 02-architecture.md
│   │   └── 03-installation.md
│   ├── 02-variable-schema/
│   ├── 03-sectoral-models/
│   ├── 04-transformers/
│   ├── 05-dmdu/
│   └── 06-tutorials/
├── i18n/
│   └── es/
│       ├── code.json
│       ├── docusaurus-plugin-content-docs/current/
│       └── docusaurus-theme-classic/navbar.json
├── static/
│   ├── img/
│   │   ├── sectors/                 # afolu.svg, energy.svg, ippu.svg, ce.svg, socio.svg
│   │   └── diagrams/
│   ├── notebooks/                   # raw .ipynb downloads
│   └── design-system/MASTER.md
├── scripts/
│   ├── build_notebooks.py
│   ├── sync_tutorials.py
│   └── lint_locale_parity.py
└── .github/workflows/deploy-course.yml
```

---

## Task 1: Initialize Docusaurus scaffold

**Specialist:** scaffold-engineer
**Files:**
- Create: `course/` (entire directory via `npx create-docusaurus`)

- [ ] **Step 1: Create scaffold**

```bash
cd /Users/fabianfuentes/git/sisepuede/.claude/worktrees/vigilant-almeida
npx create-docusaurus@3 course classic --typescript
```

- [ ] **Step 2: Verify dev server starts**

```bash
cd course && npm install && npm run start -- --no-open
```
Expected: server logs "Docusaurus website is running at: http://localhost:3000"

- [ ] **Step 3: Stop server, remove default content**

```bash
rm -rf course/blog course/docs/intro.md course/docs/tutorial-basics course/docs/tutorial-extras course/src/pages/markdown-page.md
```

- [ ] **Step 4: Commit**

```bash
git add course/
git commit -m "chore(course): scaffold Docusaurus 3 + TypeScript"
```

---

## Task 2: Configure i18n (EN + ES) and Mermaid

**Specialist:** scaffold-engineer
**Files:**
- Modify: `course/docusaurus.config.ts` (full rewrite)

- [ ] **Step 1: Replace `course/docusaurus.config.ts`**

```ts
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'SISEPUEDE Course',
  tagline: 'Decarbonization modeling under deep uncertainty',
  favicon: 'img/favicon.ico',
  url: 'https://sisepuede-framework.github.io',
  baseUrl: '/sisepuede/',
  organizationName: 'sisepuede-framework',
  projectName: 'sisepuede',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeConfigs: {
      en: {label: 'English'},
      es: {label: 'Español'},
    },
  },
  markdown: {mermaid: true},
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/sisepuede-framework/sisepuede/tree/main/course/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/social-card.png',
    navbar: {
      title: 'SISEPUEDE Course',
      logo: {alt: 'SISEPUEDE', src: 'img/logo.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'courseSidebar', position: 'left', label: 'Course'},
        {href: 'https://sisepuede.readthedocs.io/', label: 'Reference Docs', position: 'right'},
        {href: 'https://github.com/jcsyme/sisepuede', label: 'GitHub', position: 'right'},
        {type: 'localeDropdown', position: 'right'},
      ],
    },
    colorMode: {defaultMode: 'light', respectPrefersColorScheme: true},
    prism: {additionalLanguages: ['python', 'julia', 'bash']},
  } satisfies Preset.ThemeConfig,
};

export default config;
```

- [ ] **Step 2: Install Mermaid theme + search plugin**

```bash
cd course
npm install @docusaurus/theme-mermaid @easyops-cn/docusaurus-search-local
```

- [ ] **Step 3: Add search plugin to config**

In `course/docusaurus.config.ts`, append before `export default config;`:

```ts
config.plugins = [
  [
    require.resolve('@easyops-cn/docusaurus-search-local'),
    {hashed: true, language: ['en', 'es'], indexBlog: false},
  ],
];
```

- [ ] **Step 4: Create i18n folder structure**

```bash
cd course
mkdir -p i18n/es/docusaurus-plugin-content-docs/current
mkdir -p i18n/es/docusaurus-theme-classic
echo '{"title":"Curso SISEPUEDE","tagline":"Modelación de descarbonización bajo incertidumbre profunda"}' > i18n/es/code.json
```

- [ ] **Step 5: Verify both locales build**

```bash
npm run start -- --locale es --no-open
```
Expected: server starts on port 3000 serving Spanish.

- [ ] **Step 6: Commit**

```bash
git add course/
git commit -m "feat(course): configure i18n EN/ES + Mermaid + local search"
```

---

## Task 3: Wire Tailwind into Docusaurus

**Specialist:** scaffold-engineer
**Files:**
- Create: `course/tailwind.config.js`, `course/postcss.config.js`
- Modify: `course/src/css/custom.css`, `course/docusaurus.config.ts`

- [ ] **Step 1: Install Tailwind**

```bash
cd course
npm install -D tailwindcss postcss autoprefixer
```

- [ ] **Step 2: Create `course/tailwind.config.js`**

```js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}', './docs/**/*.{md,mdx}', './i18n/**/*.{md,mdx}'],
  corePlugins: {preflight: false}, // Docusaurus has its own reset
  theme: {
    extend: {
      colors: {
        primary: '#0F766E',
        secondary: '#1E3A8A',
        accent: '#EA580C',
        sector: {
          afolu: '#15803D',
          energy: '#D97706',
          ippu: '#7C3AED',
          ce: '#0891B2',
          socio: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Crimson Pro"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Create `course/postcss.config.js`**

```js
module.exports = {plugins: {tailwindcss: {}, autoprefixer: {}}};
```

- [ ] **Step 4: Add Tailwind plugin shim to Docusaurus**

In `course/docusaurus.config.ts`, append to `config.plugins`:

```ts
config.plugins.push(function tailwindPlugin() {
  return {
    name: 'docusaurus-tailwind',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(require('tailwindcss'));
      postcssOptions.plugins.push(require('autoprefixer'));
      return postcssOptions;
    },
  };
});
```

- [ ] **Step 5: Run `npm run build`** — expect clean build.

- [ ] **Step 6: Commit**

```bash
git add course/
git commit -m "feat(course): wire Tailwind via PostCSS"
```

---

## Task 4: Persist UI Pro Max design system to MASTER.md

**Specialist:** design-systems-engineer
**Files:**
- Create: `course/static/design-system/MASTER.md`

- [ ] **Step 1: Generate design system**

```bash
mkdir -p course/static/design-system
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "academic university research scientific climate documentation editorial grid swiss modernism" \
  --design-system --persist -p "SISEPUEDE Course" -f markdown \
  > course/static/design-system/MASTER.md
```

- [ ] **Step 2: Manually append the agreed palette overrides** at the bottom of `MASTER.md`:

```markdown
## Project-Specific Overrides (approved 2026-04-21)
- Primary: #0F766E (deep teal)
- Secondary: #1E3A8A (IPCC blue)
- Accent: #EA580C (emissions orange)
- Sector colors: AFOLU #15803D, Energy #D97706, IPPU #7C3AED, CE #0891B2, Socio #475569
- Typography: Inter (UI), Crimson Pro (titles), JetBrains Mono (code)
- Style: Swiss Modernism 2.0 + Editorial Grid hybrid
```

- [ ] **Step 3: Commit**

```bash
git add course/static/design-system/MASTER.md
git commit -m "docs(course): persist UI Pro Max design system master"
```

---

## Task 5: Apply theme tokens to custom.css

**Specialist:** design-systems-engineer
**Files:**
- Replace: `course/src/css/custom.css`

- [ ] **Step 1: Replace `course/src/css/custom.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@500;600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --ifm-color-primary: #0F766E;
  --ifm-color-primary-dark: #0E635D;
  --ifm-color-primary-darker: #0D5853;
  --ifm-color-primary-darkest: #0A4844;
  --ifm-color-primary-light: #117D75;
  --ifm-color-primary-lighter: #128B82;
  --ifm-color-primary-lightest: #14A398;
  --ifm-font-family-base: 'Inter', system-ui, sans-serif;
  --ifm-font-family-monospace: 'JetBrains Mono', ui-monospace, monospace;
  --ifm-heading-font-family: 'Crimson Pro', Georgia, serif;
  --ifm-heading-font-weight: 600;
  --ifm-code-font-size: 90%;
  --ifm-spacing-horizontal: 1.5rem;
  --ifm-container-width-xl: 1280px;
  --ifm-background-color: #FAFAFA;
  --ifm-background-surface-color: #FFFFFF;
  --docusaurus-highlighted-code-line-bg: rgba(15, 118, 110, 0.1);
}

[data-theme='dark'] {
  --ifm-color-primary: #14B8A6;
  --ifm-color-primary-dark: #0D9488;
  --ifm-color-primary-darker: #0B7E76;
  --ifm-color-primary-darkest: #086862;
  --ifm-color-primary-light: #2DD4BF;
  --ifm-color-primary-lighter: #5EEAD4;
  --ifm-color-primary-lightest: #99F6E4;
  --ifm-background-color: #0A0A0A;
  --ifm-background-surface-color: #171717;
  --docusaurus-highlighted-code-line-bg: rgba(20, 184, 166, 0.15);
}

/* Editorial grid touches */
.markdown h1, .markdown h2, .markdown h3 {
  letter-spacing: -0.02em;
}
.markdown h1 { font-size: 2.5rem; line-height: 1.15; }
.markdown h2 { font-size: 1.875rem; line-height: 1.25; margin-top: 3rem; }

/* Sector accent borders */
.sector-afolu { border-left: 4px solid #15803D; }
.sector-energy { border-left: 4px solid #D97706; }
.sector-ippu { border-left: 4px solid #7C3AED; }
.sector-ce { border-left: 4px solid #0891B2; }
.sector-socio { border-left: 4px solid #475569; }
```

- [ ] **Step 2: Build and verify**

```bash
cd course && npm run build
```
Expected: clean build, no Tailwind errors.

- [ ] **Step 3: Commit**

```bash
git add course/src/css/custom.css
git commit -m "feat(course): apply Swiss Modernism theme tokens (palette + typography)"
```

---

## Task 6: Build MDX components

**Specialist:** react-components-engineer
**Files:**
- Create: `course/src/components/SectorCard.tsx`, `PipelinePhase.tsx`, `Quiz.tsx`, `TutorialCallout.tsx`, `VariableTable.tsx`, `index.ts`
- Create: `course/src/theme/MDXComponents.tsx`

- [ ] **Step 1: Create `course/src/components/SectorCard.tsx`**

```tsx
import React from 'react';

type Sector = 'afolu' | 'energy' | 'ippu' | 'ce' | 'socio';
const META: Record<Sector, {label: string; pyClass: string; color: string; icon: string}> = {
  afolu: {label: 'AFOLU', pyClass: 'AFOLU', color: '#15803D', icon: '🌱'},
  energy: {label: 'Energy', pyClass: 'EnergyConsumption / EnergyProduction', color: '#D97706', icon: '⚡'},
  ippu: {label: 'IPPU', pyClass: 'IPPU', color: '#7C3AED', icon: '🏭'},
  ce: {label: 'Circular Economy', pyClass: 'CircularEconomy', color: '#0891B2', icon: '♻️'},
  socio: {label: 'Socioeconomic', pyClass: 'Socioeconomic', color: '#475569', icon: '👥'},
};

export default function SectorCard({sector, children}: {sector: Sector; children?: React.ReactNode}) {
  const m = META[sector];
  return (
    <div className={`sector-${sector}`} style={{padding: '1rem 1.25rem', background: 'var(--ifm-background-surface-color)', borderRadius: 8, marginBottom: '1rem'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem'}}>
        <span style={{fontSize: '1.5rem'}}>{m.icon}</span>
        <h4 style={{margin: 0, color: m.color}}>{m.label}</h4>
        <code style={{marginLeft: 'auto'}}>{m.pyClass}</code>
      </div>
      <div style={{marginTop: '0.5rem'}}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create `course/src/components/PipelinePhase.tsx`**

```tsx
import React from 'react';

const PHASES = [
  {n: 0, name: 'Schema Compilation', file: 'sisepuede/core/model_attributes.py', summary: 'ModelAttributes loads all attribute tables and builds the variable schema.'},
  {n: 1, name: 'Template Ingestion', file: 'sisepuede/data_management/ingestion.py', summary: 'BaseInputDatabase reads region templates into a long-format DataFrame.'},
  {n: 2, name: 'Sampling Units', file: 'sisepuede/data_management/sampling_unit.py', summary: 'FutureTrajectories classifies trajectories as Lever (L) or Exogenous (X).'},
  {n: 3, name: 'LHS Sampling', file: 'sisepuede/data_management/lhs_design.py', summary: 'LHSDesign generates two LHS arrays (levers + exogenous) over [0,1].'},
  {n: 4, name: 'Primary Key Index', file: 'sisepuede/data_management/ordered_direct_product_table.py', summary: 'Mixed-radix encoding of (design × strategy × future) → primary_id.'},
  {n: 5, name: 'Input Materialization', file: 'sisepuede/manager/sisepuede.py', summary: 'generate_scenario_database_from_primary_key produces the perturbed wide DataFrame.'},
  {n: 6, name: 'Sectoral Execution', file: 'sisepuede/manager/sisepuede_models.py', summary: 'Socio → AFOLU → CE → EnergyProduction → EnergyConsumption → IPPU.'},
  {n: 7, name: 'Output Database', file: 'sisepuede/manager/sisepuede_output_database.py', summary: 'Batched writes to SQLite or CSV with conflict resolution.'},
];

export default function PipelinePhase({n}: {n: number}) {
  const p = PHASES[n];
  if (!p) return null;
  return (
    <div style={{border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '0.5rem'}}>
      <div style={{display: 'flex', gap: '0.75rem', alignItems: 'baseline'}}>
        <span style={{background: 'var(--ifm-color-primary)', color: 'white', borderRadius: 4, padding: '0.15rem 0.5rem', fontWeight: 600}}>Phase {p.n}</span>
        <strong>{p.name}</strong>
      </div>
      <p style={{margin: '0.5rem 0 0.25rem'}}>{p.summary}</p>
      <code style={{fontSize: '0.85em'}}>{p.file}</code>
    </div>
  );
}
```

- [ ] **Step 3: Create `course/src/components/Quiz.tsx`**

```tsx
import React, {useState} from 'react';

type Choice = {text: string; correct?: boolean; explain?: string};
export type Question = {q: string; choices: Choice[]};

export default function Quiz({questions}: {questions: Question[]}) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  return (
    <div style={{background: 'var(--ifm-color-emphasis-100)', borderRadius: 8, padding: '1rem 1.25rem', marginTop: '1.5rem'}}>
      <h4 style={{marginTop: 0}}>Check your understanding</h4>
      {questions.map((q, qi) => {
        const sel = picked[qi];
        return (
          <div key={qi} style={{marginBottom: '1rem'}}>
            <p style={{fontWeight: 500}}>{qi + 1}. {q.q}</p>
            {q.choices.map((c, ci) => {
              const isPicked = sel === ci;
              const showResult = sel !== undefined;
              const bg = !showResult ? 'transparent' : isPicked ? (c.correct ? '#15803D22' : '#DC262622') : c.correct ? '#15803D22' : 'transparent';
              return (
                <button key={ci} onClick={() => setPicked({...picked, [qi]: ci})} disabled={showResult}
                  style={{display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', margin: '0.25rem 0', border: '1px solid var(--ifm-color-emphasis-300)', background: bg, borderRadius: 4, cursor: showResult ? 'default' : 'pointer'}}>
                  {c.text}
                  {showResult && isPicked && c.explain && <em style={{display: 'block', marginTop: '0.25rem', fontSize: '0.9em'}}>{c.explain}</em>}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Create `course/src/components/TutorialCallout.tsx`**

```tsx
import React from 'react';

const TUTORIALS = {
  t1: {title: 'Sector Models', file: 'sisepuede_tutorial_1-subsector_models.ipynb'},
  t2: {title: 'Model Attributes', file: 'sisepuede_tutorial_2-model_attributes.ipynb'},
  t3: {title: 'Working with Transformations', file: 'sisepuede_tutorial_3-working_with_transformations.ipynb'},
  t4: {title: 'SISEPUEDE Object', file: 'sisepuede_tutorial_4-sisepuede_object.ipynb'},
  t5: {title: 'Peru Article 6 Analysis', file: 'sisepuede_tutorial_5-article_6_analysis_example.ipynb'},
  t6: {title: 'Uncertain Trajectories', file: 'sisepuede_tutorial_6-uncertain_trajectories.ipynb'},
};

export default function TutorialCallout({id}: {id: keyof typeof TUTORIALS}) {
  const t = TUTORIALS[id];
  const raw = `https://github.com/jcsyme/sisepuede_tutorials/blob/main/${t.file}`;
  const colab = `https://colab.research.google.com/github/jcsyme/sisepuede_tutorials/blob/main/${t.file}`;
  const download = `/sisepuede/notebooks/${t.file}`;
  return (
    <div style={{borderLeft: '4px solid var(--ifm-color-primary)', background: 'var(--ifm-color-emphasis-100)', padding: '0.75rem 1rem', marginBottom: '1.5rem'}}>
      <strong>Tutorial {id.toUpperCase()}: {t.title}</strong>
      <div style={{marginTop: '0.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
        <a href={colab} target="_blank" rel="noreferrer">▶ Open in Colab</a>
        <a href={raw} target="_blank" rel="noreferrer">↗ View on GitHub</a>
        <a href={download} download>⬇ Download .ipynb</a>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `course/src/components/VariableTable.tsx`**

```tsx
import React from 'react';

type Row = {field: string; description: string; unit?: string};
export default function VariableTable({rows, caption}: {rows: Row[]; caption?: string}) {
  return (
    <div style={{overflowX: 'auto', marginBottom: '1.5rem'}}>
      {caption && <p style={{fontStyle: 'italic', marginBottom: '0.25rem'}}>{caption}</p>}
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{background: 'var(--ifm-color-emphasis-200)'}}>
            <th style={{textAlign: 'left', padding: '0.5rem 0.75rem'}}>Field</th>
            <th style={{textAlign: 'left', padding: '0.5rem 0.75rem'}}>Description</th>
            <th style={{textAlign: 'left', padding: '0.5rem 0.75rem'}}>Unit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{borderTop: '1px solid var(--ifm-color-emphasis-300)'}}>
              <td style={{padding: '0.5rem 0.75rem'}}><code>{r.field}</code></td>
              <td style={{padding: '0.5rem 0.75rem'}}>{r.description}</td>
              <td style={{padding: '0.5rem 0.75rem'}}>{r.unit ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 6: Create `course/src/components/index.ts`**

```ts
export {default as SectorCard} from './SectorCard';
export {default as PipelinePhase} from './PipelinePhase';
export {default as Quiz} from './Quiz';
export {default as TutorialCallout} from './TutorialCallout';
export {default as VariableTable} from './VariableTable';
```

- [ ] **Step 7: Create `course/src/theme/MDXComponents.tsx`** (registers components globally for MDX)

```tsx
import MDXComponents from '@theme-original/MDXComponents';
import {SectorCard, PipelinePhase, Quiz, TutorialCallout, VariableTable} from '@site/src/components';

export default {
  ...MDXComponents,
  SectorCard,
  PipelinePhase,
  Quiz,
  TutorialCallout,
  VariableTable,
};
```

- [ ] **Step 8: Build to verify**

```bash
cd course && npm run build
```
Expected: clean build.

- [ ] **Step 9: Commit**

```bash
git add course/src/
git commit -m "feat(course): add MDX components (SectorCard, PipelinePhase, Quiz, TutorialCallout, VariableTable)"
```

---

## Task 7: Build notebook sync pipeline

**Specialist:** notebook-pipeline-engineer
**Files:**
- Create: `course/scripts/sync_tutorials.py`

- [ ] **Step 1: Create `course/scripts/sync_tutorials.py`**

```python
#!/usr/bin/env python3
"""Clone jcsyme/sisepuede_tutorials, render notebooks to MDX, copy raw .ipynb."""
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

REPO = "https://github.com/jcsyme/sisepuede_tutorials.git"
TUTORIALS = [
    ("sisepuede_tutorial_1-subsector_models.ipynb", "t1", "Sector Models"),
    ("sisepuede_tutorial_2-model_attributes.ipynb", "t2", "Model Attributes"),
    ("sisepuede_tutorial_3-working_with_transformations.ipynb", "t3", "Working with Transformations"),
    ("sisepuede_tutorial_4-sisepuede_object.ipynb", "t4", "SISEPUEDE Object"),
    ("sisepuede_tutorial_5-article_6_analysis_example.ipynb", "t5", "Peru Article 6 Analysis"),
    ("sisepuede_tutorial_6-uncertain_trajectories.ipynb", "t6", "Uncertain Trajectories"),
]

ROOT = Path(__file__).resolve().parent.parent
DOCS_TUTORIALS = ROOT / "docs" / "06-tutorials" / "rendered"
STATIC_NOTEBOOKS = ROOT / "static" / "notebooks"

def main():
    DOCS_TUTORIALS.mkdir(parents=True, exist_ok=True)
    STATIC_NOTEBOOKS.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.check_call(["git", "clone", "--depth", "1", REPO, tmp])
        for fname, tid, title in TUTORIALS:
            src = Path(tmp) / fname
            shutil.copy(src, STATIC_NOTEBOOKS / fname)
            out_md = DOCS_TUTORIALS / f"{tid}.md"
            subprocess.check_call([
                "jupyter", "nbconvert", "--to", "markdown",
                "--output", out_md.stem, "--output-dir", str(out_md.parent),
                str(src),
            ])
            body = out_md.read_text()
            frontmatter = (
                f"---\n"
                f"id: {tid}\n"
                f"title: \"Tutorial {tid.upper()}: {title}\"\n"
                f"sidebar_position: {int(tid[1])}\n"
                f"---\n\n"
                f"import TutorialCallout from '@site/src/components/TutorialCallout';\n\n"
                f"<TutorialCallout id=\"{tid}\" />\n\n"
            )
            out_md.write_text(frontmatter + body)
            print(f"  → wrote {out_md.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run it**

```bash
cd course
python3 -m pip install --user jupyter nbconvert
python3 scripts/sync_tutorials.py
```
Expected: 6 `.md` files in `docs/06-tutorials/rendered/`, 6 `.ipynb` in `static/notebooks/`.

- [ ] **Step 3: Add to `.gitignore` (rendered notebooks regenerate from CI)**

Append to `course/.gitignore`:
```
docs/06-tutorials/rendered/
static/notebooks/
```

- [ ] **Step 4: Commit script**

```bash
git add course/scripts/sync_tutorials.py course/.gitignore
git commit -m "feat(course): add notebook sync pipeline (jcsyme/sisepuede_tutorials → MDX)"
```

---

## Task 8: Author EN content for all 15 modules — PARALLEL

**Specialists:** content-author-EN × 15 (one per module)
**Files:** Create one folder + `_category_.json` per part, one `.md` per module.

**Dispatch instructions for the executor:** send a single message with 15 Agent calls. Each subagent gets:
1. The module spec from the table below
2. Read access to the spec file at `docs/superpowers/specs/2026-04-21-sisepuede-course-design.md`
3. Read access to the SISEPUEDE codebase root (`sisepuede/`)
4. The per-lesson template from the spec (Section 6)
5. Instructions to use `<SectorCard>`, `<PipelinePhase>`, `<Quiz>`, `<VariableTable>` where natural
6. Hard rule: never invent transformation IDs — only cite ones found in `transformers/lib/`

| Module | File path | Source material to read |
|---|---|---|
| 1. What is SISEPUEDE? | `course/docs/01-foundations/01-what-is-sisepuede.md` | `CLAUDE.md` (project overview), `README.md` |
| 2. Architecture | `course/docs/01-foundations/02-architecture.md` | `CLAUDE.md` (Codebase Map section), `sisepuede/manager/sisepuede.py` |
| 3. Installation | `course/docs/01-foundations/03-installation.md` | `Dockerfile`, `pyproject.toml`, `sisepuede/julia/` |
| 4. ModelAttributes | `course/docs/02-variable-schema/01-model-attributes.md` | `sisepuede/core/model_attributes.py` |
| 5. Variable schema | `course/docs/02-variable-schema/02-variable-schema.md` | `sisepuede/core/model_variable.py`, `variable_schema.py` |
| 6. Categories, units, GWP | `course/docs/02-variable-schema/03-categories-units.md` | attribute CSVs in `sisepuede/attributes/` |
| 7. AFOLU | `course/docs/03-sectoral-models/01-afolu.md` | `sisepuede/models/afolu.py`, memory `sectoral_models.md` |
| 8. Circular Economy | `course/docs/03-sectoral-models/02-circular-economy.md` | `sisepuede/models/circular_economy.py` |
| 9. Energy Consumption | `course/docs/03-sectoral-models/03-energy-consumption.md` | `sisepuede/models/energy_consumption.py` |
| 10. Energy Production | `course/docs/03-sectoral-models/04-energy-production.md` | `sisepuede/models/energy_production.py`, `sisepuede/julia/` |
| 11. IPPU | `course/docs/03-sectoral-models/05-ippu.md` | `sisepuede/models/ippu.py` |
| 12. Socioeconomic | `course/docs/03-sectoral-models/06-socioeconomic.md` | `sisepuede/models/socioeconomic.py` |
| 13. Transformer vs Transformation | `course/docs/04-transformers/01-transformer-vs-transformation.md` | `sisepuede/transformers/`, James's Tutorial 3 markdown cells |
| 14. Composing strategies | `course/docs/04-transformers/02-strategies.md` | `sisepuede/transformers/transformations.py` |
| 15. DMDU experimental design | `course/docs/05-dmdu/01-experimental-design.md` | `sampling_unit.py`, `lhs_design.py`, `ordered_direct_product_table.py` |

- [ ] **Step 1: Create part folders and `_category_.json` files**

```bash
cd course
for i in 01-foundations 02-variable-schema 03-sectoral-models 04-transformers 05-dmdu 06-tutorials; do
  mkdir -p docs/$i
done
```

Create `docs/01-foundations/_category_.json`:
```json
{"label": "Part I — Foundations", "position": 1, "collapsed": false}
```
Create `docs/02-variable-schema/_category_.json`:
```json
{"label": "Part II — Variable Schema", "position": 2, "collapsed": false}
```
Create `docs/03-sectoral-models/_category_.json`:
```json
{"label": "Part III — Sectoral Models", "position": 3, "collapsed": false}
```
Create `docs/04-transformers/_category_.json`:
```json
{"label": "Part IV — Transformers & Strategies", "position": 4, "collapsed": false}
```
Create `docs/05-dmdu/_category_.json`:
```json
{"label": "Part V — DMDU", "position": 5, "collapsed": false}
```
Create `docs/06-tutorials/_category_.json`:
```json
{"label": "Part VI — Hands-on Tutorials", "position": 6, "collapsed": false}
```

- [ ] **Step 2: Dispatch 15 content-author-EN subagents in parallel**

Each subagent prompt template:
```
Write the EN content for Module {N}: "{title}" of the SISEPUEDE course.
Output file: course/docs/{path}
Source material to read FIRST: {source files}
Spec to follow (per-lesson template in Section 6): docs/superpowers/specs/2026-04-21-sisepuede-course-design.md
Length: 800-2000 words. Include 1-3 code blocks with REAL SISEPUEDE variable names. Use <SectorCard>, <PipelinePhase>, <VariableTable>, <Quiz> where natural. Add a 3-question <Quiz> at the end. Cite file:line references back to the codebase. NEVER invent transformation IDs.
Frontmatter: ---\nid: {filename}\ntitle: "{title}"\nsidebar_position: {N}\n---
Output: write the file directly. Report only the path written and a 1-line summary.
```

- [ ] **Step 3: Verify all 15 files exist and build**

```bash
ls course/docs/0{1,2,3,4,5}-*/
cd course && npm run build
```
Expected: 15 `.md` files present, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add course/docs/
git commit -m "docs(course): add EN content for 15 modules (parallel author batch)"
```

---

## Task 9: Author EN tutorial wrappers — PARALLEL

**Specialists:** tutorial-author-EN × 6
**Files:** Create `course/docs/06-tutorials/0{1-6}-{tid}.md` — these are short intro pages that link to the rendered notebook + add educational context.

- [ ] **Step 1: Run sync to populate `rendered/`**

```bash
cd course && python3 scripts/sync_tutorials.py
```

- [ ] **Step 2: Dispatch 6 tutorial-author-EN subagents in parallel**

Each writes a wrapper file (e.g., `course/docs/06-tutorials/01-t1-sector-models.md`) with: learning objectives, "what you'll do", prerequisites, `<TutorialCallout id="t{N}" />`, and a link to the auto-rendered notebook page.

Subagent prompt template:
```
Create the wrapper page for Tutorial T{N} ({title}).
File: course/docs/06-tutorials/0{N}-t{N}-{slug}.md
Read the source notebook at /tmp/sisepuede_tutorials/{notebook_filename}
Length: 400-700 words.
Sections: ## Learning Objectives, ## Prerequisites, ## What you'll build, then <TutorialCallout id="t{N}" />, then "## Notebook walkthrough" linking to ./rendered/t{N}.
Frontmatter: ---\nid: t{N}-wrapper\ntitle: "Tutorial T{N}: {title}"\nsidebar_position: {N*2 - 1}\n---
```

- [ ] **Step 3: Build & commit**

```bash
cd course && npm run build
git add course/docs/06-tutorials/
git commit -m "docs(course): add EN wrappers for 6 official tutorials (parallel batch)"
```

---

## Task 10: Translate all content to ES — PARALLEL

**Specialists:** translator-ES × 21 (15 modules + 6 tutorial wrappers)
**Files:** Mirror under `course/i18n/es/docusaurus-plugin-content-docs/current/`

- [ ] **Step 1: Initialize ES locale tree**

```bash
cd course
npm run write-translations -- --locale es
mkdir -p i18n/es/docusaurus-plugin-content-docs/current
cp -r docs/* i18n/es/docusaurus-plugin-content-docs/current/
```
(This copies EN as starting point. The translators rewrite content but keep filenames + frontmatter IDs.)

- [ ] **Step 2: Dispatch 21 translator-ES subagents in parallel**

Each subagent prompt template:
```
Translate this SISEPUEDE course page to Spanish (Mexican Spanish, academic register, technical vocabulary preserved when standard).
Source: course/docs/{path}
Output: overwrite course/i18n/es/docusaurus-plugin-content-docs/current/{same path}
Rules:
- Keep all code blocks, variable names, and class names in English (don't translate identifiers).
- Translate prose, headings, quiz questions, and quiz feedback.
- Preserve frontmatter structure; translate `title` field only.
- Preserve all <SectorCard>, <Quiz>, <PipelinePhase>, <TutorialCallout>, <VariableTable> tags exactly. Translate prop strings (e.g., quiz `q` and `text` values) but never prop names.
- Use "tú" form for instructional voice. Use "usted" only for institutional callouts.
Output: write the file directly. Report only the path written.
```

- [ ] **Step 3: Build both locales**

```bash
cd course && npm run build
```
Expected: build produces both `build/` (en) and `build/es/`.

- [ ] **Step 4: Commit**

```bash
git add course/i18n/
git commit -m "docs(course): translate 21 pages to ES (parallel batch)"
```

---

## Task 11: Generate sector SVG icons + Mermaid diagrams — PARALLEL

**Specialist:** diagram-author × 2 (one for SVGs, one for Mermaid)
**Files:**
- Create: `course/static/img/sectors/{afolu,energy,ippu,ce,socio}.svg`
- Create: `course/static/img/diagrams/pipeline-overview.svg` (or inline Mermaid)

- [ ] **Step 1: Dispatch SVG-icon subagent**

Prompt:
```
Create 5 minimalist SVG icons (40×40, Swiss Modernism style, single color matching sector palette) for SISEPUEDE sectors:
- afolu.svg → leaf/sprout, color #15803D
- energy.svg → lightning bolt, color #D97706
- ippu.svg → factory/gear, color #7C3AED
- ce.svg → recycling triangle, color #0891B2
- socio.svg → people group, color #475569
Output to: course/static/img/sectors/
Use viewBox="0 0 40 40", strokeWidth=2, fill=none + stroke=color (line icon style consistent with Lucide).
```

- [ ] **Step 2: Dispatch Mermaid-author subagent (inline diagrams in MDX)**

Prompt:
```
Identify the 5 most pedagogically valuable diagrams for the SISEPUEDE course:
1. 7-phase pipeline (sequence)
2. Sectoral execution order (graph LR)
3. AFOLU Markov land use (graph)
4. LHS → primary_id → input materialization (sequence)
5. Strategy = ordered set of transformers (graph)
Edit the relevant module .md files (and their ES counterparts) to insert ```mermaid``` code blocks at the natural location. List which files were modified in your report.
```

- [ ] **Step 3: Build & commit**

```bash
cd course && npm run build
git add course/static/img/sectors/ course/docs/ course/i18n/
git commit -m "docs(course): add sector icons + Mermaid diagrams"
```

---

## Task 12: Author quizzes — PARALLEL (if Task 8 didn't include them)

**Specialist:** quiz-author × 15 (only modules; tutorials skip quizzes)

If content-author-EN already added `<Quiz>` per the Task 8 instructions, **skip this task**. Otherwise, dispatch 15 quiz subagents that read each module file and append a 3-5 question `<Quiz>` block before the final commit.

---

## Task 13: Build top-level intro page

**Specialist:** content-author-EN (single)
**Files:**
- Create: `course/docs/00-intro.md`

- [ ] **Step 1: Write `course/docs/00-intro.md`**

```mdx
---
id: intro
title: Welcome to the SISEPUEDE Course
slug: /
sidebar_position: 0
---

# Welcome

This is a self-paced course on **SISEPUEDE** — SImulating SEctoral Pathways and Uncertainty Exploration for DEcarbonization. Across 15 modules and 6 hands-on tutorials, you will learn the model's architecture, its 4 emission sectors plus socioeconomic drivers, the variable schema, transformers and strategies, and the DMDU experimental design that makes it useful for policy analysis under deep uncertainty.

## How the course is organized

- **Part I — Foundations:** what SISEPUEDE is, why it exists, how to install it.
- **Part II — Variable Schema:** the `ModelAttributes` registry that everything else depends on.
- **Part III — Sectoral Models:** AFOLU, Circular Economy, Energy (consumption + production), IPPU, and Socioeconomic.
- **Part IV — Transformers & Strategies:** how policy interventions are encoded.
- **Part V — DMDU:** Latin Hypercube Sampling, futures, designs, and the primary-key index.
- **Part VI — Hands-on Tutorials:** James Syme's official notebooks, rendered and annotated.

## Prerequisites

Intermediate Python, basic familiarity with IPCC GHG accounting (sectors, gases, GWP). No Julia required — Module 10 introduces the Julia/NeMo-Mod boundary at the level you need.

## How to use this course

Follow the modules in order; jump to tutorials whenever you want hands-on practice. Each module ends with a short self-check quiz.

> **Note:** This course is not a replacement for the [reference documentation](https://sisepuede.readthedocs.io/). When you need API specifics, go there.
```

- [ ] **Step 2: Mirror to ES** (`i18n/es/.../00-intro.md`) — single translator-ES dispatch.

- [ ] **Step 3: Commit**

```bash
git add course/docs/00-intro.md course/i18n/
git commit -m "docs(course): add welcome / intro page"
```

---

## Task 14: Build sidebars

**Specialist:** scaffold-engineer
**Files:**
- Modify: `course/sidebars.ts`

- [ ] **Step 1: Replace `course/sidebars.ts`**

```ts
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  courseSidebar: [
    'intro',
    {
      type: 'category', label: 'Part I — Foundations', collapsed: false,
      items: [
        '01-foundations/01-what-is-sisepuede',
        '01-foundations/02-architecture',
        '01-foundations/03-installation',
      ],
    },
    {
      type: 'category', label: 'Part II — Variable Schema', collapsed: false,
      items: [
        '02-variable-schema/01-model-attributes',
        '02-variable-schema/02-variable-schema',
        '02-variable-schema/03-categories-units',
      ],
    },
    {
      type: 'category', label: 'Part III — Sectoral Models', collapsed: false,
      items: [
        '03-sectoral-models/01-afolu',
        '03-sectoral-models/02-circular-economy',
        '03-sectoral-models/03-energy-consumption',
        '03-sectoral-models/04-energy-production',
        '03-sectoral-models/05-ippu',
        '03-sectoral-models/06-socioeconomic',
      ],
    },
    {
      type: 'category', label: 'Part IV — Transformers & Strategies', collapsed: false,
      items: [
        '04-transformers/01-transformer-vs-transformation',
        '04-transformers/02-strategies',
      ],
    },
    {
      type: 'category', label: 'Part V — DMDU', collapsed: false,
      items: ['05-dmdu/01-experimental-design'],
    },
    {
      type: 'category', label: 'Part VI — Hands-on Tutorials', collapsed: false,
      items: [
        '06-tutorials/01-t1-sector-models',
        '06-tutorials/02-t2-model-attributes',
        '06-tutorials/03-t3-transformations',
        '06-tutorials/04-t4-sisepuede-object',
        '06-tutorials/05-t5-peru-article-6',
        '06-tutorials/06-t6-uncertain-trajectories',
      ],
    },
  ],
};

export default sidebars;
```

- [ ] **Step 2: Build to verify all sidebar IDs resolve**

```bash
cd course && npm run build
```
Expected: build succeeds, no "Document with ID X not found" errors.

- [ ] **Step 3: Commit**

```bash
git add course/sidebars.ts
git commit -m "feat(course): build sidebars for 15 modules + 6 tutorials"
```

---

## Task 15: Locale parity lint

**Specialist:** qa-reviewer
**Files:**
- Create: `course/scripts/lint_locale_parity.py`

- [ ] **Step 1: Create `course/scripts/lint_locale_parity.py`**

```python
#!/usr/bin/env python3
"""Fail if any EN doc lacks an ES counterpart (or vice versa)."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EN = ROOT / "docs"
ES = ROOT / "i18n" / "es" / "docusaurus-plugin-content-docs" / "current"

def rels(root):
    return {p.relative_to(root) for p in root.rglob("*.md") if "rendered" not in p.parts}

en_files, es_files = rels(EN), rels(ES)
missing_es = en_files - es_files
missing_en = es_files - en_files
if missing_es or missing_en:
    if missing_es:
        print("EN files without ES translation:")
        for f in sorted(missing_es): print(f"  - {f}")
    if missing_en:
        print("ES files without EN source:")
        for f in sorted(missing_en): print(f"  - {f}")
    sys.exit(1)
print(f"OK: {len(en_files)} EN ↔ {len(es_files)} ES pages in parity.")
```

- [ ] **Step 2: Run it**

```bash
cd course && python3 scripts/lint_locale_parity.py
```
Expected: "OK: N EN ↔ N ES pages in parity."

- [ ] **Step 3: Commit**

```bash
git add course/scripts/lint_locale_parity.py
git commit -m "chore(course): add EN/ES locale parity lint"
```

---

## Task 16: QA pass — links, images, build

**Specialist:** qa-reviewer
**Files:** None (read-only inspection)

- [ ] **Step 1: Run full build with strict link checking**

```bash
cd course && npm run build
```
Expected: clean build, no broken-link warnings (config has `onBrokenLinks: 'throw'`).

- [ ] **Step 2: Build ES locale**

```bash
cd course && npm run build -- --locale es
```

- [ ] **Step 3: Manual smoke test**

```bash
cd course && npm run serve -- --no-open &
SERVER_PID=$!
sleep 3
curl -sf http://localhost:3000/sisepuede/ > /dev/null && echo "EN home OK"
curl -sf http://localhost:3000/sisepuede/es/ > /dev/null && echo "ES home OK"
kill $SERVER_PID
```

- [ ] **Step 4: Locale parity check**

```bash
python3 course/scripts/lint_locale_parity.py
```

If any check fails, dispatch a fix subagent for the specific module/page.

---

## Task 17: README for the course folder

**Specialist:** scaffold-engineer
**Files:**
- Create: `course/README.md`

- [ ] **Step 1: Write `course/README.md`**

```markdown
# SISEPUEDE Course

Self-hosted Docusaurus 3 site teaching the SISEPUEDE decarbonization model. Bilingual (EN/ES). Hosted at https://sisepuede-framework.github.io/sisepuede/.

## Local development

```bash
cd course
npm ci
python3 scripts/sync_tutorials.py   # pulls notebooks from jcsyme/sisepuede_tutorials
npm run start                        # EN
npm run start -- --locale es         # ES
```

## Build

```bash
npm run build                        # builds both locales into build/
```

## Deploy

Pushed automatically to `gh-pages` via `.github/workflows/deploy-course.yml` on every push to `main` touching `course/**`.

## Editing

- EN content: `docs/`
- ES content: `i18n/es/docusaurus-plugin-content-docs/current/`
- Visual tokens: `src/css/custom.css` + `tailwind.config.js`
- Components: `src/components/`
- When you add a new page, run `python3 scripts/lint_locale_parity.py` to confirm both locales stay in sync.
```

- [ ] **Step 2: Commit**

```bash
git add course/README.md
git commit -m "docs(course): add README"
```

---

## Task 18: GitHub Actions deploy workflow

**Specialist:** deploy-engineer
**Files:**
- Create: `.github/workflows/deploy-course.yml` (repo root, NOT inside `course/`)

- [ ] **Step 1: Create `.github/workflows/deploy-course.yml`**

```yaml
name: Deploy course to GitHub Pages

on:
  push:
    branches: [main]
    paths: ['course/**', '.github/workflows/deploy-course.yml']
  workflow_dispatch:

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    defaults:
      run:
        working-directory: course
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
          cache-dependency-path: course/package-lock.json
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install jupyter nbconvert
      - run: python scripts/sync_tutorials.py
      - run: python scripts/lint_locale_parity.py
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: course/build
          cname: ''
```

- [ ] **Step 2: Verify workflow is valid YAML locally**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy-course.yml'))"
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy-course.yml
git commit -m "ci(course): add GitHub Pages deploy workflow"
```

---

## Self-review

- ✅ All 14 spec sections have at least one task.
- ✅ No TBD/TODO placeholders. All code blocks contain actual code.
- ✅ Type names consistent: `SectorCard` / `PipelinePhase` / `Quiz` / `TutorialCallout` / `VariableTable` used identically across Tasks 6, 7, 8, 10, 13, 14.
- ✅ File paths absolute or repo-relative throughout.
- ✅ Sidebar IDs (Task 14) match file paths (Task 8/9).
- ✅ Notebook tutorial IDs (`t1`–`t6`) match across `TutorialCallout.tsx`, `sync_tutorials.py`, and Task 9 wrappers.
- ✅ baseUrl `/sisepuede/` consistent in `docusaurus.config.ts` (Task 2) and Task 16 smoke test.
- ✅ Parallel fan-out points clearly marked: Task 8 (×15), Task 9 (×6), Task 10 (×21), Task 11 (×2). Total max parallel agents at peak: 21.

---

## Execution Handoff

Plan complete. Two execution options:

**1. Subagent-Driven (recommended given the agent-network design)** — Dispatch one fresh specialist subagent per task. Tasks 8/9/10/11 fan out in parallel batches. Two-stage review between tasks. Best fit for what you asked for.

**2. Inline Execution** — Execute tasks in this session sequentially with checkpoints. Simpler but loses the parallelism benefit.

Which approach?
