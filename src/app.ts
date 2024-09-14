import invariant from 'invariant';
import {getEditorContentHtml, turnOnEditMode} from './editor';
import uploadFile from './upload-file';

export function initApp(appElement: Element) {
  const enableEditButton = appElement.querySelector<HTMLButtonElement>(
    '.enable-edit-button',
  );
  invariant(enableEditButton, 'Missing enable-edit-button');

  const saveButton = document.querySelector<HTMLButtonElement>('.save-button');
  invariant(saveButton, 'Missing save button');
  saveButton.disabled = true;

  enableEditButton.addEventListener('click', async () => {
    turnOnEditMode();
    saveButton.disabled = false;
  });

  saveButton.addEventListener('click', async () => {
    const newContent = await getEditorContentHtml();
    await uploadFile('index.html', newContent);
  });
}
