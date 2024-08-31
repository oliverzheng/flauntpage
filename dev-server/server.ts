import fs from 'node:fs/promises';
import express from 'express';
import {createServer as createViteServer} from 'vite';

const port = process.env.PORT || 5173;

const app = express();

const vite = await createViteServer({
  server: {middlewareMode: true},
  appType: 'custom',
});
app.use(vite.middlewares);

app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace('/', '');

    // Always read fresh template in development
    const template = await fs.readFile('./index.html', 'utf-8');
    const html = await vite.transformIndexHtml(url, template);

    res.status(200).set({'Content-Type': 'text/html'}).send(html);
  } catch (e) {
    if (!(e instanceof Error)) {
      throw e;
    }

    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
