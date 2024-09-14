import invariant from 'invariant';
import {initApp} from './app';

const appElement = document.querySelector('#app')!;
invariant(appElement, 'Must have #app element');
initApp(appElement);
