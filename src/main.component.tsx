import * as React from 'react';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

import * as Common from './common';
import * as Services from './services';
import * as Components from './components';

export default class MainComponent extends React.Component<IMainComponentProps, IMainComponentState> {
    private clientService: Services.ClientService;

    private controls: {
        loginBnt: RaisedButton
    };

    constructor(props: IMainComponentProps) {
        super(props);

        this.clientService = Common.Composition.get<Services.ClientService>(Services.ClientService);
    }   

    private componentWillMount(): void {
        this.state = {
            authenticationComponent: null
        };

        this.clientService.isAuthenticated.subscribe(value => this.onIsAuthenticatedChanged(value));
    }

    private componentDidMount(): void {
        this.clientService.isAuthenticated.next(true);
    }

    private componentWillUnmount(): void {
        this.clientService.isAuthenticated.unsubscribe();
    }

    private onIsAuthenticatedChanged(value: boolean): void {
        let element: JSX.Element = this.getLoginComponentByValue(value);
        this.setState({ authenticationComponent: element });
    }

    private getLoginComponentByValue(value: boolean): JSX.Element {
        if (value === true) {
            return <Components.QuickAccessComponent />;
        } else {
            return (
                <div>
                    <RaisedButton label="Login"
                        primary={true}
                        linkButton={true}
                        containerElement={<Link to={'login'} />} />
                    <RaisedButton label="Register"
                        primary={true}
                        linkButton={true}
                        containerElement={<Link to={'register'} />} />
                </div>
            );
        }
    }

    render(): JSX.Element {
        return (
            <div>
                <Toolbar >
                    <ToolbarGroup firstChild={true}>
                        <IconButton touch={true}>
                            <NavigationExpandMoreIcon />
                        </IconButton>
                        <TextField hintText="Search" />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarSeparator />
                        {this.state.authenticationComponent}
                    </ToolbarGroup>
                </Toolbar>
                <div className={'content'}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

interface IMainComponentProps extends React.Props<MainComponent> {

}

interface IMainComponentState {
    authenticationComponent?: JSX.Element;
}
