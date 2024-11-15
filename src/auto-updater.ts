import {Octokit} from '@octokit/rest';

// Github source for new asset files
const OWNER = 'oliverzheng';
const REPO = 'flauntpage';
const DIST_DIR = 'dist/assets';

// What's written to the local files
const DEST_DIR = 'assets';

export default class AutoUpdater {
  private octokit: Octokit;

  constructor({octokit}: {octokit: Octokit}) {
    this.octokit = octokit;
  }

  async fetchAssets(): Promise<{filepath: string; data: string}[]> {
    const {data} = await this.octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: DIST_DIR,
    });

    if (!Array.isArray(data)) {
      return [];
    }

    const assets = [];
    for (const item of data) {
      if (item.type !== 'file') {
        continue;
      }
      const {data: fileData} = await this.octokit.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: item.path,
        mediaType: {
          format: 'raw',
        },
      });
      if (typeof fileData !== 'string') {
        continue;
      }
      assets.push({
        filepath: `/${DEST_DIR}/${item.name}`,
        data: fileData,
      });
    }
    return assets;
  }
}
