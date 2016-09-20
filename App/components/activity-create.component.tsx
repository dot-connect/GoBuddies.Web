import * as React from "react";
import * as Rx from "rxjs";

export class CreateActivityComponent extends React.Component<ICreateActivityComponentProps, ICreateActivityComponentState>{
    
    constructor(props: ICreateActivityComponentProps) {
        super(props);
    }

    render(): JSX.Element {
        return (
            <div>
                create activity
            </div>
        );
    }
}

interface ICreateActivityComponentProps extends React.Props<CreateActivityComponent> {

}

interface ICreateActivityComponentState {

}