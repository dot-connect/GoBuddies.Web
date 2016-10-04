import * as Draft from 'draft-js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Rx from 'rxjs';
import { injectable, decorate } from 'inversify';

import IconButton from 'material-ui/IconButton';
import FormatBold from 'material-ui/svg-icons/editor/format-bold';

import { EditorService } from '../services/editor-service';
import { Command } from './command';

@injectable()
export class ToggleBoldCommand extends React.Component<IToggleBoldCommandProps, IToggleBoldCommandState> implements Command {
    private controls = {
        button: IconButton
    };

    private clickStream: Rx.Subscription = null;

    public editorService: EditorService;

    constructor(props: IToggleBoldCommandProps) {
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
        let editorState = Draft.RichUtils.toggleInlineStyle(this.editorService.getEditorState(), 'BOLD');
        this.editorService.updateState(editorState);
    }

    onButtonClick = () => {
        this.toggle();
    }

    render(): JSX.Element {
        return (
            <IconButton ref={ref => this.controls.button = ref}
                disabled={this.state.isDisabled}>
                <FormatBold/>
            </IconButton>
        );
    }
}

interface IToggleBoldCommandProps extends React.Props<ToggleBoldCommand> {
    editorService?: EditorService;
}

interface IToggleBoldCommandState {
    isDisabled?: boolean;
}