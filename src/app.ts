import invariant from 'invariant';
import {getEditorContentHtml, turnOffEditMode, turnOnEditMode} from './editor';
import uploadFile from './upload-file';

export function initApp(chromeElement: Element) {
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
    await onAddPageClick();
  });

  saveButton.addEventListener('click', async () => {
    const newContent = await getEditorContentHtml();
    await uploadFile(window.location.pathname, newContent);
    turnOffEditMode();
  });

  cancelEditButton.addEventListener('click', async () => {
    turnOffEditMode();
  });
}

async function onAddPageClick() {
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

  await uploadFile(url, '<p>Here is your new page. Make it good.</p>');

  window.location.href = url;
}
