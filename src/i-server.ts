export interface IServer {
  uploadFile(options: {filepath: string; contentHtml: string}): Promise<void>;
}
