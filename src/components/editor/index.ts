import * as Common from '../../common';
import * as Commands from './commands';
import { EditorCore } from './EditorCore/Editor';
import {Plugin} from './interface';
import Toolbar from './toolbar/toolbar';

/*eslint-disable*/
console.error = (function() {
  let error = console.error;
  return function(exception) {
    if ((exception + '').indexOf('Warning: A component is `contentEditable`') != 0) {
      error.apply(console, arguments);
    }
  };
})();
/*eslint-enable*/

function init(): void {
  Common.Composition.registerConstructor<Commands.Command>('editor-commnad', Commands.ToggleBoldCommand);
}

export  {
  EditorCore,
  Plugin,
  Toolbar,
  init
};
