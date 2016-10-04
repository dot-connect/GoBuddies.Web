import * as Draft from 'draft-js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Rx from 'rxjs';
import { injectable, decorate } from 'inversify';

import IconButton from 'material-ui/IconButton';
import FormatUnderLine from 'material-ui/svg-icons/editor/format-underlined';

import { EditorService } from '../services/editor-service';
import { Command } from './command';

@injectable()
export class ToggleUnderLineCommand extends React.Component<IToggleUnderLineCommandProps, IToggleUnderLineCommandState> implements Command {
    private controls = {
        button: IconButton
    };

    private clickStream: Rx.Subscription = null;

    public editorService: EditorService;

    constructor(props: IToggleUnderLineCommandProps) {
        super(props);
    }

    componentWillMount(): void {
        this.controls = {
            button: null
        };

        this.state = {
            isDisabled: false
        };
    }

    componentDidMount(): void {
        this.clickStream = Rx.Observable.fromEvent(ReactDOM.findDOMNode(this.controls.button as any), 'click')
            .subscribe(this.onButtonClick);
        this.editorService = !this.editorService ? this.props.editorService : this.editorService;
    }

    componentWillUnmount(): void {
        this.clickStream.unsubscribe();
    }

    toggle(): void {
        let editorState = Draft.RichUtils.toggleInlineStyle(this.editorService.getEditorState(), 'UNDERLINE');
        this.editorService.updateState(editorState);
    }

    onButtonClick = () => {
        this.toggle();
    }

    render(): JSX.Element {
        return (
            <IconButton ref={ref => this.controls.button = ref}
                disabled={this.state.isDisabled}>
                <FormatUnderLine/>
            </IconButton>
        );
    }
}

interface IToggleUnderLineCommandProps extends React.Props<ToggleUnderLineCommand> {
    editorService?: EditorService;
}

interface IToggleUnderLineCommandState {
    isDisabled?: boolean;
}