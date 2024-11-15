export interface IServer {
  uploadFiles(files: {filepath: string; data: string}[]): Promise<void>;

  uploadHtmlPage(options: {
    filepath: string;
    contentHtml: string;
  }): Promise<void>;

  listFiles(directory: string): Promise<string[]>;

  getFile(path: string): Promise<string>;

  initForEdit(): Promise<void>;
  getTemplates(): {[templateName: string]: string};
}
