import fs from 'fs';
import path from 'path';
import renderTemplate from '../src/render-template';
import {IServer} from '../src/i-server';

// Get --env argument
const args = process.argv.slice(2);
const envArg = args.find(arg => arg.startsWith('--env='));
const env = envArg?.split('=')[1];

if (!env || !['development', 'production'].includes(env)) {
  throw new Error(
    '--env argument must be either "development" or "production"',
  );
}

export default class BuildServer implements IServer {
  constructor() {}

  async uploadHtmlPage() {
    throw new Error('Not supported');
  }

  async uploadFiles(files: {filepath: string; data: string}[]) {
    throw new Error('Not supported');
  }

  async uploadFile() {
    throw new Error('Not supported');
  }

  async listFiles(): Promise<string[]> {
    throw new Error('Not supported');
  }

  async getFile(): Promise<string> {
    throw new Error('Not supported');
  }

  async initForEdit(): Promise<void> {
    throw new Error('Not supported');
  }

  getTemplates(): {[templateName: string]: string} {
    const templates: {[templateName: string]: string} = {};
    const TEMPLATES_DIR = 'public/templates';
    const templateFiles = fs.readdirSync(TEMPLATES_DIR);
    for (const filename of templateFiles) {
      const filepath = path.join(TEMPLATES_DIR, filename);
      const content = fs.readFileSync(filepath, 'utf-8');
      templates[`/templates/${filename}`] = content;
    }
    return templates;
  }
}

const server = new BuildServer();
server.getTemplates();

const html = renderTemplate({
  server,
  contentHtml: 'Edit me',
  entryScriptPath: '/src/entry-client.ts',
});

if (env === 'development') {
  const storedFilesDir = 'stored-files';
  const indexPath = `${storedFilesDir}/index.html`;

  try {
    fs.accessSync(indexPath);
  } catch {
    console.log('Creating placeholder index.html...');
    fs.mkdirSync(storedFilesDir, {recursive: true});
    fs.writeFileSync(indexPath, html);
  }
} else {
  // Production - always write to /index.html
  fs.writeFileSync('index.html', html);
}
