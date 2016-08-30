// import 'bootswatch/paper/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './main.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Redirect, IndexRoute, browserHistory } from 'react-router';


import MainComponent from './main.component';
import * as Components from './components';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const App = () => (
    <MuiThemeProvider>
        <Router history={browserHistory} >
            <Route path="/" component={MainComponent}>
                <IndexRoute component={Components.RegisterComponent}/>
            </Route>
        </Router>
    </MuiThemeProvider>
);

ReactDOM.render((
    <App/>
), document.getElementById('content'));