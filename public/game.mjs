// Browser-side game engine. Daily puzzle selection, answer validation, scoring,
// timing and answer review run entirely from this bundled data.
import { BANK, DEMO, questionById } from './puzzle.mjs';
import { TIERS, matchAnswer, etDate, resetAt, ROUND_MS, PREVIEW_MS, ROUNDS } from './rules.mjs';

const QUESTIONS_PER_DIVE = ROUNDS;
const DAYS_PER_CYCLE = Math.floor(BANK.length / QUESTIONS_PER_DIVE);

function seedNumber(value) {
  let hash = 2166136261;
  for (const char of String(value)) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}
function randomGenerator(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(items, seed) {
  const result = [...items], random = randomGenerator(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function puzzleForDate(date, seed = 'daily') {
  const dayNumber = Math.floor((Date.parse(date) - Date.parse('2026-07-16')) / 86400000) + 1;
  let prompts;
  if (seed === 'audit') {
    // Stable QA scenario for browser acceptance: potato prompt, typo correction,
    // and the same canonical seven categories on every test run.
    prompts = DEMO.prompts;
  } else if (seed === 'daily') {
    // Visit every question over a six-day cycle without repeating prompts
    // inside the cycle. Each cycle gets a different deterministic order.
    const cycle = Math.floor((dayNumber - 1) / DAYS_PER_CYCLE);
    const slot = ((dayNumber - 1) % DAYS_PER_CYCLE + DAYS_PER_CYCLE) % DAYS_PER_CYCLE;
    prompts = shuffled(BANK, seedNumber(`daily-cycle:${cycle}`)).slice(slot * QUESTIONS_PER_DIVE, (slot + 1) * QUESTIONS_PER_DIVE);
  } else {
    prompts = shuffled(BANK, seedNumber(`${date}:${seed}`)).slice(0, QUESTIONS_PER_DIVE);
  }
  return { date, dayNumber, source:'OpenKrillion question bank', sample:true, seed, prompts };
}
export function promptDTO(puzzle) {
  return {
    date:puzzle.date,
    dayNumber:puzzle.dayNumber,
    sample:!!puzzle.sample,
    source:puzzle.source,
    resetsAt:resetAt(puzzle.date),
    puzzleSeed:puzzle.seed || 'daily',
    prompts:puzzle.prompts.map(({ id, text }) => ({ id, text })),
  };
}
function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); });
}
export function scoreOf(game) {
  return (game?.results || []).reduce((s, r) => s + r.score, 0);
}
export function stateOf(game, now = Date.now()) {
  return { ...game, serverNow:now, score:scoreOf(game) };
}
export function createGame({ mode = 'daily', now = Date.now(), date = etDate(now), seed } = {}) {
  const normalizedMode = mode === 'practice' ? 'practice' : 'daily';
  const runId = newId();
  const puzzleSeed = seed || (normalizedMode === 'practice' ? runId : 'daily');
  const puzzle = puzzleForDate(date, puzzleSeed);
  const game = { ...promptDTO(puzzle), runId, mode:normalizedMode, round:0, roundStart:now + PREVIEW_MS, pausedAt:null, completed:false, results:[] };
  return stateOf(game, now);
}
export function isValidGame(value) {
  return !!value && typeof value === 'object' && typeof value.runId === 'string' && typeof value.date === 'string' && typeof value.round === 'number' && Array.isArray(value.results) && Array.isArray(value.prompts) && value.prompts.length === QUESTIONS_PER_DIVE;
}
export function nextRound(game, now = Date.now()) {
  if (!game.completed && game.roundStart === null) game.roundStart = now + PREVIEW_MS;
  return stateOf(game, now);
}
export function setPaused(game, paused, now = Date.now()) {
  if (paused === true && !game.completed && game.roundStart !== null && !game.pausedAt && now <= game.roundStart + ROUND_MS) {
    game.pausedAt = now;
  } else if (paused === false && game.pausedAt) {
    game.roundStart += now - game.pausedAt;
    game.pausedAt = null;
  }
  return stateOf(game, now);
}
export function submitAnswer(game, { answer, round, timeout = false, confirm = false, previewCorrection = true, now = Date.now() } = {}) {
  if (game.pausedAt) throw new Error('Close the menu to resume your dive.');
  if (game.completed || game.roundStart === null || round !== game.round) return { state:stateOf(game, now), alreadyScored:true };
  if (now < game.roundStart) throw new Error('The answer window has not opened yet.');
  const prompt = questionById(game.prompts[game.round]?.id);
  if (!prompt) throw new Error('This question is missing from the local bank.');
  const raw = typeof answer === 'string' ? answer.trim().slice(0, 256) : '';
  const late = now > game.roundStart + ROUND_MS;
  const timely = !late || (timeout === true && now <= game.roundStart + ROUND_MS + 1500);
  const match = raw && timely ? matchAnswer(raw, prompt.answers) : null;
  if (!match && raw && !late && !timeout) return { rejected:true, message:`“${raw}”: no echo. try again` };
  if (match?.correction && confirm !== true && !late && !timeout && previewCorrection !== false) return { correction:match.answer, original:raw };
  const result = { round:game.round, rawAnswer:raw || null, answer:match?.answer || null, tier:match?.tier || null, score:match ? TIERS[match.tier].score : 0, quip:match?.quip || null, promptText:prompt.text };
  game.results.push(result);
  game.round += 1;
  game.roundStart = null;
  if (result.round === QUESTIONS_PER_DIVE - 1) game.completed = true;
  return { result:{ ...result }, state:stateOf(game, now) };
}
export function reviewFor(game) {
  if (!game.completed) throw new Error('Finish your dive before opening the answer sheet.');
  return {
    prompts:game.prompts.map(({ id }) => {
      const prompt = questionById(id);
      if (!prompt) throw new Error('This question is missing from the local bank.');
      return { ...prompt, answers:prompt.answers.map(a => ({ ...a, score:TIERS[a.tier].score })).sort((a, b) => b.score - a.score || a.answer.localeCompare(b.answer)) };
    }),
    population:0,
    betterThan:null,
    dist:Array.from({ length:71 }, () => 0),
  };
}
