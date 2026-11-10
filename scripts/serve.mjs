import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Development-only static file server. It has no routes, persistence, or APIs.
const root = resolve(fileURLToPath(new URL('../public/', import.meta.url)));
const types = { '.html':'text/html; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2', '.txt':'text/plain; charset=utf-8', '.md':'text/markdown; charset=utf-8', '.xml':'application/xml; charset=utf-8', '.json':'application/json; charset=utf-8' };
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow:'GET, HEAD' }); return res.end(); }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://static.local').pathname);
    let path = resolve(root, `.${pathname}`);
    if (path !== root && !path.startsWith(root + sep)) throw new Error('outside public root');
    try { if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html'); }
    catch { /* try explicit index route below */ }
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type':types[extname(path)] || 'application/octet-stream', 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8', 'X-Content-Type-Options':'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : 'Not found\n');
  }
});
const port = Number(process.env.PORT || 4173);
server.listen(port, '0.0.0.0', () => console.log(`Static files: ${root} (port ${port})`));
