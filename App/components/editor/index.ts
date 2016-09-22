import { EditorCore } from "./EditorCore/Editor";
import {Plugin} from "./interface";
import  Toolbar  from "./toolbar/toolbar";

/*eslint-disable*/
console.error = (function() {
  var error = console.error;
  return function(exception) {
    if ((exception + '').indexOf('Warning: A component is `contentEditable`') != 0) {
      error.apply(console, arguments)
    }
  }
})();
/*eslint-enable*/

const EditorCorePublic = {
  EditorCore,
  GetText: EditorCore.GetText,
  GetHTML: EditorCore.GetHTML,
  toEditorState: EditorCore.ToEditorState,
  Plugin,
  Toolbar
};

export default EditorCorePublic;
