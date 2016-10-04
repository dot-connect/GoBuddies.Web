import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as createFragment from 'react-addons-create-fragment';
import * as Rx from 'rxjs';
import * as DraftJS from 'draft-js';
import * as Immutable from 'immutable';

import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';

import * as Common from '../../../common';

import { Config } from '../editorcore/configstore';
import { EditorCore } from '../EditorCore/Editor';
import { EditorService } from './editor-service';

import * as Commands from '../commands';

export class UiService {

    private editorService: EditorService;    
    private commands: Array<Commands.Command>;

    constructor(editorService: EditorService) {
        this.editorService = editorService;
        this.commands = Common.Composition.getAll<Commands.Command>('editor-commnad');
    }

    public getCursorCursorRect(): ClientRect {
        // The rectangle that bounds the editor
        // var editorNode: Element = ReactDOM.findDOMNode(editor);
        // var editorBound: ClientRect = editorNode.getBoundingClientRect();

        // The rectangle that bounds the cursor
        let selection: Selection = window.getSelection();
        let oRange: Range = selection.getRangeAt(0);
        return oRange.getBoundingClientRect();
    }

    public getAvailableCommands = (): JSX.Element => {
        return (
            <div>
                <Commands.ToggleBoldCommand editorService={this.editorService} />
                    <Commands.ToggleItalicCommand editorService={this.editorService} />
                    <Commands.ToggleUnderLineCommand editorService={this.editorService} />
                    <Commands.ToggleCodeCommand editorService={this.editorService} />
                </div>
        );
    }
}
