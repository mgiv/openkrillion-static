# Task: massively expand the accepted-answer bank

You are working in `mgiv/openkrillion-static`, a static browser trivia game with no
server and no runtime dependencies. The game is only as good as its answer matching:
today it rejects common correct answers. Concretely, `p10` ("Name a bird") does not
accept **"blue tit"**, and several prompts have fewer than 24 accepted answers.

## Goal

Every one of the 42 prompts in `public/puzzle.mjs` should accept the answers a
competent player would actually type, with honest rarity, without changing how the
game matches, scores or times answers.

## Where things live

- `public/puzzle.mjs` — `BANK`, 42 prompts with stable ids `p1`…`p42`.
  - `q(id, text, { plankton: [...], schooler: [...], rare: [...], deepcut: [...], krillion: [...] })`
  - An item is `'Answer'` or `['Answer', ['alias', 'alias']]`.
  - `entry()`/`group()` turn items into `{ answer, tier, aliases? }`.
  - `q()` dedupes by `normalize(answer)`, promotes the rarer tier on a collision, and
    drops aliases that collide with any canonical answer.
- `public/rules.mjs` — `normalize()` (NFKD, lowercase, strip non-alphanumerics) and
  `matchAnswer()`: exact answer/alias match → unique inflection/phrase suggestion
  (`variationMatch`, always confirmed by the player) → Damerau-Levenshtein distance
  (allowance 0/1/2 by input length, also confirmed). `TIERS` maps tier → points.
- `tests/game.test.mjs` — bank invariants (42 prompts, ≥10 answers each, >650 total, no
  duplicate canonical or alias within a prompt) plus per-prompt matching assertions.
- `public/` and `docs/` are committed build artifacts. Run `npm run build` and commit
  them with the source change; CI runs `npm test`, `npm run build`, `npm run check`.

## What to change

1. Add accepted answers so **every prompt has at least 60** (aim for 70–100 where the
   category supports it). Suggested spread: plankton 20–30, schooler 20–30, rare
   15–25, deepcut 8–15, krillion 2–6.
2. Use aliases aggressively but honestly: plurals/singulars, British/American
   spellings, abbreviations and acronyms, the spelling people actually type, and
   given-name/full-name pairs. Follow the existing shape, e.g.
   `['Shaquille O’Neal', ['Shaq', 'Shaquille ONeal']]`.
3. Keep rarity honest. plankton = the first thing most people say; krillion = one
   defensible answer almost nobody would think of. Never demote a krillion to pad a
   count, and never promote an obscure answer into plankton.
4. Never add an answer that is wrong for the category, fictional unless the prompt
   asks for fiction, or so vague that accepting it would be unfair ("bird" is not an
   answer to "Name a bird").
5. Do **not** change prompt ids, prompt text, tier keys, scoring, timing, reroll, or
   the matching algorithm. This is a data task: if an answer is missing, add the
   answer.
6. Keep the file browser-friendly — it ships to every visitor. Report the file size
   before and after.

## Worked example — `p10`, "Name a bird"

Add at least: blue tit, great tit, coal tit, long-tailed tit, starling, house
sparrow, chaffinch, goldfinch, greenfinch, siskin, wren, dunnock, blackbird, song
thrush, mistle thrush, fieldfare, redwing, jay, jackdaw, rook, carrion crow, magpie,
raven, swift, swallow, house martin, sand martin, skylark, meadow pipit, pied
wagtail, kestrel, buzzard, red kite, sparrowhawk, peregrine falcon, merlin, barn owl,
tawny owl, little owl, mute swan, greylag goose, canada goose, mallard, teal,
shoveler, tufted duck, eider, shelduck, oystercatcher, curlew, lapwing, redshank,
snipe, egret, cormorant, gannet, guillemot, razorbill, kittiwake, common tern,
dipper, nuthatch, treecreeper, redpoll, crossbill, waxwing, nightjar, cuckoo, hoopoe.

Then repeat the exercise for the other 41 prompts (mammals, foods, weather, sports,
countries, languages, films, and so on). Where a category is genuinely narrow, prefer
40 excellent answers over padding with nonsense.

## Acceptance criteria (all must pass)

- `npm test` — and extend `tests/game.test.mjs`: assert the new per-prompt minimum
  (raise the `>= 10` loop and the `> 650` total), and add curated spot checks such as
  `matchAnswer('blue tit', questionById('p10').answers).answer === 'Blue tit'`.
- `npm run check`
- `npm run build`, then commit the regenerated `public/` and `docs/` files.
- Browser acceptance: `npm run dev` in one terminal, then
  `npm run test:browser -- http://localhost:4173` in another. Pass the base URL
  **without** a trailing slash — the dev server returns 404 for `//`. All checks must
  pass with zero console errors.
- `git diff --check` is clean.
- Report a table: prompt id, prompt text, accepted answers before → after, plus any
  candidate you deliberately rejected (ambiguous, wrong, or unfair) and why.

## Guardrails

- Do not loosen `matchAnswer()` to compensate for missing data — add the data.
- Do not create answers that would be reviewed as another prompt's canonical answer.
- Keep the tone of the existing content: no NSFW, slurs, or political framing.
