# Static release acceptance

## Scope

OpenKrillion is delivered as ordinary static files. The game must work with no Worker, application server, API, database, cookie, analytics script, or reference-service connection. Build-time scripts may generate the files, but the published game is browser-only.

## Preserved game experience

- Existing game screen, styles, canvas ocean, scenery, sound, controls, and animations.
- Seven-round daily and practice flows, previews, timed answers, rejection/correction, scoring, descent, pause/resume, landing, results, review, sharing, settings, wardrobe, and local logbook.
- Reload resumes the local daily game and completed results.
- The supplied sample puzzle bank is used locally and is clearly identified; no claim is made that it is the original daily puzzle.
- Scores and feedback remain in local browser storage. No other players' scores are represented.

## Checks

- `npm test` — New York date behavior, matching, correction, local scoring, pause/resume, seven-round completion, and review.
- `npm run build` — prerenders pages and public text documents and creates assets.
- `npm run check` — verifies static output and confirms legacy Worker/API configuration is absent.
- `npm run dev` plus `npm run test:browser -- http://localhost:4173` — desktop and mobile game-flow acceptance in Chrome.

See `README.md` for setup and hosting. No deployment or publication is performed by these checks.
