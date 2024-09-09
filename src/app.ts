import invariant from 'invariant';
import {getEditorContentHtml, turnOnEditMode} from './editor';
import uploadFile from './upload-file';

export function initApp(appElement: Element) {
  const saveButton = document.querySelector<HTMLButtonElement>('#save-button')!;

  appElement.innerHTML = `
<button id="app--turn-on-edit">
  Turn on edit
</button>
`;

  const turnOnEditButton = document.querySelector('#app--turn-on-edit')!;
  invariant(turnOnEditButton, 'Must have #app--turn-on-edit element');
  turnOnEditButton.addEventListener('click', async () => {
    turnOnEditMode();
    saveButton.disabled = false;
  });

  saveButton.addEventListener('click', async () => {
    const newContent = await getEditorContentHtml();
    await uploadFile('index.html', newContent);
  });
}
