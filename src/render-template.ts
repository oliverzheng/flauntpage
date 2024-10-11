import template from './template.html?raw';

export default function renderTemplate(
  contentHtml: string,
  entryScriptPath: string,
) {
  const cssPath =
    process.env.NODE_ENV === 'development'
      ? '/src/style.css'
      : '/assets/index.css';
  return template
    .replace(`<!--content-->`, contentHtml)
    .replace('SCRIPT_PATH', entryScriptPath)
    .replace('STYLE_PATH', cssPath);
}
