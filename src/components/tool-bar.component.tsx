import * as React from 'react';

import {SearchComponent} from './search.component';
import RaisedButton from 'material-ui/RaisedButton';


export class ToolBarComponent extends React.Component<IToolBarComponentProps, IToolBarState> {
    render() {
        return (
            <div style={{ zIndex: 1000, backgroundColor: 'red', width: '100%' }}>
                <div className={'column-div'}>
                    <SearchComponent/>
                </div>
                <div className={'column-div'}>
                    <div className={'column-div'}>
                        <label>Email</label>
                        <input/>
                    </div>
                    <div className={'column-div'}>
                        <label>Password</label>
                        <input/>
                    </div>
                    <div className={'column-div'}>
                        <RaisedButton label={'Login'}/>
                        <RaisedButton label/>
                    </div>
                </div>
            </div>
        );
    }
}

interface  IToolBarComponentProps extends React.Props<ToolBarComponent> {
    
}

interface IToolBarState {

}