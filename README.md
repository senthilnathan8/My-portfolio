# Senthilnathan S — Personal Portfolio

A hand-built, single-page portfolio. Terminal voice × glass panels × a living aurora
behind it. No framework, no build step — pure HTML, CSS, and vanilla JS. It deploys
as-is to any static host.

## Quick look

- **About / Resume / Work / Contact** — switched with command-style nav (`$ cd ./about`)
- **Boot sequence** on load, live clock in the status bar, fake build-log toasts
- **Aurora + glass** background, oversized marquee ticker, reduced-motion safe
- **Work cards** rendered from one data file — this is where you add real projects

## File layout

```
index.html          → the whole page (all your text/content lives here)
assets/css/style.css → design system: tokens, aurora, glass, responsive
assets/js/data.js    → PROJECTS array — add your real work here
assets/js/main.js    → boot, nav, clock, toasts, skills, card rendering
favicon.svg          → favicon
robots.txt           → minimal
```

## Add your projects (the main thing you'll edit)

Open `assets/js/data.js`. Each project is one object:

```js
{
  name: "Your first project",
  tag:  "web",          // chip → "web" | "app" | "tool"
  year: "2025",
  desc: "A short line about what it does.",
  code: "build( idea ) → shipping",   // flavor snippet
  href: "",             // repo / live URL — leave "" for now
  demo: ""              // live demo URL — leave "" for now
}
```

Cards render automatically. When `href`/`demo` are empty the card shows `— tbd`;
fill them in and links go live. Commit each real project separately so history
stays readable.

## Add your social links

Open `index.html`, search for `whoami --links`. That section has GitHub / X /
Instagram chips with `[fill url]` placeholders — paste your URLs and swap the
`chip--tbd` class (and the `href="#"`) for a real `chip` link.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

(Open via `file://` works too, but the dev server is closer to production.)

## Deploy — free, no account fuss

This site has **no build step** and only *relative* paths, so it works on any static
host at any domain or sub-path.

**GitHub Pages** (easiest, this repo already on GitHub)
1. Repo → *Settings* → *Pages*
2. *Source* → **Deploy from a branch** → `main` / root → *Save*
3. Live at `https://<user>.github.io/My-portfolio/`

**Netlify**
1. `netlify.com` → *Add new site* → *Import from Git* → choose this repo
2. Build command: *empty*. Publish directory: `/`. *Deploy*.

**Vercel**
1. `vercel.com` → *Add New Project* → import this GitHub repo
2. Framework preset: *Other* — no build command, output directory `/`.

**Cloudflare Pages**
1. *Workers & Pages* → *Create* → *Pages* → *Connect to Git* → this repo
2. Build: none, output `/` — *Save and Deploy*.

## Custom domain (when you buy one)

- Any of the hosts above: add the domain in Dashboard, then set the DNS record
  they give you (A record or CNAME) at your registrar. The site has no hard-coded
  base URL, so nothing in the repo needs to change.

## License

The code in this repository is original work. No license file is attached — this
is a personal portfolio. If you plan to share or fork the design, add a license
you're comfortable with before distributing it. (Note: this site replaced an old
template whose assets and license were removed; nothing from the template remains.)