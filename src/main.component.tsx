import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Paper } from 'material-ui';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MapsLocalActivity from 'material-ui/svg-icons/maps/local-activity';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover/Popover';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import * as Components from './components';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';


import * as Common from './common';


export default class MainComponent extends React.Component<IMainComponentProps, IMainComponentState> {

    private controls: {
        loginBnt: RaisedButton
    }

    constructor(props) {
        super(props);
    }    

    componentDidMount(): void {
    }

    render() {
        return (
            <div>
                <Toolbar >
                    <ToolbarGroup firstChild={true}>
                        <IconButton touch={true}>
                            <NavigationExpandMoreIcon />
                        </IconButton>
                        <TextField hintText="Search"/>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarSeparator />
                        <RaisedButton label="Login" primary={true} linkButton={true} containerElement={<Link to={'login'}/>}/>
                        <RaisedButton label="Register" primary={true} linkButton={true} containerElement={<Link to={'register'}/>}/>
                    </ToolbarGroup>
                </Toolbar>
                <div className={'content'}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

interface IMainComponentProps extends React.Props<MainComponent>{

}

interface IMainComponentState {
}