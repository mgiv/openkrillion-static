# Expand the OpenKrillion question bank — local run

Work **in this folder**: `C:\Users\mgiv\openkrillion-static` (Windows, PowerShell). It is
a git checkout on `main` with `node_modules/` already installed, Node 24, and Chrome at
`C:\Program Files\Google\Chrome\Application\chrome.exe`.

You are the engineer for this task: edit the files, run the checks, commit on a new
branch. Do **not** push, do **not** touch the `gh-pages` branch, and do not change any
deployment configuration.

## Goal

The bank is too thin — a correct answer like **"blue tit"** to `p10` "Name a bird" is
rejected — and it leans heavily on pop culture. Two goals:

1. **Deepen every existing question.** 42 prompts, 1,425 accepted answers, min 13, max
   59, average 34, 28 KB on disk. Bring **every prompt to at least 70 accepted
   answers**, ideally 80–120 where the category allows.
2. **Add new questions.** Grow the bank to **63 prompts** (21 new) leaning toward
   science, technology, engineering and everyday-object knowledge — not film, TV, music
   or sport. They must be answerable by an average adult without looking anything up:
   "Name a phone manufacturer", "Name a tech company", "Name a unit of measurement".

## Data model (read `public/puzzle.mjs` first)

- `q(id, text, { plankton:[...], schooler:[...], rare:[...], deepcut:[...], krillion:[...] })`
- An item is `'Answer'` or `['Answer', ['alias', 'alias']]`; `entry()`/`group()` build the
  objects, `q()` dedupes by `normalize(answer)` and drops colliding aliases.
- `public/rules.mjs` owns `normalize()`, `matchAnswer()` and `TIERS`. Do not change it.

## Rules for every entry

- Aliases are mandatory for plurals/singulars, British vs American spelling,
  abbreviations, "the X" vs "X", and the spelling people actually type. Copy the shape of
  `['Shaquille O'Neal', ['Shaq', 'Shaquille ONeal']]`.
- No duplicate after `normalize()` inside a prompt. `q()` dedupes silently — a sloppy
  duplicate will not error, so verify counts instead of trusting the edit.
- Rarity must stay honest: plankton = what most people say first; schooler = common;
  rare = less common but real; deepcut = uncommon but fair; krillion = one obscure but
  defensible answer. Never pad a count by demoting a krillion or promoting an obscure
  answer into plankton.
- Never accept something vague ("bird" for "Name a bird"), wrong, or fictional unless
  the prompt asks for fiction.
- No near-duplicates as separate answers ("rain"/"rainy") — put them in aliases.

## New questions to add (`p43`–`p63`)

Existing categories, which you must not duplicate: potato prep, four-letter animals, NBA
MVPs, one-letter element symbols, station, countries ending in E, superhero teams, fruit,
vegetable, bird, mammal, marine animal, dog breed, instrument, board game, card game,
sport, planets/dwarf planets, moons, chemical elements, European countries, US states,
capital cities, flowers, trees, weather, languages, transport, breakfast, dessert, soup,
cheese, body part, household tool, kitchen appliance, fictional superhero,
mythological creature, Shakespeare plays, game consoles, countries starting with B,
pasta, pizza toppings.

Directions to pick ~21 from, 40+ answers each: phone manufacturers · tech companies ·
programming languages · web browsers · operating systems · computer parts and
peripherals · cable and connector types · file formats · internet protocols · units of
measurement · electrical units · SI units · types of energy · simple machines · engine
types · metals · chemical compounds · gases · body organs · bones · vitamins · branches
of science · engineering disciplines · constellations · star names · cloud types · rock
types · measuring instruments · mathematical shapes.

Avoid: more movie/TV/music/sport categories, slang, and anything that is really a
specialist quiz.

## Hard constraints

- `p1`–`p42` ids and text stay exactly as they are; new questions are `p43`–`p63`.
- **Do not reorder the first seven prompts.** `DEMO = BANK.slice(0, 7)` is the
  deterministic `?test=1` fixture, and `scripts/browser-audit.mjs` depends on `p1` being
  the potatoes prompt plus its canned answers for rounds 2–7.
- **Keep `BANK.length` a multiple of 7** — `DAYS_PER_CYCLE = Math.floor(BANK.length / 7)`.
  At 63 that is a 9-day cycle that shows every question exactly once; at 65 the last two
  questions would never appear.
- Update `tests/game.test.mjs`: `BANK.length`, the per-prompt minimum (10 → 60+), the
  total (650 → over 4,000), plus spot checks such as
  `matchAnswer('blue tit', questionById('p10').answers).answer === 'Blue tit'`.
- Update the README sentence "42 categories and more than 1,400 accepted answers".
- Keep the existing formatting (two-space indent, trailing commas). Do not reformat or
  reorder unrelated lines — the diff must stay reviewable.

## Workflow — batch it and verify constantly

1. `git switch -c expand-bank`
2. Baseline, and keep these numbers in front of you:

   ```
   npm test
   npm run check
   node -e "import('./public/puzzle.mjs').then(({BANK}) => { const c = BANK.map(p => p.answers.length); console.log('prompts', BANK.length, 'answers', c.reduce((a,b)=>a+b,0), 'min', Math.min(...c), 'max', Math.max(...c)); })"
   ```

3. Expand existing answers in batches of about six prompts. After each batch run
   `npm test` (about one second) and the count command. Spot-check as you go:

   ```
   node -e "Promise.all([import('./public/puzzle.mjs'), import('./public/rules.mjs')]).then(([p, r]) => { const q = p.questionById('p10').answers; for (const a of ['blue tit','great tit','goldfinch','blue-tit']) console.log(a, '->', r.matchAnswer(a, q) && r.matchAnswer(a, q).answer); })"
   ```

4. Add the new prompts in batches of about five, ids `p43`–`p63` in order.
5. Raise the test floors and add curated spot checks for representative old and new
   prompts.
6. Update the README line and hit every other place that states the bank size.
7. `npm run build` — this regenerates `public/` and `docs/`; commit those artifacts with
   the source. `public/assets/og.png` may differ because of the local sharp build;
   including it is fine.
8. Browser acceptance — the server must be running in another shell:

   ```
   npm run dev
   npm run test:browser -- http://localhost:4173
   ```

   Pass the base URL **without a trailing slash**: the dev server returns 404 for `//`.
   If the port is busy, start with `$env:PORT=4174; npm run dev` and audit `4174`.
9. Commit in a few logical commits on `expand-bank` (e.g. answers, new prompts, tests,
   docs/build). Do not push.

## Definition of done

- 63 prompts, every prompt ≥70 accepted answers, more than 4,000 in total, tier spread
  still plausible (plankton largest, krillion smallest).
- `npm test`, `npm run check`, `npm run build` and the browser audit all pass with zero
  console errors.
- `git diff --check` clean; `git status` shows only `public/puzzle.mjs`,
  `tests/game.test.mjs`, `README.md`, the regenerated `public/`/`docs/` files, and
  nothing else.
- Final message contains a table: prompt id, text, answers before → after; the new
  prompts; the tier distribution; the new file size; and anything you deliberately
  rejected as vague, wrong or unfair, with the reason.

If a category genuinely cannot reach 70 fair answers, say so in the report instead of
padding it with nonsense.
