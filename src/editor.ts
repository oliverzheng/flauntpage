import invariant from 'invariant';
import {HeadingNode, QuoteNode, registerRichText} from '@lexical/rich-text';
import {
  $getRoot,
  $insertNodes,
  createEditor,
  KEY_MODIFIER_COMMAND,
  COMMAND_PRIORITY_NORMAL,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import {mergeRegister} from '@lexical/utils';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import {LinkNode, $isLinkNode, AutoLinkNode, $toggleLink} from '@lexical/link';
import {getSelectedNode} from './get-selected-node';

const config = {
  namespace: 'MyEditor',
  nodes: [HeadingNode, QuoteNode, LinkNode, AutoLinkNode],
  onError: console.error,
};

const editor = createEditor(config);
let htmlBeforeEdit: string;

mergeRegister(registerRichText(editor));

function setEditorToHtml(html: string) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, 'text/html');
  const nodes = $generateNodesFromDOM(editor, dom);
  const root = $getRoot();
  root.clear(); // In case we try to turn on edit multiple times
  root.select();
  $insertNodes(nodes);
}

export function turnOnEditMode() {
  document.body.className += ' edit-enabled';

  const contentElement = document.getElementById('content');
  invariant(contentElement != null, 'Must have a #content element');

  htmlBeforeEdit = contentElement.innerHTML;

  contentElement.contentEditable = 'true';
  editor.setRootElement(contentElement);

  editor.update(() => {
    setEditorToHtml(htmlBeforeEdit);
  });

  editor.registerCommand(
    KEY_MODIFIER_COMMAND,
    payload => {
      const event: KeyboardEvent = payload;
      const {code, ctrlKey, metaKey} = event;

      if (code === 'KeyK' && (ctrlKey || metaKey)) {
        event.preventDefault();

        const selection = $getSelection();
        if (!selection || !$isRangeSelection(selection)) {
          return false;
        }

        const node = getSelectedNode(selection);
        const parent = node.getParent();
        const isLink = $isLinkNode(parent) || $isLinkNode(node);
        let url: string | null;
        if (!isLink) {
          url = prompt('What url to link?', 'https://google.com/');
        } else {
          url = null;
        }
        $toggleLink(url);
        return true;
      }
      return false;
    },
    COMMAND_PRIORITY_NORMAL,
  );
}

export function turnOffEditMode(htmlSaved: boolean) {
  document.body.className = document.body.className.replace('edit-enabled', '');

  const contentElement = document.getElementById('content');
  invariant(contentElement != null, 'Must have a #content element');

  if (htmlSaved) {
    htmlBeforeEdit = contentElement.innerHTML;
  } else {
    editor.update(() => {
      setEditorToHtml(htmlBeforeEdit);
    });
  }

  contentElement.removeAttribute('contentEditable');
}

export async function getEditorContentHtml(): Promise<string> {
  return new Promise(resolve => {
    editor.read(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      resolve(htmlString);
    });
  });
}
