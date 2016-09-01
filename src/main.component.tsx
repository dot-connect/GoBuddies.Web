import * as React from 'react';
import { Link } from 'react-router';
import { Paper } from 'material-ui';

// import AuthComponent from './auth/ui/auth.component.tsx';
// import TodoCounter from './todo/ui/todo.counter.tsx';
// import LoadingComponent from './common/loading/loading.component.tsx';
import * as Common from './common';


export default class MainComponent extends React.Component<{ children: any }, {}> {

    private controls: {
        modal: Common.Client.Ui.Modal
    }

    constructor(props) {
        super(props);

        this.controls = {
            modal: null
        }
    }    

    componentDidMount() {
        Common.Client.Services.UiService.setModal(this.controls.modal);
    }

    render() {
        return(            
            <div>
                <br />
                <Link to='/login'>Login</Link>&nbsp;
                <Link to='/register'>Register</Link>
                <br />
                <div className="container">
                    <Common.Client.Ui.Modal ref={modal => this.controls.modal = modal}/>
                    {this.props.children}
                </div>
            </div>
        );
    }
}