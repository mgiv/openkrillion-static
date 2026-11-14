# Expand the OpenKrillion question bank: deeper answers + new science/tech questions

You are working in `mgiv/openkrillion-static`, a static browser trivia game. You already
know the layout: `public/puzzle.mjs` holds `BANK`, `public/rules.mjs` holds matching and
scoring, `public/game.mjs` runs the dive, `src/` renders the HTML, and `public/` plus
`docs/` are committed build artifacts.

The bank is too thin — a correct answer like **"blue tit"** to `p10` "Name a bird" is
rejected — and it leans heavily on pop culture (superhero teams, Shakespeare, game
consoles, NBA MVPs). Two goals:

1. **Deepen every existing question.** There are 42 prompts and 1,425 accepted answers
   (min 13, max 59, average 34). Bring **every prompt to at least 70 accepted answers**,
   ideally 80–120 where the category allows, so a competent player almost never sees
   "no echo".
2. **Add new questions.** Grow the bank to **63 prompts** (21 new), leaning toward
   **science, technology, engineering and everyday-object knowledge** rather than film,
   TV, music or sport. They must be answerable by an average adult without looking
   anything up — "Name a phone manufacturer", "Name a tech company", "Name a unit of
   measurement" — not specialist trivia.

## Rules for both halves

- Data lives in `public/puzzle.mjs`: `q(id, text, { plankton: [...], schooler: [...],
  rare: [...], deepcut: [...], krillion: [...] })`, where an item is `'Answer'` or
  `['Answer', ['alias', 'alias']]`.
- Aliases are mandatory for plurals and singulars, British vs American spelling,
  abbreviations and acronyms, "the X" vs "X", the spelling people actually type, and
  common short forms. Follow existing entries, e.g.
  `['Shaquille O’Neal', ['Shaq', 'Shaquille ONeal']]`.
- No duplicate answer after `normalize()` inside one prompt. `q()` dedupes, but do not
  rely on it to fix sloppy data. A canonical answer never appears as another answer's
  alias.
- Keep rarity honest. plankton = what most people say first; schooler = common;
  rare = less common but real; deepcut = uncommon but fair; krillion = one obscure but
  defensible answer. Never pad a count by demoting a krillion or promoting an obscure
  answer into plankton.
- Never accept something vague ("bird" for "Name a bird"), wrong, or fictional unless
  the prompt asks for fiction.

## New questions: target the gap

Existing categories (do not duplicate them): potato prep, four-letter animals, NBA MVPs,
one-letter element symbols, station, countries ending in E, superhero teams, fruit,
vegetable, bird, mammal, marine animal, dog breed, instrument, board game, card game,
sport, planets and dwarf planets, moons, chemical elements, European countries, US
states, capital cities, flowers, trees, weather, languages, transport, breakfast,
dessert, soup, cheese, body part, household tool, kitchen appliance, fictional
superhero, mythological creature, Shakespeare plays, game consoles, countries starting
with B, pasta, pizza toppings.

Good directions for the new ones (pick about 21, spread across tiers, 40+ answers each
minimum): phone manufacturers · tech companies · programming languages · web browsers ·
operating systems · computer parts and peripherals · cable and connector types · file
formats · internet protocols · units of measurement · electrical units · SI units ·
types of energy · simple machines · engine types · metals · chemical compounds · gases ·
body organs · bones · vitamins · branches of science · engineering disciplines ·
constellations · star names · cloud types · rock types · measuring instruments ·
mathematical shapes.

Avoid: more movie/TV/music/sport categories, brand-new internet slang, and anything
that is really a specialist quiz.

## Code constraints you must respect

- `p1`–`p42` ids and prompt text stay exactly as they are; new questions get `p43`–`p63`.
- **Do not reorder the first seven prompts.** `DEMO = BANK.slice(0, 7)` is the
  deterministic `?test=1` fixture and `scripts/browser-audit.mjs` depends on `p1` being
  the potatoes prompt plus its canned answers for rounds 2–7. If you change that, update
  the audit in the same PR.
- **Keep `BANK.length` a multiple of 7.** `DAYS_PER_CYCLE = Math.floor(BANK.length / 7)`;
  at 63 that is a 9-day cycle visiting every question exactly once. At 65 the last two
  questions would never appear. 63 or 70 — not "about 65".
- Update `tests/game.test.mjs`: the `BANK.length`, the per-prompt minimum (raise from 10
  to 60+), the total (raise from 650 to over 4,000), and add curated spot checks
  (`matchAnswer('blue tit', questionById('p10').answers).answer === 'Blue tit'`, a phone
  brand for the new phones prompt, and so on).
- Do not touch scoring, timing, pause, reroll, or `matchAnswer()`/`normalize()`. If an
  answer is missing, add the answer.
- Update the README sentence "42 categories and more than 1,400 accepted answers".
- `npm run build` regenerates `public/`; commit that together with `docs/`. The bank
  ships to every visitor and is currently 28 KB — up to ~150 KB is fine, but report the
  new size.

## Verify before opening the PR

1. `npm ci && npm test` — all green.
2. `npm run check`.
3. `npm run build`, then commit the regenerated artifacts.
4. Browser acceptance: `npm run dev`, and in another terminal
   `npm run test:browser -- http://localhost:4173` — pass the URL **without** a trailing
   slash (the dev server 404s on `//`). All checks must pass with zero console errors.
5. `git diff --check` is clean.
6. Hand-check at least five plausible answers per prompt, including typos and plurals.

## Deliverable

One PR against `main` with a summary table: prompt id, text, answers before → after; the
new prompt list; the tier distribution; the new file size; and anything you deliberately
rejected as vague or unfair, with the reason. No unrelated changes.
