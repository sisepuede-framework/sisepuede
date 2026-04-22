# SISEPUEDE Course

Bilingual (English / Spanish) [Docusaurus 3](https://docusaurus.io) course site
for the **SISEPUEDE** integrated assessment modeling framework.

## Prerequisites

- Node.js **20+** (required by Docusaurus 3.10)
- npm (bundled with Node)
- Python 3 (only for the helper scripts under `scripts/` and `sync_tutorials.py`)

## Quickstart

```bash
# Install dependencies
npm install

# Dev server (English, default locale)
npm run start

# Dev server (Spanish)
npm run start -- --locale es

# Production build (all locales)
npm run build

# Serve the production build locally
npm run serve

# Sync tutorial notebooks/content from the main SISEPUEDE repo
python sync_tutorials.py

# Lint: verify every EN doc has a Spanish mirror
python scripts/check_locale_parity.py
```

The `baseUrl` and site URL are configured in `docusaurus.config.ts`.

## Repo layout

```
course/
├── docs/                                       # EN source (authoritative)
│   └── <module>/
│       ├── _category_.json                     # Sidebar label + position
│       └── *.md | *.mdx
├── i18n/
│   └── es/
│       ├── docusaurus-plugin-content-docs/
│       │   └── current/                        # ES mirror of docs/ tree
│       ├── docusaurus-theme-classic/           # Navbar/footer translations
│       └── code.json                           # UI string translations
├── src/
│   ├── components/                             # Shared MDX / React components
│   ├── css/                                    # Tailwind + custom CSS
│   └── pages/                                  # Standalone pages (non-doc)
├── static/                                     # Images, downloads, favicon
├── scripts/
│   └── check_locale_parity.py                  # EN<->ES parity lint
├── sync_tutorials.py                           # Pull tutorials from main repo
├── docusaurus.config.ts
├── sidebars.ts
├── tailwind.config.js
└── package.json
```

## Content authoring

- **Modules** live under `docs/<module-slug>/`. Each module directory must
  contain a `_category_.json` file controlling its sidebar label, position,
  and (optionally) a link to an auto-generated index:

  ```json
  {
    "label": "Module 2 - AFOLU",
    "position": 2,
    "link": { "type": "generated-index" }
  }
  ```

  The Spanish mirror at `i18n/es/docusaurus-plugin-content-docs/current/<module-slug>/_category_.json`
  should carry the translated `label`.

- **File naming** inside a module follows `NN-slug.md` (e.g. `01-intro.md`) so
  Docusaurus picks up a stable order when no explicit `sidebar_position`
  front matter is set.

- **MDX components**: reusable components live in `src/components/` and are
  imported directly in `.mdx` pages, e.g.:

  ```mdx
  import Figure from '@site/src/components/Figure';
  import Callout from '@site/src/components/Callout';

  <Callout type="warning">Requires AFOLU inputs.</Callout>
  <Figure src="/img/lurf.png" caption="Land Use Reallocation Factor" />
  ```

- **Diagrams**: Mermaid is enabled via `@docusaurus/theme-mermaid`. Use a
  fenced ```` ```mermaid ```` block.

- **Parity rule**: every file added to `docs/` must have a Spanish counterpart
  at the same relative path under `i18n/es/docusaurus-plugin-content-docs/current/`.
  CI runs `scripts/check_locale_parity.py` and fails the build otherwise.

## Adding a new language

1. Register the locale in `docusaurus.config.ts`:

   ```ts
   i18n: {
     defaultLocale: 'en',
     locales: ['en', 'es', 'fr'],
   },
   ```

2. Scaffold translation directories:

   ```bash
   npm run write-translations -- --locale fr
   ```

3. Mirror `docs/` into `i18n/fr/docusaurus-plugin-content-docs/current/` and
   translate `_category_.json` labels.

4. Extend `scripts/check_locale_parity.py` if you want to enforce parity for
   the new locale.

5. Run `npm run start -- --locale fr` to preview.

## Related

- Main framework repo: [jcsyme/sisepuede](https://github.com/jcsyme/sisepuede)
- Documentation: https://sisepuede.readthedocs.io
