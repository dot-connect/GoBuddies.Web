import './shared/less/app.less';
import 'reflect-metadata';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Redirect, IndexRoute, browserHistory } from 'react-router';

import MainComponent from './main.component';
import * as Components from './components';
import * as DiConfig from './di.config';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import * as EditorCore from './components/editor';
import Editor from './components/editor/examples/basic';

injectTapEventPlugin();

EditorCore.init();
DiConfig.init();

const muiTheme = getMuiTheme({

});


const App = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={browserHistory} >
            <Route path="/" component={MainComponent}>
                <IndexRoute component={Components.HomeComponent}/>
                <Route path="login" component={Components.LoginComponent}/>
                <Route path="register" component={Components.RegisterStepperComponent}/>
                <Route path="activity">
                    <IndexRoute component={Components.ActivityComponent}/>
                    <Route path=":id" component={Components.ActivityDetailComponent}/>
                </Route>
            </Route>
        </Router>
    </MuiThemeProvider>
);

ReactDOM.render((
    <MuiThemeProvider muiTheme={muiTheme}>
            <Editor/>
     </MuiThemeProvider>   
), document.getElementById('content'));

