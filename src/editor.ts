import invariant from 'invariant';
import {HeadingNode, QuoteNode, registerRichText} from '@lexical/rich-text';
import {$getRoot, $insertNodes, createEditor} from 'lexical';
import {mergeRegister} from '@lexical/utils';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';

const config = {
  namespace: 'MyEditor',
  nodes: [HeadingNode, QuoteNode],
  onError: console.error,
};

const editor = createEditor(config);

mergeRegister(registerRichText(editor));

export function turnOnEditMode() {
  const contentElement = document.getElementById('content');
  invariant(contentElement != null, 'Must have a #content element');

  const initialHtml = contentElement.innerHTML;

  contentElement.contentEditable = 'true';
  editor.setRootElement(contentElement);

  editor.update(() => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(initialHtml, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);
    $getRoot().select();
    $insertNodes(nodes);
  });
}

export async function getEditorContentHtml(): Promise<string> {
  return new Promise(resolve => {
    editor.read(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      resolve(htmlString);
    });
  });
}
