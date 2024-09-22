import {LOCAL_STORAGE_GITHUB_AUTH_TOKEN_KEY} from './constants';

const entryScriptPath = new URL(import.meta.url).pathname;

async function bootstrap() {
  if (
    process.env.NODE_ENV === 'development' ||
    localStorage.getItem(LOCAL_STORAGE_GITHUB_AUTH_TOKEN_KEY)
  ) {
    const {initApp} = await import('./app');
    initApp(entryScriptPath);
  }
}

bootstrap();
