import invariant from 'invariant';
import './style.css';
import {initApp} from './app';

const appElement = document.querySelector('#app')!;
invariant(appElement, 'Must have #app element');
initApp(appElement);
