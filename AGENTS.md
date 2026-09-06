# AGENTS.md — Senthilnathan S Portfolio

## What this is

Static personal portfolio site. Pure HTML + CSS + vanilla JS — no build step, no framework, no dependencies, no `package.json`. Deploys as-is to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

**Do not add a build tool, bundler, or framework.** The simplicity is intentional.

## Commands

```sh
python3 -m http.server 8000   # local dev server
# open http://localhost:8000
```

No build, test, or lint commands exist. If you add tooling, discuss with the owner first.

## File layout

```
index.html               All page content (About, Resume, Work, Contact sections)
assets/css/style.css     Design system: CSS tokens, aurora blobs, glass, responsive
assets/js/data.js        PROJECTS array — add real work here, one object per card
assets/js/main.js        Boot sequence, nav, clock, toasts, skills fill, card rendering
favicon.svg              SVG favicon
robots.txt               Minimal allow-all
```

## Architecture

Single-page app using CSS class toggling (`is-active`) to switch between four panels: about, resume, work, contact. No routing, no history API.

**Control flow:**
1. Page loads → `main.js` runs `runBoot()` — types boot sequence, adds `is-ready` class when done
2. Nav buttons have `data-tab` attributes matching panel `data-page` values
3. Clicking a nav button calls `activate(page)` which toggles `is-active` on panels
4. Work cards are rendered from `PROJECTS` array in `data.js` via `renderWork()`

**Data flow:**
- All personal content (bio, resume, skills) is hardcoded in `index.html`
- Project cards are the only data-driven content — sourced from `assets/js/data.js`

## Adding projects

Edit `assets/js/data.js`. Each project is one object in the `PROJECTS` array:

```js
{
  name: "Project Name",
  tag: "web",           // "web" | "app" | "tool"
  year: "2025",
  desc: "Short description.",
  code: "npm run dev",  // flavor snippet, shown as code
  href: "",             // repo/live URL — empty shows "tbd"
  demo: ""              // demo URL — empty shows "tbd"
}
```

Cards auto-render. Empty `href`/`demo` show "tbd" links.

## Code conventions

- **CSS:** BEM-like naming (`block__element modifier`), custom properties on `:root` (see `style.css:6-34`), green accent via `--green` / `.gr` utility class
- **JS:** Single IIFE in `main.js`, `"use strict"`, no modules/imports, `const` over `let`, arrow functions for callbacks. Helper functions: `el()`, `slug()`, `linkCell()`
- **HTML:** `data-*` attributes for JS hooks, `aria-*` for accessibility, `aria-hidden="true"` on decorative elements
- **Reduced motion:** All animations check `prefers-reduced-motion` via `const reduced` at `main.js:9` — respect this pattern if adding animations

## Design tokens (style.css)

Key CSS custom properties: `--bg`, `--glass`, `--stroke`, `--txt`, `--dim`, `--green`, `--cyan`, `--violet`, `--amber`, `--sans` (Inter), `--mono` (JetBrains Mono), `--disp` (Space Grotesk). The `--ease` curve is `cubic-bezier(.22, 1, .36, 1)`.

## Gotchas

- **No build step.** Every change is live immediately. All paths are relative.
- **`data.js` loads before `main.js`** (order in `index.html:263-264`). `PROJECTS` must be a global `const` — not a module export.
- **Boot sequence timing** is computed in `main.js:24-25` (`BOOT_TYPEMS`, `BOOT_LINE`, `BOOT_DONE`). Changing the `BOOT` array at `main.js:12-18` may require recalculating the progress bar total.
- **Skills bars** are hardcoded in `index.html:158-162` with `--lv` CSS custom property on `<i>` elements. Not data-driven.
- **Glass/backdrop-filter** may not render in some older browsers. The site degrades gracefully (solid backgrounds).
- **Contact info** (email, phone, LinkedIn) is in `index.html:196-221`. Social icons are inline SVGs.
