import invariant from 'invariant';
import {getEditorContentHtml, turnOffEditMode, turnOnEditMode} from './editor';
import uploadFile from './upload-file';

export function initApp(chromeElement: Element) {
  const enableEditButton = chromeElement.querySelector<HTMLButtonElement>(
    '.enable-edit-button',
  );
  invariant(enableEditButton, 'Missing enable-edit-button');

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

  saveButton.addEventListener('click', async () => {
    const newContent = await getEditorContentHtml();
    await uploadFile('index.html', newContent);
    turnOffEditMode();
  });

  cancelEditButton.addEventListener('click', async () => {
    turnOffEditMode();
  });
}
