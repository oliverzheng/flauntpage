import invariant from 'invariant';
import {initApp} from './app';

const chromeElement = document.querySelector('#chrome')!;
invariant(chromeElement, 'Must have #chrome element');
initApp(chromeElement);
