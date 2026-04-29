# core:form Design System

**core:form** is a boutique Pilates studio in Essen, Germany, with two locations:
- **Studio Südviertel** — Moltkestraße 31, 45138 Essen (Reformer Pilates, Raumvermietung)
- **Studio Rüttenscheid** — Gudulastraße 3e, 45131 Essen (Pilates Matte, Barre Workout)

The brand emphasises **effectiveness over trendiness** — precise coaching, small groups (max. 9), personal guidance, real results. It is warm, expert, and grounded. Not a wellness spa; not a gym. A serious, intimate movement practice.

## Sources

| Source | Path / URL |
|---|---|
| Brand photography | `media/` (mounted local folder) — studio shots by professional photographer |
| Color schema | `media/color schema.jpg` |
| Logos (all variants) | `media/RZ_Logo_CoreForm_*.png/.jpg` |
| Custom fonts | `uploads/stacion-*.otf` → copied to `fonts/` |
| Claude Code redesign (reference) | https://suak0903.github.io/core-form/ |
| Live website | https://core-form.de |
| Reference sites | https://www.youformia.de · https://noastudio.de · https://www.egoiste-studio.de |

---

## CONTENT FUNDAMENTALS

### Language & Tone
- **German only.** All copy is in German.
- **Informal "du"** throughout — "Dein Name", "maßgeschneidert für dich", "Wir melden uns schnellstmöglich bei dir."
- **Gender-inclusive language** via colon: "Trainer:innen", "Teilnehmer:innen", "Ausbilder:innen"
- **No emoji.** The brand never uses emoji; it would undercut the expert, serious tone.
- **No exclamation marks in body copy** — confidence doesn't need to shout.

### Copy Style
- **Short. Punchy. Declarative.** Headlines stack: "Kraft. / Kontrolle. / Bewegung." — each a single word or short phrase with a full stop.
- **Italic for warmth.** Emphasis words appear in Stacion italic: *gut tut.*, *Bewegung.*, *Pilates-Trainer:in.*
- **Eyebrows in caps:** section openers use small all-caps labels (e.g. "AUSBILDUNG", "REFORMER PILATES", "MAX. 9 TEILNEHMER:INNEN")
- **Numbers are heroes:** "2 Studios in Essen", "max. 9 Teilnehmer:innen", "3 Kursformate" — specificity builds trust.

### Vocabulary
Core values and recurring terms:
- Kraft · Kontrolle · Bewegung · Präzision · Wohlbefinden · ganzheitlich
- "präzise angeleitet, persönlich begleitet, in kleinen Gruppen"
- "Für Kraft, Stabilität und ein tiefes Wohlbefinden"
- "Jede Bewegung zählt – wenn sie präzise ist."
- "Training, das einfach *gut tut.*"

### CTAs
Always uppercase, tracked, bold. Examples:
- **KURS BUCHEN** (primary, top nav)
- **KURSANGEBOTE ENTDECKEN** / **UNSERE STUDIOS**
- **JETZT ANFRAGEN** / **ZUR AUSBILDUNG**
- **NACHRICHT SENDEN**

---

## VISUAL FOUNDATIONS

### Colors
See `colors_and_type.css` for all CSS variables.

| Name | Hex | Use |
|---|---|---|
| Himbeere | `#b20e3b` | Primary action color — CTAs, highlights, links |
| Brombeere | `#59071d` | Hover on primary; dark accent |
| Creme | `#f2dac2` | Warm section backgrounds, alternating rows |
| Pistazie | `#aed9b3` | Logo green, subtle accents |
| Blau | `#095873` | Education/special section backgrounds |
| Pink | `#fc2cb8` | Colon in logo only |
| Schwarz | `#0d0d0d` | Dark hero backgrounds, footer |
| Grau | `#8c8c8c` | Muted body text, captions |
| Off-white | `#f6f9f7` | Subtle alternating bg |
| Weiß | `#ffffff` | Default background |

**Color rhythm:** Sections alternate — white → creme → dark/teal → white → creme. This creates warmth without sameness. The dark hero image anchors the page at top.

### Typography
- **Stacion** (custom, uploaded OTF) — the brand's display / headline typeface. Used for all H1, H2, and key H3s. The *light italic* variant (`font-weight: 300; font-style: italic`) is particularly distinctive for emphasis words within headlines.
- **DM Sans** (Google Fonts) — used for body text, navigation, labels, CTAs. Clean, geometric, modern but not cold. Pairs well with Stacion.
- **Nav:** ALL CAPS, letter-spacing ~0.08em, 14px DM Sans medium
- **Eyebrows:** ALL CAPS, letter-spacing ~0.15em, 12px, colored in Himbeere

### Imagery
- **Photography style:** Natural light, muted tones — grey-blue activewear, blond wood reformers, white walls, linen curtains, autumn garden glimpsed through windows. Warm but unsaturated. Professional but approachable.
- **Color mood:** Cool-neutral backgrounds (greige walls, grey tile), warm highlights (autumn light, wood tones). NOT vibrant, NOT saturated. B&W toning NOT used.
- **No illustrations or icons in photography contexts.** Images carry the warmth; text carries precision.
- **Full-bleed hero images** with dark overlay for text legibility.
- **Square/portrait crops** used for profile images; landscape for studio shots.

### Layout
- **Max content width:** ~1200px, centered.
- **Section padding:** 96px top/bottom on desktop; 48px mobile.
- **Grid:** Simple 2-column (text + image) or 3-column (cards/pricing). No complex grids.
- **Fixed navbar** on scroll with logo left, links right, primary CTA rightmost.
- **Stats bar** between hero and first content section — large numbers, small labels.

### Buttons
- **Sharp corners (border-radius: 0)** — no pill buttons. This is deliberate — warmth comes from palette, not rounded shapes.
- **All caps, wide letter-spacing, bold** (DM Sans 700)
- Primary: Himbeere fill → Brombeere on hover
- Outline: 1.5px solid border, transparent fill → fill on hover

### Borders & Cards
- Minimal borders — `1px solid rgba(0,0,0,0.1)`
- Cards use subtle shadow (`0 2px 12px rgba(0,0,0,0.07)`) OR just sit on a coloured background (no border needed)
- No rounded card corners — consistent with button philosophy
- Highlighted card (pricing "Empfohlen") uses full Brombeere background with white text

### Shadows
Very restrained. Used only on cards that need to "lift" off the background. Never decorative.

### Animation & Transitions
- **Ease-out curves** for reveals — content slides/fades in from below
- **Duration: 250–450ms** — deliberate, never snappy
- **No bounces** — this is a precision brand, not playful
- Hover states: smooth color transitions (150–250ms)

### Hover States
- Buttons: background darkens (Himbeere → Brombeere)
- Nav links: underline or slight opacity shift
- No scale transforms; no box-shadow on hover

### Spacing Philosophy
- **Generous whitespace** — let content breathe
- Section dividers via background-color changes, not horizontal rules
- Text blocks max ~60 characters wide for readability

### Corner Radii
Strongly prefer `border-radius: 0` (square). Occasionally 2–4px for input fields only.

### Iconography
No icon font. Social icons use simple SVG (Instagram, Facebook, YouTube). Checkmarks (`✓`) used as list markers in education/feature lists.

---

## ICONOGRAPHY

core:form does **not** use a formal icon system. The brand relies on photography and typography rather than iconography. Specific usages:

- **Social icons:** SVG for Instagram, Facebook, YouTube — monochromatic (white on dark, or dark on light)
- **List markers:** Plain text checkmark `✓` or dash `–` 
- **No icon font, no Lucide/Heroicons**
- **Colon `:` in the logo is typographic**, rendered with the brand pink `#fc2cb8`

**Logo naming:**
- `logo-moltke.*` → **Studio Südviertel** (Moltkestraße 31) — pistazie/green brand colour
- `logo-gudula.*` → **Studio Rüttenscheid** (Gudulastraße 3e) — brombeere/raspberry brand colour
- Use Gudula logo as the primary nav/footer identity; use location-specific logos in studio panels.

Assets in `assets/`:
- `logo-moltke.png` / `logo-moltke-black.png` / `logo-moltke-white.png` / `logo-moltke-white-pink.png` — Südviertel
- `logo-gudula.png` / `logo-gudula-black.png` / `logo-gudula-white.png` / `logo-gudula-white-pink.png` — Rüttenscheid
- `social-instagram.png`
- `web-001.jpg` through `web-008.jpg` — professional studio photography
- `eva-01.jpg` through `eva-05.jpg` — Eva Pilates personal photography
- `eva-jelena.jpg`, `jelena-eva.jpg` — team photography
- `ref-1.jpg` through `ref-6.jpg` — screenshots of the Claude Code redesign

---

## FILES

```
README.md                    ← this file
colors_and_type.css          ← all CSS variables + base styles
fonts/
  stacion-regular.otf
  stacion-light.otf
  stacion-italic.otf
  stacion-light-italic.otf
assets/
  logo-moltke.png / -black / -white / -white-pink
  logo-gudula.png / -black / -white / -white-pink
  web-001 → web-008.jpg      ← studio photography
  eva-01 → eva-05.jpg        ← instructor photography
  eva-jelena.jpg, jelena-eva.jpg
  color-schema.jpg
  ref-1 → ref-6.jpg          ← reference screenshots
preview/                     ← Design System tab cards
  colors-primary.html
  colors-neutrals.html
  colors-semantic.html
  type-display.html
  type-body.html
  type-scale.html
  spacing.html
  buttons.html
  cards.html
  logo.html
ui_kits/
  website/
    index.html               ← interactive homepage prototype
    Nav.jsx
    Hero.jsx
    Stats.jsx
    About.jsx
    Courses.jsx
    Pricing.jsx
    Footer.jsx
SKILL.md
```

---

## UI KITS

| Kit | Path | Description |
|---|---|---|
| Website | `ui_kits/website/index.html` | Full homepage clickthrough prototype |
