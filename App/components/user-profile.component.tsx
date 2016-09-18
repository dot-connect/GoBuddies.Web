import * as React from "react";

export class UserProfileComponent extends React.Component<IUserProfileComponentProps, IUserProfileComponentState>{
    constructor(props: IUserProfileComponentProps) {
        super(props);
    }

    

    render(): JSX.Element {
        return (
            <div>
            </div>
        );
    }
}

interface IUserProfileComponentProps extends React.Props<UserProfileComponent>{

}

interface IUserProfileComponentState{

}