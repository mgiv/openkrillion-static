import test from 'node:test';
import assert from 'node:assert/strict';
import { BANK, DEMO, questionById } from '../public/puzzle.mjs';
import { etDate, resetAt, matchAnswer, normalize, ROUND_MS, PREVIEW_MS } from '../public/rules.mjs';
import { puzzleForDate, createGame, submitAnswer, nextRound, setPaused, reviewFor, isValidGame, scoreOf } from '../public/game.mjs';

const addDays = (date, days) => {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
};

test('New York daily date and reset handle both daylight-saving transitions', () => {
  assert.equal(etDate(Date.parse('2026-10-17T03:59:59Z')), '2026-10-16');
  assert.equal(etDate(Date.parse('2026-10-17T04:00:00Z')), '2026-10-17');
  assert.equal(new Date(resetAt('2026-10-17')).toISOString(), '2026-10-18T04:00:00.000Z');
  assert.equal(new Date(resetAt('2026-12-17')).toISOString(), '2026-12-18T05:00:00.000Z');
});

test('the question bank has 42 categories, broad answer coverage, and no duplicate answers within a prompt', () => {
  assert.equal(BANK.length, 42);
  assert.equal(DEMO.prompts.length, 7);
  assert.ok(BANK.reduce((sum, prompt) => sum + prompt.answers.length, 0) > 650);
  for (const prompt of BANK) {
    assert.ok(prompt.answers.length >= 10, `${prompt.id} should have at least ten accepted answers`);
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

test('daily questions rotate through the whole bank without repeats in a six-day cycle', () => {
  const puzzles = Array.from({ length:6 }, (_, i) => puzzleForDate(addDays('2026-07-16', i)));
  const ids = puzzles.flatMap(puzzle => puzzle.prompts.map(prompt => prompt.id));
  assert.equal(ids.length, 42);
  assert.equal(new Set(ids).size, 42);
  assert.notDeepEqual(puzzleForDate('2026-07-16').prompts.map(p => p.id), puzzleForDate('2026-07-22').prompts.map(p => p.id));
});

test('answer matching accepts expanded preparation methods and preserves correction behavior', () => {
  assert.equal(normalize('São Tomé & Príncipe'), 'saotomeandprincipe');
  const potatoes = questionById('p1').answers;
  assert.equal(matchAnswer('mashed', potatoes).answer, 'Mashed potatoes');
  assert.equal(matchAnswer('peel', potatoes).answer, 'Peeled potatoes');
  assert.equal(matchAnswer('boil', potatoes).answer, 'Boiled potatoes');
  assert.equal(matchAnswer('Yttrum', questionById('p4').answers).correction, true);
  assert.equal(matchAnswer('zzzzzzzzzz', potatoes), null);
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
