import './style.css';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';
import {setupCounter} from './counter.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

const uploadButton =
  document.querySelector<HTMLButtonElement>('#upload-button')!;
uploadButton.addEventListener('click', async () => {
  const formData = new FormData();
  const file = new File(
    ['Hello, world!'],
    'my-path/to/here/my-custom-file-name.html',
    {type: 'text/html'},
  );
  formData.append('file', file);
  const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });
  console.log({response});
});
