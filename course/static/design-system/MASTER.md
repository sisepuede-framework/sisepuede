## Design System: SISEPUEDE Course

### Pattern
- **Name:** FAQ/Documentation Landing
- **Conversion Focus:** Reduce support tickets. Track search analytics. Show related articles. Contact escalation path.
- **CTA Placement:** Search bar prominent + Contact CTA for unresolved questions
- **Color Strategy:** Clean, high readability. Minimal color. Category icons in brand color. Success green for resolved.
- **Sections:** 1. Hero with search bar, 2. Popular categories, 3. FAQ accordion, 4. Contact/support CTA

### Style
- **Name:** Swiss Modernism 2.0
- **Mode Support:** Light ✓ Full | Dark ✓ Full
- **Keywords:** Grid system, Helvetica, modular, asymmetric, international style, rational, clean, mathematical spacing
- **Best For:** Corporate sites, architecture, editorial, SaaS, museums, professional services, documentation
- **Performance:** ⚡ Excellent | **Accessibility:** ✓ WCAG AAA

### Colors
| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#18181B` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#3F3F46` | `--color-secondary` |
| Accent/CTA | `#EC4899` | `--color-accent` |
| Background | `#FAFAFA` | `--color-background` |
| Foreground | `#09090B` | `--color-foreground` |
| Muted | `#E8ECF0` | `--color-muted` |
| Border | `#E4E4E7` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring | `#18181B` | `--color-ring` |

*Notes: Editorial black + accent pink*

### Typography
- **Heading:** EB Garamond
- **Body:** Crimson Text
- **Mood:** academic, old-school, university, research, serious, traditional
- **Best For:** University sites, archives, research papers, history
- **Google Fonts:** https://fonts.google.com/share?selection.family=Crimson+Text:wght@400;600;700|EB+Garamond:wght@400;500;600;700;800
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=EB+Garamond:wght@400;500;600;700;800&display=swap');
```

### Key Effects
display: grid, grid-template-columns: repeat(12 1fr), gap: 1rem, mathematical ratios, clear hierarchy

### Avoid (Anti-patterns)
- Poor typography
- Slow loading

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px


---

## Project-Specific Overrides (approved 2026-04-21)

These overrides take precedence over the auto-generated recommendations above.

- **Style:** Swiss Modernism 2.0 + Editorial Grid hybrid
- **Primary:** `#0F766E` (deep teal — sustainability, climate science)
- **Secondary:** `#1E3A8A` (IPCC blue — institutional authority)
- **Accent:** `#EA580C` (emissions orange — CTAs, highlights)
- **Sector colors (charts/cards):**
  - AFOLU `#15803D` (forest green)
  - Energy `#D97706` (amber)
  - IPPU `#7C3AED` (violet)
  - Circular Economy `#0891B2` (cyan)
  - Socioeconomic `#475569` (slate)
- **Neutrals:** `#FAFAFA` (light bg), `#0A0A0A` (light text), `#171717` (dark surface), `#E5E7EB` (border)
- **Typography:**
  - `Inter` (400/500/600/700) — UI and body
  - `Crimson Pro` (500/600) — module/section titles (academic register)
  - `JetBrains Mono` (400/500) — code, variable names
- **Grid:** 12 columns, 8px base spacing unit, max container 1280px
- **Dark mode:** full parity, palette-shifted
- **Accessibility target:** WCAG AAA for body text contrast
