import * as React from 'react';
import * as Draft from 'draft-js';
import { EditorService } from '../services/editor-service';

export interface Command {
    editorService: EditorService;
    toggle();
    render(): JSX.Element;
}
