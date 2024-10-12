export interface IServer {
  uploadFiles(files: {filepath: string; data: string}[]): Promise<void>;

  uploadHtmlPage(options: {
    filepath: string;
    contentHtml: string;
  }): Promise<void>;
}
