import invariant from 'invariant';
import {IServer} from './i-server';
import renderTemplate from './render-template';

export default class DevServer implements IServer {
  private templates: {[templateName: string]: string} | undefined;

  constructor(private entryScriptPath: string) {}

  async uploadHtmlPage({
    filepath,
    contentHtml,
  }: {
    filepath: string;
    contentHtml: string;
  }) {
    const html = renderTemplate({
      server: this,
      contentHtml,
      entryScriptPath: this.entryScriptPath,
    });
    await this.uploadFile({filepath, data: html});
  }

  async uploadFiles(files: {filepath: string; data: string}[]) {
    for (const file of files) {
      await this.uploadFile(file);
    }
  }

  async uploadFile({filepath, data}: {filepath: string; data: string}) {
    const formData = new FormData();
    const file = new File([data], 'newfile', {type: 'text/html'});
    formData.append('file', file);
    formData.append('filepath', filepath);
    await fetch('/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async listFiles(directory: string): Promise<string[]> {
    if (directory !== '/templates') {
      throw new Error('NYI');
    }

    const response = await fetch('/templates');
    const filepaths = await response.json();
    return filepaths;
  }

  async getFile(filepath: string): Promise<string> {
    const response = await fetch(filepath);
    return response.text();
  }

  async initForEdit(): Promise<void> {
    const templatePaths = await this.listFiles('/templates');
    const templates: {[templateName: string]: string} = {};
    for (const path of templatePaths) {
      templates[path] = await this.getFile(path);
    }
    this.templates = templates;
  }

  getTemplates(): {[templateName: string]: string} {
    invariant(this.templates, 'Templates not initialized');
    return this.templates;
  }
}
