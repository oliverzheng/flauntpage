import fs from 'node:fs/promises';
import express from 'express';
import multer from 'multer';
import path from 'path';
import {createServer as createViteServer} from 'vite';

const port = process.env.PORT || 5173;
const STORED_FILES_DIR = 'stored-files';
const PUBLIC_FILES_DIR = 'public';
const TEMPLATES_FILES_DIR = PUBLIC_FILES_DIR + '/templates';
const TMP_FILES_DIR = 'tmp-stored-files';

const app = express();

const vite = await createViteServer({
  server: {
    middlewareMode: true,
    watch: {
      ignored: `**/${STORED_FILES_DIR}/**`,
    },
  },
  appType: 'custom',
});
app.use(vite.middlewares);

const upload = multer({dest: TMP_FILES_DIR});

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const {filepath} = req.body;
  if (!filepath || typeof filepath !== 'string') {
    console.log(filepath);
    return res.status(400).send('No filepath specified.');
  }

  const targetPath = path.resolve(path.join(STORED_FILES_DIR, '/', filepath));
  if (!targetPath.startsWith(path.resolve(STORED_FILES_DIR) + '/')) {
    console.log(targetPath, path.resolve(STORED_FILES_DIR) + '/');
    return res.status(400).send('Invalid filepath.');
  }

  await fs.mkdir(path.dirname(targetPath), {recursive: true});
  await fs.rename(req.file.path, targetPath);

  return res.send('Uploaded');
});

app.get('*.html', async (req, res) => {
  const url = req.originalUrl;

  try {
    const file = await fs.readFile(STORED_FILES_DIR + url, 'utf-8');
    const html = await vite.transformIndexHtml(url, file);

    res.status(200).set({'Content-Type': 'text/html'}).send(html);
  } catch (e) {
    if (!(e instanceof Error)) {
      throw e;
    }

    if ('code' in e && e.code === 'ENOENT') {
      return res.status(404).end();
    }

    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get('/templates/*.mustache', async (req, res) => {
  const url = req.originalUrl;

  try {
    const template = await fs.readFile(PUBLIC_FILES_DIR + url, 'utf-8');

    res.status(200).set({'Content-Type': 'text/plain'}).send(template);
  } catch (e) {
    if (!(e instanceof Error)) {
      throw e;
    }

    if ('code' in e && e.code === 'ENOENT') {
      return res.status(404).end();
    }

    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get('/templates', async (_req, res) => {
  try {
    const filepaths = await fs.readdir(TEMPLATES_FILES_DIR, {recursive: true});

    res
      .status(200)
      .set({'Content-Type': 'application/json'})
      .send(filepaths.map(path => `/templates/${path}`));
  } catch (e) {
    if (!(e instanceof Error)) {
      throw e;
    }

    if ('code' in e && e.code === 'ENOENT') {
      return res.status(404).end();
    }

    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
