import template from './template.html?raw';

export default async function uploadFile(
  filename: string,
  contentHtml: string,
) {
  const formData = new FormData();
  const html = template.replace(`<!--content-->`, contentHtml);
  const file = new File([html], filename, {type: 'text/html'});
  formData.append('file', file);
  const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });
  console.log({response});
}
