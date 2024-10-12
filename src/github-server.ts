import {Octokit} from '@octokit/rest';
import renderTemplate from './render-template';
import {IServer} from './i-server';

export default class GitHubServer implements IServer {
  private octokit: Octokit;
  private entryScriptPath: string;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor({
    entryScriptPath,
    owner,
    repo,
    branch,
    octokit,
  }: {
    entryScriptPath: string;
    owner: string;
    repo: string;
    branch: string;
    octokit: Octokit;
  }) {
    this.entryScriptPath = entryScriptPath;
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
    this.octokit = octokit;
  }

  static setup(
    octokit: Octokit,
    entryScriptPath: string,
  ): GitHubServer | undefined {
    const owner = localStorage.getItem('GITHUB_OWNER');
    const repo = localStorage.getItem('GITHUB_REPO');
    const branch = localStorage.getItem('GITHUB_BRANCH');

    if (!owner || !repo || !branch) {
      return;
    }

    return new GitHubServer({entryScriptPath, owner, repo, branch, octokit});
  }

  async uploadHtmlPage({
    filepath,
    contentHtml,
  }: {
    filepath: string;
    contentHtml: string;
  }) {
    const html = renderTemplate(contentHtml, this.entryScriptPath);

    await this.uploadFiles([{filepath, data: html}]);
  }

  async uploadFiles(files: {filepath: string; data: string}[]) {
    if (files.length === 0) {
      return;
    }

    // Get the SHA of the latest commit on the branch
    const {data: refData} = await this.octokit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.branch}`,
    });

    // Get the tree SHA of the latest commit
    const latestCommitSha = refData.object.sha;

    // Get the commit details
    const {data: commitData} = await this.octokit.git.getCommit({
      owner: this.owner,
      repo: this.repo,
      commit_sha: latestCommitSha,
    });

    // Create a new tree with the new file
    const {data: treeData} = await this.octokit.git.createTree({
      owner: this.owner,
      repo: this.repo,
      tree: files.map(file => ({
        path: file.filepath.slice(1),
        mode: '100644',
        type: 'blob',
        content: file.data,
      })),
      base_tree: commitData.tree.sha,
    });

    // Create a new commit
    const {data: newCommitData} = await this.octokit.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message: `Upsert ${files.map(({filepath}) => filepath).join(', ')}`,
      tree: treeData.sha,
      parents: [latestCommitSha],
    });

    // Update the reference to point to the new commit
    await this.octokit.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.branch}`,
      sha: newCommitData.sha,
    });
  }
}