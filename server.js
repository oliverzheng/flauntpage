import fs from 'node:fs/promises';
import express from 'express';
import {createServer as createViteServer} from 'vite';

// Constants
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = '';
const ssrManifest = undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
const vite = await createViteServer({
  server: {middlewareMode: true},
  appType: 'custom',
  base,
});
app.use(vite.middlewares);

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    // Always read fresh template in development
    let template = await fs.readFile('./index.html', 'utf-8');
    template = await vite.transformIndexHtml(url, template);

    const render = (await vite.ssrLoadModule('/src/entry-server.ts')).render;
    const rendered = await render(url, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '');

    res.status(200).set({'Content-Type': 'text/html'}).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
