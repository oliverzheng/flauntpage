import {IServer} from './i-server';
import renderTemplate from './render-template';

export default class DevServer implements IServer {
  constructor(private entryScriptPath: string) {}

  async uploadFile({
    filepath,
    contentHtml,
  }: {
    filepath: string;
    contentHtml: string;
  }) {
    const formData = new FormData();
    const html = renderTemplate(contentHtml, this.entryScriptPath);
    const file = new File([html], 'newfile.html', {type: 'text/html'});
    formData.append('file', file);
    formData.append('filepath', filepath);
    await fetch('/upload', {
      method: 'POST',
      body: formData,
    });
  }
}
