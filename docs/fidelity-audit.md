# UI and gameplay fidelity notes

The static conversion keeps the existing game presentation and interaction code: `public/style.css`, the canvas ocean and seascape modules, Web Audio synthesis, and the game screen markup are retained. The browser engine replaces the former server calls while preserving the seven-round flow, New York date boundary, preview/answer timing, correction behavior, score tiers, pause/resume, results and local review.

Intentional behavioral differences required by static delivery:

- A bundled sample bank is used instead of fetching the original daily puzzle.
- All answer matching and scoring run in the browser.
- Progress is stored only in localStorage on this device.
- Population comparison and remote feedback collection are not available.
- The game does not use cookies, analytics, or any gameplay network calls.

Acceptance is the desktop and mobile browser audit documented in `docs/acceptance.md`. The conversion does not redesign the interface or replace the ocean, art, sound, or effects.
