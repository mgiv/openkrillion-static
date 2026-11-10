# OpenKrillion Static

OpenKrillion is an independent, open-source Krillion-inspired browser game. This repository builds a **static website**: HTML, CSS, JavaScript modules, puzzle data, and media files. The game has no Worker, server API, database, account, cookie, analytics, or required third-party runtime service.

## Run locally

Requirements: Node.js 22+ and npm.

```sh
npm ci
npm run build
npm run dev
```

Open `http://localhost:4173`. The development command only serves files from `public/`; it has no application routes or persistence. Any static file host can serve the built `public/` directory.

## Game and local data

The original interface and flow are kept: the animated ocean, seven prompts, preview and answer timers, answer rejection/correction, rarity scoring, descent, pause/resume, synthesized sound, results, answer review, sharing, practice, settings, wardrobe, and logbook.

`public/game.mjs` implements scoring and timing in the browser. `public/puzzle.mjs` contains an independently assembled bank of 42 categories and more than 1,400 accepted answers used by daily and practice play. The bank is intentionally visible and self-contained; it is not synchronized with krillion.io. Scores are not compared with other players. Settings, drafts, in-progress games, feedback entries, and history stay in this browser's local storage and do not sync across devices. The game does not set cookies or send game data over the network.

The UI layout, styles, canvas ocean, scenery, sound synthesis, and presentation assets remain in `public/`. The build-time HTML and documentation renderers are under `src/`; they are not deployed as runtime services.

## Static build outputs

`npm run build` writes the site into `public/`, including:

- `/`, `/privacy`, `/about`, and `/zh/`
- `/llms.txt`, `/llms-full.txt`, `/pricing.md`, and `/models.md`
- `/robots.txt`, `/sitemap.xml`, styles, JavaScript modules, fonts, and image assets

Host `public/` as the document root. Configure the static host to serve directory index files for `/privacy/` and `/about/`; no rewrite-to-application fallback is needed.

## Validation

```sh
npm test
npm run build
npm run check
npm run dev
# in another terminal, with Chrome installed:
npm run test:browser -- http://localhost:4173
```

The browser acceptance audit covers the game flow, answer correction/rejection, pause/resume, seven rounds, results/review/share, reload persistence, mobile layout, and the Chinese guide prompt. Optional audio, art, and mobile audits are available as `npm run test:audio`, `npm run test:art`, and `npm run test:mobile`.

## License

Application code is MIT-licensed. See `THIRD_PARTY_NOTICES.md` for bundled third-party assets and licenses. OpenKrillion is an independent project and is not affiliated with krillion.io.
