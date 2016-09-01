import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as ReactModal from 'react-modal';

import RaisedButton from 'material-ui/RaisedButton';

import * as Models from '../models';

import * as Spinner from 'react-spinkit';

export class Modal extends React.Component<any, IModalState> {
    constructor() {
        super();

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            isOpen: false
        };
    }

    public openModal(): void {
        this.setState({ isOpen: true });
    }

    public closeModal() {
        this.setState({ isOpen: false });
    }

    render() {
        return (
            <ReactModal isOpen={this.state.isOpen}
                    onRequestClose={this.closeModal}>
                <Spinner spinnerName="double-bounce" />
            </ReactModal>
        );
    }
}


interface IModalProps {
    caption?: string;
    message?: string;
    buttons?: Models.DialogButtonOptions;
    style?: {
        content: {
            [key: string]: any;
        },
        overlay: {
            [key: string]: any;
        }
    };
}

interface IModalState {
    isOpen: boolean;
}