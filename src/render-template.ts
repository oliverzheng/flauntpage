import template from './template.html?raw';

export default function renderTemplate(
  contentHtml: string,
  entryScriptPath: string,
) {
  return template
    .replace(`<!--content-->`, contentHtml)
    .replace('SCRIPT_PATH', entryScriptPath);
}
