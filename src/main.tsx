// import 'bootswatch/paper/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './shared/less/app.less';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Redirect, IndexRoute, browserHistory } from 'react-router';


import MainComponent from './main.component';
import * as Components from './components';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const App = () => (
    <MuiThemeProvider>
        <Router history={browserHistory} >
            <Route path="/" component={MainComponent}>
                <IndexRoute component={Components.HomeComponent}/>
                <Route path="login" component={Components.LoginComponent}/>
                <Route path="register" component={Components.RegisterComponent}/>
                <Route path="activity">
                    <IndexRoute component={Components.ActivityComponent}/>
                    <Route path=":id" component={Components.ActivityDetailComponent}/>
                </Route>
            </Route>
        </Router>
    </MuiThemeProvider>
);

ReactDOM.render((
    <App/>
), document.getElementById("content"));