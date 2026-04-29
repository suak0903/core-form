# core:form — Projektdokumentation

Pilates & Reformer Studio Essen. Zwei Standorte: Rüttenscheid (Gudulastraße 3e) und Südviertel (Moltkestraße 31).

---

## Architektur

`index.html` ist eine **Single-File React-App** (React 18 + Babel Standalone via CDN). Kein Build-Step, kein npm. Die gesamte Logik, das CSS und der JSX-Code leben in einer einzigen Datei.

```
index.html          ← Hauptdatei (React/JSX via Babel)
css/styles.css      ← Alter CSS-Stand (index_old.html) — nicht aktiv
js/main.js          ← Alter JS-Stand — nicht aktiv
index_old.html      ← Alter HTML-Stand — Referenz, nicht aktiv
claude design/
  index.html        ← Originalprototyp (Vorlage für index.html)
  README.md         ← Design-System-Dokumentation
  colors_and_type.css
font/               ← Stacion OTF-Dateien (regular, light, italic, light-italic)
media/              ← Alle Bilder (Logos, Studiofotografie, Eva-Pilates-Serie)
```

---

## Design-System

Vollständige Spezifikation: `claude design/README.md`

### Farben
| Variable | Hex | Verwendung |
|---|---|---|
| Himbeere | `#b20e3b` | CTAs, Links, Akzente, Hamburger-Icon |
| Brombeere | `#59071d` | Hover auf Primary, Featured-Card-BG |
| Creme | `#f2dac2` | Warme Sektionshintergründe, italic-Akzent im Hero |
| Pistazie | `#aed9b3` | Moltke-Logo-Akzent |
| Pink | `#fc2cb8` | Doppelpunkt im Logo (nur Logo) |
| Schwarz | `#0d0d0d` | Texte, Hero-BG, Footer |

### Typografie
- **Stacion** (OTF lokal) — alle Headlines (H1, H2, Preiszahlen). Light Italic für Emphase-Wörter.
- **DM Sans** (Google Fonts) — Body, Nav, Labels, Buttons
- Nav-Links: 12px, `font-weight:500`, `letter-spacing:.08em`, uppercase
- Eyebrows/Labels: 11px, `font-weight:600`, `letter-spacing:.15em`, uppercase, Himbeere

### Buttons
- `border-radius:0` — keine abgerundeten Ecken
- `font-weight:700`, uppercase, `letter-spacing:.15em`

---

## Asset-Mapping

Die Vorlage (`claude design/index.html`) verwendet Pfade wie `../../assets/` und `../../fonts/`. In `index.html` sind diese auf die echten Projektpfade gemappt:

| Design-Pfad | Echter Pfad |
|---|---|
| `../../fonts/stacion-*.otf` | `font/stacion-*.otf` |
| `../../assets/logo-gudula.png` | `media/RZ_Logo_CoreForm_Gudula.png` |
| `../../assets/logo-gudula-white-pink.png` | `media/RZ_Logo_CoreForm_Gudula_weiss_pink.png` |
| `../../assets/logo-moltke.png` | `media/RZ_Logo_CoreForm_Moltke.png` |
| `../../assets/logo-moltke-white-pink.png` | `media/RZ_Logo_CoreForm_Moltke_weiss_pink.png` |
| `../../assets/logo-moltke-white.png` | `media/RZ_Logo_CoreForm_Moltke_weiss.png` |
| `../../assets/web-0XX.jpg` | `media/COREFORM_web_0XX.jpg` |
| `../../assets/eva-01.jpg` | `media/Eva-Pilates 01.jpg` |
| `../../assets/eva-jelena.jpg` | `media/Eva & Jelena.jpg` |

### Bilder pro Sektion (aktueller Stand)
| Sektion | Bild |
|---|---|
| Hero | `COREFORM_web_015.jpg` |
| Reformer Pilates | `COREFORM_web_005.jpg` |
| Pilates Matte | `Eva-Pilates 01.jpg` |
| Barre Workout | `Eva-Pilates 06.jpg` |
| Personal Training | `COREFORM_web_009.jpg` |
| Raumvermietung | `Eva-Pilates 07.jpg` |
| Feature Banner | `COREFORM_web_010.jpg` |
| Studio Rüttenscheid | `Eva-Pilates 02.jpg` |
| Studio Südviertel | `COREFORM_web_002.jpg` |
| Über uns | `Eva & Jelena.jpg` |

### Logos pro Kontext
| Kontext | Logo |
|---|---|
| Nav (scrolled, hell) | `RZ_Logo_CoreForm_Gudula.png` |
| Nav (transparent/dunkel oder Menü offen) | `RZ_Logo_CoreForm_Gudula_weiss_pink.png` |
| Studio-Panel Rüttenscheid | `RZ_Logo_CoreForm_Gudula.png` |
| Studio-Panel Südviertel | `RZ_Logo_CoreForm_Moltke.png` |
| Footer | `RZ_Logo_CoreForm_Moltke_weiss.png` |

---

## Navigation & Mobile

### Desktop-Nav
- Transparent über dem Hero, wechselt bei `scrollY > 40px` auf `rgba(255,255,255,.97)` + Blur
- Logo wechselt: weiß-pink → Farbvariante (Gudula)
- Aktive Sektion per `IntersectionObserver` erkannt → Himbeere-Unterstrich via CSS `::after`

### Mobile-Nav (< 768px)
- Nav-Links und CTA-Button ausgeblendet
- Hamburger-Icon (3 Balken): Himbeere `#b20e3b` auf hellem Hintergrund, Weiß auf dunklem
- **Wichtig:** Mobile-Menü-`<div>` ist ein **Geschwisterelement außerhalb des `<header>`** — nicht darin verschachtelt. Grund: `backdrop-filter` auf `.nav.scrolled` erzeugt einen Stacking-Context, der `position:fixed` von Kindelementen bricht.
- Menü-Overlay: `rgba(13,13,13,.67)` + `blur(20px)` — Frosted-Glass-Effekt
- Bei offenem Menü: Nav-Bar bekommt `rgba(13,13,13,.80)` + Logo wechselt immer auf weiß-pink
- CTA-Button „Kurs buchen" im Nav wird bei offenem Menü ausgeblendet (redundant)

---

## React-State

```js
scrolled     // boolean — Nav-Hintergrund-Wechsel
activeId     // string  — aktive Sektion für Nav-Unterstrich
mobileOpen   // boolean — mobiles Menü auf/zu
```

`scroll(id)` schließt das mobile Menü automatisch (`setMobileOpen(false)`).

---

## Sprachkonventionen

- **Nur Deutsch**, informelles „du"
- Genderform mit Doppelpunkt: `Trainer:innen`, `Teilnehmer:innen`
- Keine Ausrufezeichen in Fließtext
- Keine Emojis

