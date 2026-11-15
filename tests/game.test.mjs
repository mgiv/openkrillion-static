import test from 'node:test';
import assert from 'node:assert/strict';
import { BANK, DEMO, questionById } from '../public/puzzle.mjs';
import { etDate, resetAt, matchAnswer, normalize, ROUND_MS, PREVIEW_MS } from '../public/rules.mjs';
import { puzzleForDate, createGame, submitAnswer, nextRound, rerollQuestion, setPaused, reviewFor, isValidGame, scoreOf } from '../public/game.mjs';
import { Ocean } from '../public/ocean.mjs';

const addDays = (date, days) => {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
};

// Eight prompts name a closed set: the answer space is every member of a fixed
// list, so seventy fair answers do not exist. Everything else must reach seventy.
const CLOSED_SET = { p3:37, p4:14, p6:23, p18:32, p21:49, p22:50, p38:40, p40:17 };

test('New York daily date and reset handle both daylight-saving transitions', () => {
  assert.equal(etDate(Date.parse('2026-10-17T03:59:59Z')), '2026-10-16');
  assert.equal(etDate(Date.parse('2026-10-17T04:00:00Z')), '2026-10-17');
  assert.equal(new Date(resetAt('2026-10-17')).toISOString(), '2026-10-18T04:00:00.000Z');
  assert.equal(new Date(resetAt('2026-12-17')).toISOString(), '2026-12-18T05:00:00.000Z');
});

test('the question bank has 63 categories, broad answer coverage, and no duplicate answers within a prompt', () => {
  assert.equal(BANK.length, 63);
  assert.equal(DEMO.prompts.length, 7);
  assert.ok(BANK.reduce((sum, prompt) => sum + prompt.answers.length, 0) > 4_000);
  assert.deepEqual(BANK.filter(prompt => prompt.answers.length < 70).map(prompt => prompt.id), Object.keys(CLOSED_SET));
  for (const prompt of BANK) {
    const floor = CLOSED_SET[prompt.id] ?? 70;
    assert.ok(prompt.answers.length >= floor, `${prompt.id} should have at least ${floor} accepted answers`);
    const keys = new Set();
    for (const answer of prompt.answers) {
      const canonical = normalize(answer.answer);
      assert.ok(!keys.has(canonical), `duplicate answer in ${prompt.id}: ${answer.answer}`);
      keys.add(canonical);
      for (const alias of answer.aliases || []) {
        const key = normalize(alias);
        assert.ok(!keys.has(key), `duplicate alias in ${prompt.id}: ${alias}`);
        keys.add(key);
      }
    }
  }
});

test('prompt ids stay sequential and the bank holds a whole number of dives', () => {
  assert.deepEqual(BANK.map(prompt => prompt.id), Array.from({ length:63 }, (_, index) => `p${index + 1}`));
  assert.equal(BANK.length % 7, 0);
  assert.deepEqual(BANK.slice(0, 7).map(prompt => prompt.id), ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']);
  assert.equal(DEMO.prompts[0].text, 'Name a way to prepare potatoes');
  assert.equal(DEMO.prompts[0].answers.length, BANK[0].answers.length);
});

test('daily questions rotate through the whole bank without repeats in a nine-day cycle', () => {
  const puzzles = Array.from({ length:9 }, (_, i) => puzzleForDate(addDays('2026-07-16', i)));
  const ids = puzzles.flatMap(puzzle => puzzle.prompts.map(prompt => prompt.id));
  assert.equal(ids.length, 63);
  assert.equal(new Set(ids).size, 63);
  assert.notDeepEqual(puzzleForDate('2026-07-16').prompts.map(p => p.id), puzzleForDate('2026-07-25').prompts.map(p => p.id));
});

test('answer matching accepts expanded preparation methods and preserves correction behavior', () => {
  assert.equal(normalize('São Tomé & Príncipe'), 'saotomeandprincipe');
  const potatoes = questionById('p1').answers;
  assert.equal(matchAnswer('mashed', potatoes).answer, 'Mashed potatoes');
  assert.equal(matchAnswer('peel', potatoes).answer, 'Peeled potatoes');
  assert.equal(matchAnswer('peel', potatoes).correction, true);
  assert.equal(matchAnswer('boil', potatoes).answer, 'Boiled potatoes');
  assert.equal(matchAnswer('boil', potatoes).correction, true);
  assert.equal(matchAnswer('bake', potatoes).answer, 'Baked potato');
  assert.equal(matchAnswer('bake', potatoes).correction, true);
  const genericForms = [{ answer:'Baked potatoes', tier:'plankton' }, { answer:'Boiled potatoes', tier:'schooler' }];
  assert.equal(matchAnswer('bake', genericForms).answer, 'Baked potatoes');
  assert.equal(matchAnswer('bake', genericForms).correction, true);
  assert.equal(matchAnswer('boiling', genericForms).answer, 'Boiled potatoes');
  assert.equal(matchAnswer('baked', genericForms).answer, 'Baked potatoes');
  const weather = questionById('p26').answers;
  assert.equal(matchAnswer('storm', weather).answer, 'Storm');
  assert.equal(matchAnswer('stormy', weather).correction, true);
  assert.equal(matchAnswer('clear', weather).answer, 'Clear');
  assert.equal(matchAnswer('clrea', weather).answer, 'Clear');
  assert.equal(matchAnswer('clrea', weather).correction, true);
  const typo = matchAnswer('bakd potato', potatoes);
  assert.equal(typo.answer, 'Baked potato');
  assert.equal(typo.correction, true);
  assert.equal(matchAnswer('Yttrum', questionById('p4').answers).correction, true);
  assert.equal(matchAnswer('zzzzzzzzzz', potatoes), null);
});

test('deepened and new prompts accept the answers players actually type', () => {
  const birds = questionById('p10').answers;
  for (const input of ['blue tit', 'Blue Tit', 'blue-tit']) assert.equal(matchAnswer(input, birds).answer, 'Blue tit');
  assert.equal(matchAnswer('great tit', birds).answer, 'Great tit');
  assert.equal(matchAnswer('goldfinch', birds).answer, 'Goldfinch');
  const plant = questionById('p9').answers;
  assert.equal(matchAnswer('eggplant', plant).answer, 'Aubergine');
  assert.equal(matchAnswer('courgette', plant).answer, 'Zucchini');
  assert.equal(matchAnswer('beet', plant).answer, 'Beetroot');
  assert.equal(matchAnswer('peppers', plant).answer, 'Pepper');
  const spots = [
    ['p2', 'lion', 'Lion'], ['p3', 'jokic', 'Nikola Jokić'], ['p5', 'weather station', 'Weather station'],
    ['p12', 'mussel', 'Mussel'], ['p14', 'harpsichord', 'Harpsichord'], ['p20', 'osmium', 'Osmium'],
    ['p22', 'rhode island', 'Rhode Island'], ['p23', 'gitega', 'Gitega'], ['p33', 'clavicle', 'Collarbone'],
    ['p35', 'air fryer', 'Air fryer'], ['p38', 'henry v', 'Henry V'], ['p41', 'paccheri', 'Paccheri'],
    ['p43', 'samsung', 'Samsung'], ['p44', 'nvidia', 'Nvidia'], ['p45', 'python', 'Python'],
    ['p46', 'firefox', 'Firefox'], ['p47', 'linux', 'Linux'], ['p48', 'gpu', 'GPU'], ['p49', 'pdf', 'PDF'],
    ['p50', 'https', 'HTTPS'], ['p51', 'kilogram', 'Kilogram'], ['p52', 'water', 'Water'],
    ['p53', 'steel', 'Steel'], ['p54', 'triangle', 'Triangle'], ['p55', 'thermometer', 'Thermometer'],
    ['p56', 'orion', 'Orion'], ['p57', 'sirius', 'Sirius'], ['p58', 'granite', 'Granite'],
    ['p59', 'physics', 'Physics'], ['p60', 'civil engineering', 'Civil engineering'], ['p61', 'femur', 'Femur'],
    ['p62', 'diesel engine', 'Diesel engine'], ['p63', 'oxygen', 'Oxygen'],
    ['p62', 'diesel', 'Diesel engine'], ['p62', 'steam', 'Steam engine'], ['p62', 'v8', 'V8 engine'],
    ['p48', 'hdd', 'Hard drive'], ['p56', 'big dipper', 'Ursa Major'], ['p56', 'southern cross', 'Crux'],
    ['p57', 'north star', 'Polaris'], ['p57', 'dog star', 'Sirius'], ['p57', 'the sun', 'Sun'],
  ];
  for (const [id, input, expected] of spots) {
    const result = matchAnswer(input, questionById(id).answers);
    assert.ok(result, `${id} should accept ${input}`);
    assert.equal(result.answer, expected, `${id} should map ${input} to ${expected}`);
  }
  const tiers = {};
  for (const prompt of BANK) for (const answer of prompt.answers) tiers[answer.tier] = (tiers[answer.tier] || 0) + 1;
  assert.equal(Object.keys(tiers).length, 5, 'no answer may use an unknown tier');
  assert.equal(tiers.krillion, BANK.length, 'every prompt keeps exactly one krillion answer');
  assert.ok(tiers.plankton > tiers.deepcut && tiers.deepcut > 0);
});

test('client game maintains preview, corrections, scoring, pause and resumable state', () => {
  const start = 1_800_000_000_000;
  let game = createGame({ mode:'daily', date:'2026-10-17', now:start, seed:'audit' });
  assert.equal(game.roundStart, start + PREVIEW_MS);
  assert.equal(game.round, 0);
  assert.ok(isValidGame(game));
  assert.throws(() => submitAnswer(game, { answer:'Mashed potatoes', round:0, now:start + 1000 }), /not opened yet/);
  game = setPaused(game, true, start + 3500);
  assert.ok(game.pausedAt);
  assert.throws(() => submitAnswer(game, { answer:'Mashed potatoes', round:0, now:start + 4000 }), /Close the menu/);
  const pausedAt = game.pausedAt;
  game = setPaused(game, false, pausedAt + 5000);
  assert.equal(game.roundStart, start + PREVIEW_MS + 5000);
  const correction = submitAnswer(game, { answer:'mash', round:0, now:game.roundStart + 200 });
  assert.equal(correction.correction, 'Mashed potatoes');
  const scored = submitAnswer(game, { answer:'mash', round:0, confirm:true, now:game.roundStart + 300 });
  assert.equal(scored.result.answer, 'Mashed potatoes');
  assert.equal(scored.result.score, 10);
  assert.equal(scored.state.round, 1);
  assert.equal(scoreOf(scored.state), 10);
});

test('one reroll replaces only the active prompt, preserves the timer, and cannot be reused', () => {
  const start = 1_800_000_000_000;
  let game = createGame({ mode:'daily', date:'2026-10-17', now:start, seed:'audit' });
  const originalIds = game.prompts.map(prompt => prompt.id);
  const deadline = game.roundStart;
  game = rerollQuestion(game, { replacementId:'p8', now:start + 4000 });
  assert.equal(game.prompts[0].id, 'p8');
  assert.equal(game.round, 0);
  assert.equal(game.roundStart, deadline);
  assert.equal(game.rerollsUsed, true);
  assert.equal(new Set(game.prompts.map(prompt => prompt.id)).size, 7);
  assert.throws(() => rerollQuestion(game, { replacementId:'p9', now:start + 5000 }), /already been used/);
  assert.throws(() => rerollQuestion(createGame({ mode:'practice', date:'2026-10-17', now:start, seed:'audit' }), { now:start + 29_000 }), /window has closed/);
  assert.ok(!originalIds.includes('p8'));
});

test('plunge camera starts exactly where the scene was and tracks smoothly to the score depth', () => {
  const ocean = Object.create(Ocean.prototype);
  ocean.cameraDepth = 245;
  ocean.cameraTarget = 245;
  ocean.roundIndex = 2;
  ocean.fx = null;
  const result = { tier:'rare', score:60 };
  ocean.drop(100, result, 0);
  assert.equal(ocean.cameraDepth, 245, 'no visual jump at plunge start');
  ocean.drop(100, result, .5);
  assert.ok(ocean.cameraDepth > 245 && ocean.cameraDepth < 730);
  ocean.drop(100, result, 1);
  assert.equal(ocean.cameraDepth, 730);
});

test('daily and practice games retain their selected questions through all seven answers and review', () => {
  const start = 1_800_000_000_000;
  let game = createGame({ mode:'practice', date:'2026-10-17', now:start });
  assert.equal(new Set(game.prompts.map(prompt => prompt.id)).size, 7);
  assert.throws(() => reviewFor(game), /Finish your dive/);
  for (let round=0; round<7; round++) {
    const opening = game.roundStart;
    const prompt = questionById(game.prompts[round].id);
    const answer = prompt.answers.find(item => item.tier === 'krillion')?.answer || prompt.answers[0].answer;
    const result = submitAnswer(game, { answer, round, now:opening + 100, confirm:true });
    game = result.state;
    assert.ok(result.result.score > 0);
    if (round < 6) game = nextRound(game, opening + ROUND_MS + 100);
  }
  assert.equal(game.completed, true);
  assert.equal(game.round, 7);
  assert.ok(scoreOf(game) > 0);
  const review = reviewFor(game);
  assert.deepEqual(review.prompts.map(p => p.id), game.prompts.map(p => p.id));
  assert.equal(review.population, 0);
  assert.equal(review.betterThan, null);
  assert.equal(review.dist.length, 71);
});
