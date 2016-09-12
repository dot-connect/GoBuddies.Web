import * as React from 'react';
import * as Components from './';

export class HomeComponent extends React.Component<IHomeComponentProps, IHomeComponentState> { 
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Components.ActivityComponent />
            </div>
        );
    }    
}

interface IHomeComponentProps{
}

interface IHomeComponentState {
    valid: boolean;
    description: string;
}