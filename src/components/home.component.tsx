import * as React from 'react';

export class HomeComponent extends React.Component<IHomeComponentProps, IHomeComponentState> { 
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>haha</div>
        );
    }    
}

interface IHomeComponentProps{
}

interface IHomeComponentState {
    valid: boolean;
    description: string;
}