export const TIERS = {
  plankton: { name: 'Plankton', score: 10, emoji: '🫧', color: '#8fa3c4', blurb: 'The answer everyone blurts out.' },
  tooclever: { name: 'Too Clever', score: 15, emoji: '🤡', color: '#ff9f43', blurb: 'The obscure answer the whole school thought of.' },
  schooler: { name: 'Schooler', score: 30, emoji: '🐟', color: '#4de3ff', blurb: 'Solid — swims with the school.' },
  rare: { name: 'Rare', score: 60, emoji: '🦑', color: '#ff5252', blurb: 'An uncommon answer. Nice pull.' },
  deepcut: { name: 'Deep Cut', score: 85, emoji: '🏮', color: '#9d7bff', blurb: 'True obscurity. Few go this deep.' },
  krillion: { name: 'One in a Krillion', score: 100, emoji: '🌟', color: '#ffd166', blurb: 'The designated gem. Trench floor.' },
};
export const BANDS = [
  { min: 0, max: 150, tier: 'plankton', name: 'Plankton', text: 'Plenty of ocean left down there.' },
  { min: 151, max: 250, tier: 'schooler', name: 'Schooler', text: 'Swimming with the school.' },
  { min: 251, max: 350, tier: 'rare', name: 'Rare', text: 'Below the thermocline. Nice.' },
  { min: 351, max: 449, tier: 'deepcut', name: 'Deep cut', text: 'Seriously deep dive.' },
  { min: 450, max: 700, tier: 'krillion', name: 'One in a krillion', text: 'Trench dweller. Absurd.' },
];
export const ROUND_MS = 25000;
export const PREVIEW_MS = 3000;
export const ROUNDS = 7;
export const bandFor = score => [...BANDS].reverse().find(b => score >= b.min) || BANDS[0];
export const normalize = value => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
export function etDate(now = Date.now()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now));
}
export function resetAt(date) {
  const next = new Date(date + 'T12:00:00Z'); next.setUTCDate(next.getUTCDate() + 1);
  const day = next.toISOString().slice(0, 10);
  const probe = new Date(day + 'T04:00:00Z');
  return etDate(probe) === day ? probe.getTime() : Date.parse(day + 'T05:00:00Z');
}
export function distance(a, b, limit = Infinity) {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let previous = Array.from({ length:b.length + 1 }, (_, i) => i), beforePrevious = null;
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) current[j] = Math.min(current[j], beforePrevious[j - 2] + 1);
    }
    beforePrevious = previous;
    previous = current;
  }
  return previous[b.length];
}
function words(value) {
  return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().match(/[a-z0-9]+/g) || [];
}
function wordForms(word) {
  const forms = new Set([word]), add = value => { if (value.length >= 3) forms.add(value); };
  if (word.length >= 5 && word.endsWith('ies')) add(word.slice(0, -3) + 'y');
  if (word.length >= 5 && word.endsWith('ing')) {
    const stem = word.slice(0, -3); add(stem); add(stem + 'e');
    if (stem.length > 2 && stem.at(-1) === stem.at(-2)) add(stem.slice(0, -1));
  }
  if (word.length >= 5 && word.endsWith('ed')) {
    const stem = word.slice(0, -2); add(stem); add(stem + 'e');
    if (stem.length > 2 && stem.at(-1) === stem.at(-2)) add(stem.slice(0, -1));
  }
  if (word.length >= 5 && word.endsWith('es')) add(word.slice(0, -2));
  else if (word.length >= 5 && word.endsWith('s')) add(word.slice(0, -1));
  if (word.length >= 5 && word.endsWith('e')) add(word.slice(0, -1));
  return forms;
}
function variationMatch(input, candidate) {
  const query = words(input), target = words(candidate);
  if (!query.length || query.length > target.length || query.some(word => word.length < 3)) return false;
  let cursor = 0;
  for (const queryWord of query) {
    const forms = wordForms(queryWord);
    let found = false;
    while (cursor < target.length) {
      const targetWord = target[cursor++];
      if ([...wordForms(targetWord)].some(form => forms.has(form))) { found = true; break; }
    }
    if (!found) return false;
  }
  return true;
}
export function matchAnswer(input, answers) {
  const key = normalize(input);
  if (!key || key.length > 256) return null;
  const commonAliases = { mashedpotatoes: ['mashed', 'mash'], frenchfries: ['fries'], bakedpotato: ['baked potato', 'jacket potato'] };
  const entries = answers.flatMap(a => [a.answer, ...(a.aliases || []), ...(commonAliases[normalize(a.answer)] || [])].map(word => ({ word, a, key: normalize(word) })));
  const exact = entries.find(e => e.key === key);
  if (exact) return { ...exact.a, correction: key !== normalize(exact.a.answer) };

  // Phrase fragments and common inflections (bake/baked/baking, boil/boiled)
  // become confirmation suggestions, never silent scores.
  const variations = entries.filter(e => variationMatch(input, e.word));
  const unique = new Map(variations.map(e => [normalize(e.a.answer), e]));
  if (unique.size === 1) return { ...unique.values().next().value.a, correction:true };

  const allowance = key.length < 4 ? 0 : key.length < 5 ? 1 : 2;
  const candidates = entries.map(e => ({ ...e, d:distance(key, e.key, allowance) })).filter(e => e.d <= allowance).sort((a, b) => a.d - b.d);
  if (candidates.length && (!candidates[1] || candidates[0].d < candidates[1].d || candidates[0].a.answer === candidates[1].a.answer)) return { ...candidates[0].a, correction:true };
  return null;
}
export function shareText(day, results) {
  const score = results.reduce((s, r) => s + r.score, 0);
  return `OpenKrillion #${day} 🦐\n${score}/700 · ${score * 10}m\n${results.map(r => TIERS[r.tier]?.emoji || '⬛').join('')}\nhttps://openkrillion.com`;
}
