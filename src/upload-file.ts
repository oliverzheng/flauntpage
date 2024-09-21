import template from './template.html?raw';

export default async function uploadFile(
  filepath: string,
  contentHtml: string,
  entryScriptPath: string,
) {
  const formData = new FormData();
  const html = template
    .replace(`<!--content-->`, contentHtml)
    .replace('SCRIPT_PATH', entryScriptPath);
  const file = new File([html], 'newfile.html', {type: 'text/html'});
  formData.append('file', file);
  formData.append('filepath', filepath);
  const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });
  console.log({response});
}
