import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as Modal from 'react-modal';

import RaisedButton from 'material-ui/RaisedButton';

import * as Models from '../models';
import * as Ui from '../ui';

export class UiService {
    // private static modal: Ui.Modal;

    public static setModal(modal: any) {
        // UiService.modal = modal;
    }

    public static ShowModal(caption?: string): void {
                  
    }

    public static ShowMessageBox(message: string, caption?: string, buttonOptions?: Models.DialogButtonOptions) {
        // if (UiService.modal.state.isOpen) {
        //     return;
        // }
        
        // UiService.modal.openModal();
    }
}