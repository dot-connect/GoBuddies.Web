import * as React from 'react';
import { Link } from 'react-router';
import { Paper } from 'material-ui';

// import AuthComponent from './auth/ui/auth.component.tsx';
// import TodoCounter from './todo/ui/todo.counter.tsx';
import LoadingComponent from './common/loading/loading.component.tsx';


export default class MainComponent extends React.Component<{ children: any }, {}> {

    constructor(props) {
        super(props);
    }    

    render() {
        return(
            
            <div>
                <div className="container">
                    <LoadingComponent/>
                    {this.props.children}
                </div>
            </div>
        );
    }

}