import invariant from 'invariant';
import {initApp} from './app';

const entryScriptPath = new URL(import.meta.url).pathname;

const chromeElement = document.querySelector('#chrome')!;
invariant(chromeElement, 'Must have #chrome element');
initApp(chromeElement, entryScriptPath);
