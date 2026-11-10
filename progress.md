# Project status

OpenKrillion has been converted from a Worker/API/database-backed application into a static browser game. The client now uses an embedded sample puzzle bank, browser-side timing/matching/scoring, and localStorage persistence. Pre-rendered HTML, text documents, and assets are emitted by `npm run build` into `public/`.

The game UI, style sheet, canvas ocean, scene animations, and synthesized audio remain in place. Static privacy and capability text describes local-only play. Worker routes, database migrations, reference synchronization, and deployment configuration have been removed.

Before any deployment, run `npm test`, `npm run build`, and the browser acceptance game flow as specified in `AGENTS.md`.
