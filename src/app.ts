import invariant from 'invariant';
import {getEditorContentHtml, turnOffEditMode, turnOnEditMode} from './editor';
import {IServer} from './i-server';
import GitHubServer from './github-server';

export async function initApp(
  // This is like this so that dev server can be passed in, but there is one
  // entry point to initializing the app (here) so there is only 1
  // productionized JS bundle.
  entryScriptPath: string,
) {
  let server;
  if (process.env.NODE_ENV === 'development') {
    // Import it inline so production build doesn't have it
    const {default: DevServer} = await import('./dev-server');
    server = new DevServer(entryScriptPath);
  }
  if (!server) {
    server = GitHubServer.setup(entryScriptPath);
    invariant(server, 'Invalid Github config');
  }

  const chromeElement = document.querySelector<HTMLElement>('#chrome')!;
  invariant(chromeElement, 'Must have #chrome element');
  chromeElement.style.display = 'block';

  const enableEditButton = chromeElement.querySelector<HTMLButtonElement>(
    '.enable-edit-button',
  );
  invariant(enableEditButton, 'Missing enable-edit-button');

  const addPageButton =
    chromeElement.querySelector<HTMLButtonElement>('.add-page-button');
  invariant(addPageButton, 'Missing add-page-button');

  const cancelEditButton = chromeElement.querySelector<HTMLButtonElement>(
    '.cancel-edit-button',
  );
  invariant(cancelEditButton, 'Missing cancel-edit-button');

  const saveButton =
    chromeElement.querySelector<HTMLButtonElement>('.save-button');
  invariant(saveButton, 'Missing save button');

  enableEditButton.addEventListener('click', async () => {
    turnOnEditMode();
  });

  addPageButton.addEventListener('click', async () => {
    await onAddPageClick(server);
  });

  saveButton.addEventListener('click', async () => {
    const newContent = await getEditorContentHtml();
    await server.uploadFile({
      filepath: window.location.pathname,
      contentHtml: newContent,
    });
    turnOffEditMode(true);
  });

  cancelEditButton.addEventListener('click', async () => {
    turnOffEditMode(false);
  });
}

async function onAddPageClick(server: IServer) {
  let url = prompt('What url should the page have?', '/somepage.html');

  while (true) {
    if (url == null) {
      return;
    } else if (!url.startsWith('/')) {
      url = prompt('Url must start with /', '/somepage.html');
    } else if (!url.endsWith('.html')) {
      url = prompt('Url must end with .html', '/somepage.html');
    } else {
      break;
    }
  }

  await server.uploadFile({
    filepath: url,
    contentHtml: '<p>Here is your new page. Make it good.</p>',
  });

  window.location.href = url;
}
