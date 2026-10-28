# SISEPUEDE Learning Course

A free, open, bilingual (English / Spanish) Coursera-style course that walks through every section of the official [SISEPUEDE documentation](https://sisepuede.readthedocs.io/en/latest/). Twelve modules, five learning tracks, zero build step — the whole site is static HTML + CSS + vanilla JavaScript that works on any static host (GitHub Pages, Netlify, Cloudflare Pages, S3, etc.).

## What is SISEPUEDE?

**SISEPUEDE** = **SI**mulating **SE**ctoral **P**athways and **U**ncertainty **E**xploration for **DE**carbonization. It is an integrated Python/Julia modelling framework based on the 2006 IPCC Guidelines and their 2019 Refinement, used to explore how an economy can decarbonise under deep uncertainty.

See the [upstream project](https://github.com/jcsyme/sisepuede) for the model itself.

## What is this folder?

This folder (`course/`) is a self-contained static site. Serve any file inside it and the course works.

```
course/
├── index.html              # single-page app shell
├── assets/
│   ├── css/main.css        # design system (Organic Biophilic + SISEPUEDE sector tokens)
│   ├── js/
│   │   ├── i18n.js         # UI translations (EN / ES)
│   │   ├── course-data.js  # all module content, bilingual
│   │   └── main.js         # hash router + rendering
│   └── img/                # DAG, sector diagrams, matrices (from upstream docs)
└── README.md
```

## Course map

| # | Track | Module |
|---|-------|--------|
| 1 | Foundations | Welcome to SISEPUEDE |
| 2 | Foundations | The SISEPUEDE Concept & DAG |
| 3 | Foundations | Installation & Quick Start |
| 4 | Variables & Data | General Data: Sectors, Gases, Regions & Units |
| 5 | Variables & Data | Variables, Categories & Schemas |
| 6 | Sector Models | AFOLU — Agriculture, Forestry & Land Use |
| 7 | Sector Models | Circular Economy — Waste & Wastewater |
| 8 | Sector Models | Energy — Consumption & Production |
| 9 | Sector Models | IPPU & Socioeconomic Drivers |
| 10 | Policy & Strategies | Transformers, Transformations & Strategies |
| 11 | Experiments & RDM | RDM, XLRM & Dimensions of Analysis |
| 12 | Experiments & RDM | The SISEPUEDE Database & Running Models |

Each module contains the same sections in English and Spanish. The language switcher in the header persists the choice in `localStorage`.

## Running locally

Any static server works. The quickest option:

```bash
cd course
python3 -m http.server 8080
# visit http://localhost:8080
```

## Hosting on GitHub Pages

1. Push the repository.
2. In **Settings → Pages**, pick the branch and set the folder to `/course`.
3. Visit `https://<org>.github.io/<repo>/`.

Because the course uses hash-based routing (`#/module/afolu`), it works on any sub-path without extra configuration.

## Design system

The visual language was generated with the [UI/UX Pro Max skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill):

- **Pattern**: Feature-Rich Showcase + Documentation Landing
- **Style**: Organic Biophilic (nature green + solar amber)
- **Typography**: Inter (UI) + JetBrains Mono (code)
- **Icons**: inline Lucide-style SVGs (no emojis)
- **Sector accents** come straight from `attribute_subsector.csv` so the course inherits the colour vocabulary used by the model itself.

## Source material

Every module cites and links to the official docs. Figures (`sisepuede_dag_color.png`, `diagram_afolu.jpg`, …) are copied from `docs/source/img/` under the project's existing licence.

## Contributing

Found a factual error? A missing concept? Open a PR editing `assets/js/course-data.js`. Each module is one JavaScript object with an `en` and `es` content field — add or amend as needed, no build step required.

## Licence

Released under the same licence as the SISEPUEDE project.
