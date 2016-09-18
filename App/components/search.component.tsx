import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Rx from "rxjs";
import RaisedButton from "material-ui/RaisedButton";
import Popover from "material-ui/Popover/Popover";
import {Menu, MenuItem} from "material-ui/Menu";
 
export class SearchComponent extends React.Component<SearchComponentProps, SearchComponentState> {
    private inputer: Rx.Subject<string>;
    
    private controls: {
        textField: HTMLInputElement;
        container: HTMLDivElement
    };

    constructor(props: SearchComponentProps) {
        super(props);
        this.onUpdateInput = this.onUpdateInput.bind(this);
        this.performSearch = this.performSearch.bind(this);
        this.handleSearchResultBoxRequestClose = this.handleSearchResultBoxRequestClose.bind(this);
        this.handleSearchBntTap = this.handleSearchBntTap.bind(this);
    }

    componentWillMount(): void {
        this.state = {
            dataSource: [],
            inputValue: "",
            container: null
        };

        this.controls = {
            textField: null,
            container: null
        };

        this.props = {};
    }


    componentDidMount(): void {
        this.inputer = new Rx.Subject<string>();
        var inputStream = this.inputer
                            .map(text => { return text; })
                            .filter(text => {
                                return text.length > 2; // Only if the text is longer than 2 characters
                            })
                            .debounceTime(500)
                            .distinctUntilChanged(); // Only if the value has changed
        var searcher = inputStream.subscribe(this.performSearch);
    }

    performSearch(): void {
    }

    onUpdateInput(): void {
        this.inputer.next(this.getInput());
    }

    handleSearchResultBoxRequestClose(): void {
        this.setState({
            isSearchResultBoxOpen: false
        });
    }

    handleSearchBntTap(): void {
        this.setState({
            isSearchResultBoxOpen: true,
            container: ReactDOM.findDOMNode(this.controls.container)
        });
    }

    private getInput(): string {
        return this.controls.textField.value;
    }

    render() {
        return (
            <div style={ {content:" ", display:"table-cell", height:"100%", verticalAlign:"middle"}} ref={div => this.controls.container = div}>
                <input
                    style={{backgroundColor:"white",display:"inline-block", height:"24px"}}
                    onChange={this.onUpdateInput}
                    hintText={this.props.placeHolder}
                    ref={control => this.controls.textField = control}/>
                <RaisedButton label="Search" onTouchTap={this.handleSearchBntTap}/>
                <Popover
                    open={this.state.isSearchResultBoxOpen}
                    anchorEl={this.state.container}
                    anchorOrigin={{"horizontal":"left","vertical":"bottom" }}
                    targetOrigin={{ "horizontal":"left","vertical":"top" }}
                    onRequestClose={this.handleSearchResultBoxRequestClose}
                    canAutoPosition={false}
                    useLayerForClickAway={false}>
                    <Menu>
                        <MenuItem primaryText="Refresh" />
                        <MenuItem primaryText="Help &amp; feedback" />
                        <MenuItem primaryText="Settings" />
                        <MenuItem primaryText="Sign out" />
                    </Menu>
                </Popover>
            </div>
        );
    }
}

interface SearchComponentProps extends React.Props<SearchComponent> {
    placeHolder?: string;
}

interface SearchComponentState {
    dataSource?: Array<any>;
    inputValue?: string;
    isSearchResultBoxOpen?: boolean;
    container?: any;
    width?: number;
}
