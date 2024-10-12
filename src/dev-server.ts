import {IServer} from './i-server';
import renderTemplate from './render-template';

export default class DevServer implements IServer {
  constructor(private entryScriptPath: string) {}

  async uploadHtmlPage({
    filepath,
    contentHtml,
  }: {
    filepath: string;
    contentHtml: string;
  }) {
    const html = renderTemplate(contentHtml, this.entryScriptPath);
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
}
