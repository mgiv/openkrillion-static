import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';

for (const path of ['public/index.html', 'public/privacy/index.html', 'public/about/index.html', 'public/zh/index.html', 'public/llms.txt', 'public/llms-full.txt', 'public/pricing.md', 'public/models.md', 'public/robots.txt', 'public/sitemap.xml']) await access(path);
const html = await readFile('public/index.html', 'utf8');
assert.match(html, /<canvas id="ocean"/);
assert.match(html, /id="answer-form"/);
assert.match(html, /id="guide"/);
assert.match(html, /src="\/app\.mjs"/);
assert.doesNotMatch(html, /runtime-config|\/api\//);
const app = await readFile('public/app.mjs', 'utf8');
assert.doesNotMatch(app, /fetch\s*\(|XMLHttpRequest|\/api\//);
assert.match(app, /localStorage/);
const game = await readFile('public/game.mjs', 'utf8');
assert.match(game, /submitAnswer/);
assert.match(game, /reviewFor/);
for (const path of ['src/worker.mjs', 'wrangler.jsonc', 'migrations/0001_initial.sql']) {
  await assert.rejects(access(path), { code:'ENOENT' }, `${path} must not be part of the static project`);
}
const report = JSON.parse(await readFile('docs/build-report.json', 'utf8'));
assert.equal(report.delivery, 'static files');
const scan = async dir => {
  for (const entry of await readdir(dir, { withFileTypes:true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await scan(path);
    else if (/\.(mjs|js|json|md|txt|html|css)$/.test(path)) {
      const text = await readFile(path, 'utf8');
      assert.ok(!/gh[pousr]_[A-Za-z0-9]{30,}|AKIA[A-Z0-9]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text), `Sensitive material in ${path}`);
    }
  }
};
for (const dir of ['src', 'public', 'scripts', 'tests', 'docs']) await scan(dir);
console.log(JSON.stringify({ ok:true, delivery:'static files', pages:report.pages, docs:report.documents }));
