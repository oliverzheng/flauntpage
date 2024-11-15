import invariant from 'invariant';
import {IServer} from './i-server';
import mustache from 'mustache';
import pretty from 'pretty';

const chromeTemplate = `
<div id="chrome" style="display: none">
  <button class="enable-edit-button">Edit</button>
  <button class="add-page-button">Add page</button>
  <button class="save-button">Save</button>
  <button class="cancel-edit-button">Cancel</button>
  |
  <button class="update-button">Update</button>
</div>
`;

export default function renderTemplate({
  server,
  contentHtml,
  entryScriptPath,
}: {
  server: IServer;
  contentHtml: string;
  entryScriptPath: string;
}) {
  // TODO: Support multiple templates
  const templates = server.getTemplates();
  const template = Object.values(templates)[0];
  invariant(template, 'No templates found');

  const headTemplate = `<script type="module" crossorigin src="${entryScriptPath}"></script>`;

  const renderedHtml = mustache.render(
    template,
    {
      TEMPLATES_DIR_PATH: '/templates',
    },
    {
      head: headTemplate,
      chrome: chromeTemplate,
      content: `<div id="content">${contentHtml}</div>`,
    },
  );

  return pretty(renderedHtml, {ocd: true});
}
