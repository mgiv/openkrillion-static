# Hosting OpenKrillion on a games site — integration brief

## What this is

A static browser trivia game. Plain HTML/CSS/ES modules, no server, no API, no database,
no cookies, no analytics, no third-party runtime. 38 files, 0.5 MB total. Daily dive:
7 prompts, 25 seconds each, 63 questions with 6,405 accepted answers.

MIT licensed. `LICENSE` and `THIRD_PARTY_NOTICES.md` live in the repo root (not in
`public/`); the shipped art and the vendored VT323 font are covered there. Copy both if
the games site publishes notices.

## Source and build

- Repo: `https://github.com/mgiv/openkrillion-static` (fork of `VulcanEon/openkrillion.com-service`).
- Build: Node 22+, `npm ci && npm run build` → writes `public/`. Both `public/` and
  `docs/` are committed build artifacts, so a fresh checkout already contains the site.
- Ready-to-serve copies:
  - `gh-pages` branch of the same repo — already URL-rewritten for
    `/openkrillion-static/`.
  - Live preview: `https://mgiv.github.io/openkrillion-static/`.
- `public/` is the document root:

```
index.html            app.mjs      game.mjs    rules.mjs   puzzle.mjs
style.css             ocean.mjs    seascape.mjs presentation.mjs sound.mjs
assets/               privacy/     about/      zh/
llms.txt  llms-full.txt  pricing.md  models.md  robots.txt  sitemap.xml
```

## The critical gotcha: root-absolute URLs

The build emits **root-absolute** references: `/style.css`, `/assets/krill.svg`,
`/app.mjs`, `/privacy`, `/about`, `/llms.txt`, `/?lang=en`, `/zh/`. There are **121** of
them across **8 files**: the four HTML pages, `app.mjs`, `presentation.mjs`, `game.mjs`
and `style.css`.

- At a domain root they work unchanged.
- Under a subpath such as `/static/OpenKrillion/` every one must be prefixed, or the page
  404s its own CSS and JS and never boots.

**Rewrite rule:** prefix a `/` only when it starts a quoted string or an HTML attribute
value. Anchor on `"`, `'` or a backtick — **never on `(` or `=`**. JS regex literals such
as `.replace(/[&<>"']/g, ...)` and `.replace(/[^a-z0-9]/g, '')` sit behind `(`, and
rewriting them produces `SyntaxError: Unexpected token` — the game then dies on load
(this exact mistake broke `app.mjs` and `rules.mjs` during a first attempt).

```js
// node prefix.mjs public /static/OpenKrillion
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const [dir, prefixArg] = process.argv.slice(2);
const prefix = prefixArg.replace(/\/+$/, '');
const re = /(["'`])\/(?!\/)/g;

for (const name of await readdir(dir, { recursive: true })) {
  const file = join(dir, name);
  if (!['.html', '.mjs', '.js', '.css'].includes(extname(file))) continue;
  const text = await readFile(file, 'utf8');
  const out = text.replace(re, (_m, quote) => quote + prefix + '/');
  if (out !== text) { await writeFile(file, out); console.log('rewrote', file); }
}
```

Expected result: 121 replacements, 8 files rewritten. Verify:

- no remaining `href="/` or `src="/` in any HTML page;
- `node --check` passes on every `.mjs`;
- the page boots (console clean, ocean animates).

`.txt`, `.md` files carry no absolute references; `robots.txt` and `sitemap.xml` use full
`https://openkrillion.com` URLs.

## Serving requirements

- **`.mjs` must be served as `text/javascript`.** Module scripts fail on
  `application/octet-stream`. Cloudflare Pages, GitHub Pages and Netlify do this
  correctly; bare nginx/Apache need `AddType text/javascript .mjs`.
- **Directory indexes** — `/privacy/`, `/about/` and `/zh/` are directories with
  `index.html`. Internal links use `/privacy` and `/about` without the trailing slash, so
  the host must resolve those (Cloudflare Pages does; otherwise add a redirect/rewrite).
- No SPA fallback, no rewrites, no service worker, no build step at runtime.
- **Cache:** filenames are not content-hashed (`style.css`, `app.mjs`, `puzzle.mjs`), so
  use a short `max-age` or `no-cache` for the game folder, or bust with `?v=` on update.
- **Do not copy `robots.txt` or `sitemap.xml` to the games-site root.** They are written
  for `openkrillion.com`; at the origin root they would override the site's own
  `robots.txt`. Skip them, or leave them inside the game subfolder where they are inert.

## Metadata a mirror should probably change

- `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image` and the JSON-LD `url`
  all point at `https://openkrillion.com`. Left alone, the mirror is treated as a
  duplicate (good for a mirror, wrong if you want it indexed). Replace with the games-site
  URL to index it.
- `shareText()` in `rules.mjs` appends `https://openkrillion.com` to shared results, and
  the "Share link" setting adds the same host. Point those at the games site if share
  links should resolve there.
- The guide and footer link out to `github.com`, `krillion.io`, and AI icons
  (`chatgpt.com`, `claude.ai`, `www.perplexity.ai`, `www.google.com`, `grok.com`) that
  open a prefilled question in a new tab with `rel="noopener noreferrer nofollow"`.
  Nothing is sent until the player clicks. Keep or strip per policy; they are ordinary
  links, so no CSP `connect-src` change is needed.

## Storage and privacy

- All state is `localStorage`, keys prefixed `ok:` — `ok:settings`, `ok:history`,
  `ok:run`, `ok:run-state:daily`, `ok:run-state:practice`, `ok:draft:<runId>:<round>`,
  `ok:feedback`, `ok:completed-event:*`, `ok:last-run-mode`. Safe on a shared origin and
  namespaced away from other games, but it is per-origin and never syncs.
- **No cookies. No runtime network requests.** Verified: zero `fetch`/`XMLHttpRequest`/
  `WebSocket` in the shipped JS (the only `WebSocket` string is an accepted answer in the
  protocol question).
- No accounts, no checkout, no ads, no analytics, no external font CDN (the VT323 woff2 is
  vendored in `assets/`).

## Integration options

**A. Copy the files (recommended for a games site)**

1. Build, or take the `gh-pages` copy.
2. Copy `public/` to `static/OpenKrillion/`.
3. Rewrite the 121 URLs to `/static/OpenKrillion/...` with the script above.
4. Catalogue entry: `url: /static/OpenKrillion/index.html`,
   `image: static/OpenKrillion/i.webp`, `categories: ["puzzle"]`, `badge: "new"`.
5. Icon: convert `assets/icon.png` (256×256) to `i.webp` for the catalogue card.
   Other icons available: `favicon.png` (32), `apple-touch-icon.png` (180),
   `og.png` (1200×630).
6. Bump `SITE_VERSION` in the four places (per the site's AGENTS.md) so cached visitors
   see the new card.
7. Run `icon-changer.py` (page title + favicon). It has a known bug where it can delete
   `</head>` on pages that carry the branded-loader block; check the diff.
8. Run `mobile-touch-fix.py` if the site normally does — but re-check on a touch device
   that the answer input, the scoreboard and the DIVE button still behave.
9. **Do not run `branded-loader.py` for this game.** It injects a full-screen branded
   splash over the page and waits for load/cover detection. OpenKrillion has its own
   intro screen and a full-bleed canvas, so the splash would cover "BEGIN DESCENT" without
   a meaningful progress signal.

**B. iframe the preview URL** — zero maintenance, but saves live on `github.io`, it
depends on GitHub Pages, and the game wants the full viewport height (`height: 100%`).

**C. Own subdomain** (`krillion.example.com`) — paths work with no rewriting.

**D. Keep the existing GitHub Pages** — `https://mgiv.github.io/openkrillion-static/`.

## Daily behaviour

- The daily puzzle is derived from the **ET (America/New_York) date** and resets at
  midnight ET, not the visitor's local midnight. 63 prompts over a 9-day rotation,
  deterministic and identical for everyone that day.
- Practice is unlimited; there is one question reroll per dive.
- An in-progress dive resumes after a reload (localStorage).

## Accessibility and UX notes

- Honours `prefers-reduced-motion` (disables the radar sweep and other animation).
- Settings include low-power mode, colourblind mode, answer-correction preview and
  share-link toggle.
- Keyboard: `F` toggles fullscreen, `Escape` closes the guide/menu.
- A Chinese build lives at `/zh/`.
- Sound is synthesised with WebAudio and only starts on a user gesture.
- No pointer lock, no mobile-specific hacks, no autoplay surprises.

## Sizes

| File | Size |
|---|---|
| `puzzle.mjs` (the bank) | 102 KB |
| `style.css` | 45 KB |
| `zh/index.html` | 35 KB |
| `index.html` | 32 KB |
| `app.mjs` | 30 KB |
| `assets/` (sprites, icons, font) | ~0.25 MB |
| **total** | **~0.5 MB, 38 files** |

No chunking or 25 MB splitting needed.

## Acceptance checks after integration

1. `GET .../static/OpenKrillion/` → 200 HTML; `style.css`, `app.mjs`,
   `assets/krill.svg` → 200 with `text/css`, `text/javascript`, `image/svg+xml`.
2. Page boots: ocean renders, "BEGIN DESCENT" works, one round is completable,
   `window.render_game_to_text` exists.
3. Console has zero errors and zero 404s.
4. `/privacy` and `/about` resolve (trailing-slash handling).
5. Spot-check the bank actually shipped: `blue tit` (bird), `diesel` (engine),
   `the sun` (star) are all accepted.
6. Mobile 390×844: no horizontal overflow, the answer field is usable (below 520 px the
   reroll collapses to an icon).
7. If the site has its own analytics injected globally, confirm it is acceptable that it
   also runs on this page — the game itself adds none.

## Known caveats

- Rarity tiers are schooler-heavy after the answer expansion (44% of the bank), so scores
  skew high and the rarity chart is flatter than the original game.
- Eight prompts are genuine closed sets below 70 answers (14 one-letter element symbols,
  50 US states, 17 countries starting with B, 40 Shakespeare plays, …).
- `canonical`, `og:` tags and share text still point at `openkrillion.com`.

## Repo commands

```
npm ci && npm test        # 10 tests: bank shape, rotation, matching, reroll, plunge camera
npm run check             # static audit
npm run build             # regenerate public/ and docs/
npm run dev               # serve public/ on :4173
npm run test:browser -- http://localhost:4173   # full acceptance; NO trailing slash
```

The browser audit drives Playwright with the installed Chrome and covers the desktop
7-round flow, reroll, results/review/clipboard, reload persistence, mobile layout, the
Chinese prompts and the keyboard-height layout.
