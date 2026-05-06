# core:form — Projektdokumentation

Pilates & Reformer Studio Essen. Zwei Standorte:
- **Studio Rüttenscheid** — Gudulastraße 5 (Innenhof), 45131 Essen — Pilates Matte & Barre Workout
- **Studio Südviertel** — Moltkestraße 16, 45128 Essen — Reformer Pilates & Raumvermietung (eröffnet 01.11.2025)

> **Hinweis:** Die Design-Vorlage in `claude design/README.md` führt ältere Adressen (Gudulastr. 3e / Moltkestr. 31). Maßgeblich sind die Adressen oben — sie spiegeln den tatsächlichen Stand wider (siehe `index.html` Kontaktsektion, `impressum.html`, `faq.html`).

---

## Architektur

Statisches Multi-Page-Setup. Kein Build-Step, kein npm.

| Datei | Stack | Zweck |
|---|---|---|
| `index.html` | React 18 + Babel Standalone via CDN, JSX inline | Startseite (Single-Page-Scroll) |
| `buchung.html`, `buchung-ruettenscheid.html`, `buchung-suedviertel.html` | Vanilla HTML | Buchungsseiten mit Eversports-Widget |
| `ausbildung.html` | Vanilla HTML | Reformer-Lehrerausbildung (Landingpage mit Testimonial-Karussell) |
| `faq.html`, `impressum.html`, `datenschutz.html`, `agb.html` | Vanilla HTML | Inhalts- und Rechtsseiten |
| `css/site.css` | gemeinsames CSS für alle Seiten (inkl. `index.html`) | Design-System, Layout, Subpage-Styles |
| `js/chrome.js` | gemeinsames JS für alle **statischen** Subpages | Nav, Mobile-Menu, Newsletter-Popup |
| `data/newsletter.html` | per `fetch` geladenes Popup-Markup | wird auf allen Seiten dynamisch eingebunden |

```
index.html             ← React-App
buchung*.html          ← statisch, nutzen chrome.js
ausbildung.html        ← statisch, nutzen chrome.js (Landingpage mit Testimonial-Karussell)
faq.html               ← statisch, nutzen chrome.js
impressum.html         ← statisch, nutzen chrome.js
datenschutz.html       ← statisch, nutzen chrome.js
agb.html               ← statisch, nutzen chrome.js
css/site.css           ← gemeinsames Stylesheet (Pflicht für alle Seiten)
js/chrome.js           ← gemeinsame Nav-/Popup-Logik (Pflicht für statische Seiten)
data/newsletter.html   ← Newsletter-Popup-Inhalt (per fetch)
font/                  ← Stacion OTF (regular, light, italic, light-italic)
media/                 ← Bilder & Logos
claude design/         ← kanonische Design-System-Quelle (README.md, colors_and_type.css)
```

`css/styles.css`, `js/main.js`, `index_old.html`, `index_v1.html`, `index_v2.html`, `index_v3.html` sind **alte Stände** — nicht aktiv, nicht editieren.

---

## Design-System (Quelle der Wahrheit: `claude design/`)

Vollständige Spezifikation: `claude design/README.md` und `claude design/colors_and_type.css`. Die Werte hier dürfen **nicht** verändert werden — sie sind die Leitplanken für jede neue Seite.

### Farbpalette

| Token | Hex | Verwendung |
|---|---|---|
| Himbeere | `#b20e3b` | CTAs, Links, Akzente, Labels, Hamburger-Icon, Hover-Underline in Nav |
| Brombeere | `#59071d` | Hover auf Primary, Featured-Card-BG, Text auf Creme (semantic `--fg-on-creme`) |
| Creme | `#f2dac2` | Warme Sektionshintergründe, Subpage-Hero |
| Pistazie | `#aed9b3` | Logo-Akzent (Moltke), dezente Akzente |
| Blau | `#095873` | Education-/Highlight-Sektionen (in Subpages bislang nicht verwendet) |
| Pink | `#fc2cb8` | **Nur** der Doppelpunkt im Logo |
| Schwarz | `#0d0d0d` | Body-Text, Hero-BG, Footer |
| Grau-dunkel | `#2a2a2a` | sekundärer Body-Text (Prosa, Karten-Beschreibungen) |
| Grau-mittel | `#8c8c8c` | gedämpfte Captions / Labels |
| Off-White | `#f6f9f7` | dezente Sektions-Alternative (Format-Cards, Booking-Widget-BG) |
| Weiß | `#ffffff` | Default-BG |

**Sektions-Rhythmus:** weiß → creme → dunkel/teal → weiß → creme. Hero-Bild ankert die Seite oben.

### Typografie

- **Stacion** (lokal, OTF) — Headlines (H1, H2, H3, Preiszahlen). Light-Italic (300 italic) für Emphase-Wörter in Headlines.
- **DM Sans** (Google Fonts) — Body, Nav, Labels, Buttons.
- Nav-Links: 12 px, `font-weight:500`, `letter-spacing:.08em`, uppercase.
- Eyebrows/Labels: 11 px, `font-weight:600`, `letter-spacing:.15em`, uppercase, Himbeere.
- H1 Subpage-Hero: `clamp(40px, 6vw, 72px)`, Stacion light, `letter-spacing:-.02em`.
- Body 16 px, Line-Height 1.7. Prosa 15 px, Line-Height 1.75.

### Buttons

- `border-radius:0` — keine abgerundeten Ecken.
- `font-weight:700`, uppercase, `letter-spacing:.15em`, 11 px.
- Klassen: `.btn .btn--accent` (primär, Himbeere → Brombeere), `.btn--outline` (schwarz), `.btn--ghost` (über Bild, weiß), `.btn--full` (100 % Breite).

### Spacing

- Sektions-Padding: **96 px** desktop / **48 px** mobile (Top + Bottom).
- Container: `max-width:1160px`, Padding `0 40px` desktop / `0 18-24px` mobile.
- Großzügiger Whitespace; Sektionsteilung über Hintergrundfarbe, **nicht** über `<hr>`.

### Animation

- Ease-out (`cubic-bezier(.22,1,.36,1)`), Dauer 250–450 ms.
- Hover: Farbübergang, **kein** Scale, **kein** neuer Box-Shadow.

### Sprachkonventionen

- **Nur Deutsch**, informelles „du".
- Genderform per Doppelpunkt: `Trainer:innen`, `Teilnehmer:innen`, `Ausbilder:innen`.
- **Keine Ausrufezeichen** in Fließtext (Brand spricht ruhig, nicht laut).
- **Keine Emojis**.
- Headlines stacken kurz und enden auf Punkt: „Kraft. Kontrolle. Bewegung." Subpage-H1 trägt **immer** den Schlusspunkt — auch einzelne Wörter („Impressum.", „FAQ.").
- Italic in Headlines (`<em>`) für Wärme: „Bewegung mit *Haltung.*", „*Geschäftsbedingungen.*".
- Eyebrows in Caps: „RECHTLICHES", „STUDIO 01 · RÜTTENSCHEID", „ONLINE BUCHEN".
- Zahlen sind Held:innen: „2 Studios in Essen", „max. 9 Teilnehmer:innen".

---

## Asset-Mapping

Die Vorlage in `claude design/` nutzt Pfade wie `../../assets/` und `../../fonts/`. Im Projekt sind diese auf:

| Design-Pfad | Echter Pfad |
|---|---|
| `../../fonts/stacion-*.otf` | `font/stacion-*.otf` |
| `../../assets/logo-gudula.png` | `media/RZ_Logo_CoreForm_Gudula.png` |
| `../../assets/logo-gudula-white.png` | `media/RZ_Logo_CoreForm_Gudula_weiss.png` |
| `../../assets/logo-gudula-white-pink.png` | `media/RZ_Logo_CoreForm_Gudula_weiss_pink.png` |
| `../../assets/logo-moltke.png` | `media/RZ_Logo_CoreForm_Moltke.png` |
| `../../assets/logo-moltke-white-pink.png` | `media/RZ_Logo_CoreForm_Moltke_weiss_pink.png` |
| `../../assets/web-0XX.jpg` | `media/COREFORM_web_0XX.jpg` |
| `../../assets/eva-01.jpg` | `media/Eva-Pilates 01.jpg` |
| `../../assets/eva-jelena.jpg` | `media/Eva & Jelena.jpg` |

### Logo-Verwendung (zwingend)

| Kontext | Logo |
|---|---|
| Nav (transparent / Hero) | `RZ_Logo_CoreForm_Gudula_weiss_pink.png` (weiß-pink) |
| Nav (scrolled / `.nav.solid`) | `RZ_Logo_CoreForm_Gudula.png` (Farbe) |
| Nav bei offenem Mobile-Menü | `RZ_Logo_CoreForm_Gudula_weiss_pink.png` |
| **Footer (alle Seiten)** | `RZ_Logo_CoreForm_Gudula_weiss.png` |
| Studio-Panel Rüttenscheid | `RZ_Logo_CoreForm_Gudula.png` |
| Studio-Panel Südviertel | `RZ_Logo_CoreForm_Moltke.png` |

> **Regel aus `claude design/README.md`:** Gudula ist die primäre Nav-/Footer-Identität. Standortspezifische Logos nur in Studio-Panels/-Cards.

### Bilder pro Sektion (Startseite, aktueller Stand)

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

---

## Navigation & Mobile (Startseite & Subpages)

### Desktop-Nav

- Auf `index.html`: transparent über dem Hero, wechselt bei `scrollY > 40px` auf `rgba(255,255,255,.97)` + Blur (Klasse `.nav.scrolled`).
- Auf **allen Subpages**: bekommt von Anfang an Klasse `.nav.solid` (immer hell, kein Scroll-Wechsel).
- Logo-Image-Tausch wird auf der Startseite via React-State gesteuert, auf Subpages via `chrome.js` (anhand `data-logo-dark` / `data-logo-light` Attributen).
- Aktive Sektion auf der Startseite per `IntersectionObserver` → Himbeere-Unterstrich (`::after`).

### Mobile-Nav (< 768 px)

- Nav-Links und CTA-Group werden ausgeblendet, Hamburger-Icon erscheint.
- Hamburger: 3 Balken, Himbeere `#b20e3b` auf hellem Hintergrund, Weiß auf dunklem Hintergrund.
- **Wichtig:** Das Mobile-Menü-`<nav id="mobile-menu">` ist ein **Geschwister außerhalb des `<header>`** — nicht darin verschachtelt. Grund: `backdrop-filter` auf `.nav.scrolled`/`.nav.solid` erzeugt einen Stacking-Context, der `position:fixed` von Kindelementen bricht.
- Menü-Overlay: `rgba(13,13,13,.67)` + `blur(20px)` (Frosted Glass).
- Bei offenem Menü: Nav bekommt `.menu-open` Klasse + Logo wechselt auf weiß-pink + CTA-Group wird visuell verborgen.

---

## React-State (nur `index.html`)

```js
scrolled       // boolean — Nav-Hintergrund-Wechsel
activeId       // string  — aktive Sektion für Nav-Unterstrich
mobileOpen     // boolean — mobiles Menü auf/zu
popupOpen      // boolean — Newsletter-Popup auf/zu
newsletterHtml // string  — per fetch geladener Popup-Inhalt
submitted      // boolean — Kontaktformular abgesendet
```

`scroll(id)` schließt das mobile Menü automatisch.

---

## Subpage-Anleitung (Boilerplate für jede neue statische Seite)

> **Anwenden, wenn:** eine neue informative oder rechtliche Seite hinzukommt (z. B. „Über uns", „Workshop XY", „Karriere"), oder eine bestehende erweitert wird. Nicht für `index.html` (React).

### 1. HTML-Grundgerüst (kopieren, nicht neu erfinden)

Jede neue Subpage **muss** dieses Skelett 1:1 enthalten — Reihenfolge, Klassen, IDs, ARIA-Attribute. Inhalt wird nur in `<main id="main-content">` eingesetzt. Nav, Mobile-Menü, Newsletter-Popup und Footer **identisch zu einer existierenden Subpage** (z. B. `faq.html`) übernehmen.

```html
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SEITEN-TITEL — core:form</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/site.css">
</head>
<body>

<a href="#main-content" class="skip-link">Zum Inhalt springen</a>

<!-- NAV — identisch auf jeder Subpage; Klasse "nav solid" zwingend -->
<header class="nav solid">
  <div class="nav__inner container">
    <a href="index.html" class="nav__logo" aria-label="core:form Startseite">
      <img
        src="media/RZ_Logo_CoreForm_Gudula.png"
        data-logo-dark="media/RZ_Logo_CoreForm_Gudula.png"
        data-logo-light="media/RZ_Logo_CoreForm_Gudula_weiss_pink.png"
        alt="core:form" />
    </a>
    <nav class="nav__links" aria-label="Hauptnavigation">
      <a href="index.html#angebote">Angebote</a>
      <a href="index.html#studios">Studios</a>
      <a href="index.html#ueber-uns">Über uns</a>
      <a href="index.html#ausbildung">Ausbildung</a>
      <a href="index.html#preise">Preise</a>
      <a href="index.html#kontakt">Kontakt</a>
    </nav>
    <div class="nav__cta-group">
      <a href="buchung.html" class="btn btn--accent nav__cta">buchen</a>
      <button type="button" class="btn btn--accent nav__cta nav__cta--news" data-newsletter-trigger>News</button>
    </div>
    <button type="button" class="nav__hamburger" aria-label="Menü öffnen" aria-expanded="false" aria-controls="mobile-menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<!-- Mobile-Menü — MUSS Geschwister von <header> sein, nicht Kind!
     Volle Inhalte (Links + Actions + Social SVGs) aus z. B. faq.html kopieren. -->
<nav id="mobile-menu" class="nav__mobile" aria-label="Mobile Navigation" aria-hidden="true">
  <!-- … identisch zu anderen Subpages … -->
</nav>

<!-- Newsletter-Popup -->
<div class="newsletter-pop__backdrop" aria-hidden="true"></div>
<aside class="newsletter-pop" role="dialog" aria-modal="true" aria-label="Newsletter" aria-hidden="true">
  <div class="newsletter-pop__head">
    <span class="label">Newsletter</span>
    <button type="button" class="newsletter-pop__close" aria-label="Newsletter schließen">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" focusable="false">
        <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    </button>
  </div>
  <div class="newsletter-pop__body"><p>Wird geladen …</p></div>
</aside>

<main id="main-content" class="subpage">

  <!-- Pflicht: Hero-Sektion mit Eyebrow, H1 (mit Punkt!), optional Lead-Paragraph -->
  <section class="subpage__hero">
    <div class="container">
      <span class="label">Eyebrow</span>
      <h1>Headline mit <em>Italic-Akzent.</em></h1>
      <p>Optionaler Lead, max. ~3 Zeilen, zur Einordnung.</p>
    </div>
  </section>

  <!-- Inhalt — eine oder mehrere Sektionen mit der passenden Layout-Klasse -->
  <section class="subpage__content">
    <div class="container">
      <div class="prose">
        <h2>…</h2>
        <p>…</p>
      </div>
    </div>
  </section>

</main>

<!-- FOOTER — identisch auf jeder Seite, Logo IMMER Gudula weiß -->
<footer class="footer">
  <div class="container">
    <div class="footer__inner">
      <div class="footer__logo">
        <img src="media/RZ_Logo_CoreForm_Gudula_weiss.png" alt="core:form" loading="lazy" decoding="async" />
      </div>
      <span class="footer__copy">© <span data-current-year>2026</span> core:form Pilates Studio GbR, Essen</span>
      <div class="footer__links">
        <a href="impressum.html">Impressum</a>
        <a href="datenschutz.html">Datenschutz</a>
        <a href="agb.html">AGB</a>
        <a href="faq.html">FAQ</a>
      </div>
    </div>
  </div>
</footer>

<script>
  document.querySelectorAll('[data-current-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
</script>
<script src="js/chrome.js"></script>
</body>
</html>
```

### 2. Layout-Klassen je Inhaltstyp

| Inhalt | Wrapper-Klasse(n) | Hintergrund | Beispiel |
|---|---|---|---|
| Rechtliches / Fließtext | `section.subpage__content > .container > .prose` | weiß | impressum, datenschutz, agb |
| FAQ-Akkordeon | `section.subpage__content > .container > ul.faq-list` mit `<details class="faq-item">` | weiß | faq.html |
| Buchungs-Intro / einleitende Absätze | `section.booking-intro > .container > p` | weiß | buchung.html |
| Studio-Wahl-Karten | `section.booking-intro > .container > .studio-cta-grid > article.studio-cta` | weiß (Karten dunkel) | buchung.html |
| Format-Karussell | `section.formate > .container > .format-carousel` | weiß | buchung.html |
| Eversports-Widget | `section.booking-widget > .container > .booking-widget__head` + Widget-Div | off-white `#f6f9f7` | alle buchung*.html |
| Bild-/Text-Hero (mit BG-Image) | nicht in `.subpage`, sondern `.hero` Klasse — siehe `index.html` | dunkel | nur Startseite |
| **Landingpage-Sektionen (Ausbildung & ähnliche Pages)** | siehe Sektionsliste unten | wechselnd weiß / creme / off-white / dunkel | ausbildung.html |
| **Testimonial-Karussell** | `section.ausbildung-testimonials > .testimonial-carousel > article.testimonial-card` | dunkel `#0d0d0d` | ausbildung.html |

### 3. Pflichtregeln für jede neue Seite

**Layout & Visuals:**
- `<main>` bekommt **immer** `class="subpage"` (Top-Padding für fixierte Nav).
- Erste Sektion **immer** `.subpage__hero` mit Eyebrow (`<span class="label">`) + H1.
- H1 endet **immer** mit Punkt — auch bei einzelnen Wörtern (z. B. „FAQ.").
- Emphase-Wörter im H1 in `<em>…</em>` (rendert als Stacion-light-italic in Himbeere).
- Sektions-Padding: `96px` desktop / `48px` mobile (bereits in `css/site.css` für `.subpage__*`-Klassen gesetzt — **nicht** überschreiben).
- Hintergrund-Rhythmus alternieren: weiß → creme → off-white. Niemals zwei gleichfarbige Sektionen direkt hintereinander.

**Chrome (Nav, Mobile, Footer):**
- Nav bekommt `class="nav solid"` — niemals nur `nav`.
- Mobile-Menu-`<nav id="mobile-menu">` **außerhalb** des Headers platzieren.
- Newsletter-Popup-Markup (`backdrop` + `aside.newsletter-pop`) auf jeder Seite einfügen — `chrome.js` lädt den Inhalt aus `data/newsletter.html` per `fetch`.
- Footer-Logo **immer** `RZ_Logo_CoreForm_Gudula_weiss.png`.
- Footer-Links genau in der Reihenfolge: Impressum · Datenschutz · AGB · FAQ.
- `<script src="js/chrome.js"></script>` als letztes Script vor `</body>`.

**Sprache & Inhalt:**
- Deutsch, „du", keine Ausrufezeichen, keine Emojis.
- Genderform mit Doppelpunkt.
- CTA-Buttons in `.btn.btn--accent` (CSS macht uppercase + tracking automatisch — Text im Markup in Sentence Case schreiben).
- Eyebrows ebenfalls in Sentence Case (CSS macht uppercase).
- Externe Links: `target="_blank" rel="noopener noreferrer"`.

**Verboten:**
- `border-radius` außer 0 (Ausnahme: Input-Felder 2 px).
- Eigene Farben außerhalb der Palette oben.
- Bouncy/elastische Animationen.
- Icons aus Icon-Fonts (Lucide, FontAwesome). Nur eingebettete SVGs für Social.
- Inline-Styles für Visuals (kleine Layout-Korrekturen wie `display:inline` bei Inline-Links innerhalb `<p>` ausgenommen).
- Neue Schriftarten.
- `.nav` ohne `.solid` auf Subpages (führt zu transparentem Nav ohne dunkles Hero darunter → unleserlich).

### 4. Wenn die neue Seite ein Buchungs-Widget braucht

- Neue Eversports-Widget-ID vom Studio anfordern.
- Markup analog `buchung-ruettenscheid.html`/`buchung-suedviertel.html`:
  ```html
  <section class="booking-widget" id="kurse">
    <div class="container">
      <div class="booking-widget__head">
        <span class="label">Online buchen</span>
        <h2>Headline mit <em>Italic.</em></h2>
        <p>Kontextualisierender Lead.</p>
      </div>
      <div data-eversports-widget-id="WIDGET-UUID-HIER"></div>
      <script type="module" src="https://widget-static.eversports.io/loader.js" async defer></script>
    </div>
  </section>
  ```

### 5. Cross-Page-Anker-Links

- Anker auf Sektionen der Startseite: `index.html#angebote` etc. (`chrome.js` und der React-Mount-Effect korrigieren den Scroll-Offset für die fixierte Nav um –68 px).
- Anker innerhalb einer Subpage: `<section id="…">` + Link `#…`. Funktioniert via `scroll-margin-top:88px` aus `css/site.css`.

### 6. Landingpage-Pattern (für umfangreiche Themenseiten — Vorlage: `ausbildung.html`)

Wenn eine neue Seite mehr ist als nur Fließtext oder ein Buchungswidget — etwa eine Ausbildung, ein Workshop-Programm, ein Membership-Paket — folgt sie dieser Sektionsfolge. Sie ist in `css/site.css` ausgestylt und sollte **in dieser Reihenfolge** verwendet werden, damit der Hintergrund-Rhythmus stimmt:

| # | Sektion | Klasse | BG | Zweck |
|---|---|---|---|---|
| 1 | Hero | `.subpage__hero` (+ optionale Modifier) | creme | Eyebrow + H1 + Lead + 2 CTAs (`.btn--accent`, `.btn--outline`) |
| 2 | Argumente / USPs | `.ausbildung-besondere > .container > .usp-grid` | weiß | 3×3 Karten mit Nummer, H3, Kurzbeschreibung |
| 3 | Inhalte / Curriculum | `.ausbildung-inhalte > .container > .ausbildung-inhalte__inner` | creme | 2-spaltig: Text + `<ul class="ausbildung-inhalte__list">` mit `✓` |
| 4 | Termine / Aufbau | `.ausbildung-termine > .container > .termine-grid` | weiß | 2 Blöcke (z. B. Präsenz + Praxis), `.termine-list` für Datums-Reihen |
| 5 | Zielgruppe + Voraussetzung | `.ausbildung-zielgruppe` | off-white | 2-spaltig + abgesetzter `.ausbildung-voraussetzung`-Hinweis |
| 6 | Team | `.ausbildung-team > .container > .team-grid` | weiß | 2 Trainer:innen-Karten (Foto 4:5 + Text), optional `.team-credentials`-Reihe |
| 7 | Investition | `.ausbildung-investition > .container > .investition-grid` | creme | 1 dunkle Hauptkarte (`.investition-card--main`) + 2 Add-Ons (`--add`) |
| 8 | Bewerbung / Kontaktfunnel | `.ausbildung-bewerbung > .container > .bewerbung-inner` | weiß | Text + `.bewerbung-list` + `.bewerbung-cta` mit Mail+Tel-Button |
| 9 | **Testimonial-Karussell** | `.ausbildung-testimonials` | dunkel `#0d0d0d` | siehe Block unten |
| 10 | Final-CTA | `.ausbildung-final-cta` | brombeere `#59071d` | zentrierter Abschluss-Banner mit 2 CTAs (`.btn--accent` + `.btn--ghost`) |

**Testimonial-Karussell — Pflicht-Markup pro Karte:**

```html
<section class="ausbildung-testimonials" aria-labelledby="testimonials-head">
  <div class="container">
    <div class="section-head" id="testimonials-head">
      <span class="label">Stimmen</span>
      <h2>Headline mit <em>Italic.</em></h2>
    </div>
  </div>
  <div class="testimonial-carousel" role="list" aria-label="Erfahrungsberichte">
    <article class="testimonial-card" role="listitem">
      <svg class="testimonial-card__quote" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="…" /></svg>
      <p>Vollständiger Testimonial-Text — NICHT kürzen, Originalzitate respektieren.</p>
      <footer>
        <strong>Vorname</strong>
        <span>Rolle</span>
      </footer>
    </article>
    <!-- … weitere Karten -->
  </div>
</section>
```

- Wenn ein Foto vorhanden: `<footer class="testimonial-card__footer-with-img">` mit `<img>` (48 × 48 px, **quadratisch** — kein `border-radius`) + `<div><strong>…</strong><span>…</span></div>`.
- Karten-Breite ist fix `460px` desktop / `86%` mobile — Karussell scrollt horizontal mit `scroll-snap`.
- BG der Sektion ist Schwarz, Akzent-Farbe Himbeere `#b20e3b`. Italic-Em im Headline darf zur Auflockerung Creme `#f2dac2` annehmen. **Pink `#fc2cb8` bleibt strikt dem Logo-Doppelpunkt vorbehalten.**
- **Testimonials nie sinngemäß zusammenfassen oder kürzen.** Original-Wortlaut der Trainer:innen ist Markenkern und wirkt auch durch Länge authentisch.

**Wann nicht alle Sektionen verwenden:** Reicht ein dünneres Format (z. B. ein einzelner Workshop), kann auf Investitions- oder Termin-Block verzichtet werden — aber Hero + USPs + Team + Final-CTA sollten immer dabei sein.

---

## Bekannte Inkonsistenzen / offene Punkte

- **Bilddateinamen mit Leerzeichen** (`Eva-Pilates 01.jpg`, `Eva & Jelena.jpg`) — funktional, aber nicht ideal. Bei Gelegenheit umbenennen.
- **Aktive-Seite-Indikator im Nav** auf Subpages fehlt: keine optische Markierung, dass man z. B. gerade auf `buchung.html` ist. Falls ergänzt → `aria-current="page"` + Himbeere-Unterstrich (Konsistenz zur Start-Seiten-Logik via `IntersectionObserver`).
- **Buchungs-Studio-Seiten** haben kein Format-Karussell (nur die übergeordnete `buchung.html`). Bewusste Entscheidung — pro Studio nur ein Buchungstool, kein Marketing-Loop.
