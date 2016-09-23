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

export  {
  EditorCore,
  Plugin,
  Toolbar
};
