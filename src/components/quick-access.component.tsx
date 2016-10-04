import * as React from "react";

import Avatar from "material-ui/Avatar";
import Chip from "material-ui/Chip";
import IconButton from "material-ui/IconButton";
import Activities from "material-ui/svg-icons/maps/local-activity";
import Message from "material-ui/svg-icons/communication/message";

export class QuickAccessComponent extends React.Component<IQuickAccessComponentProps, IQuickAccessComponentState> {

    constructor(props: IQuickAccessComponentProps) {
        super(props);
    }

    onChipTap = (event: any) => {

    }
    
    render(): JSX.Element {
        return (
            <div className="col-group">
                <div>
                    <Chip onTouchTap={this.onChipTap}>
                        <Avatar src="http://www.material-ui.com/images/jsa-128.jpg"
                            size={30} />
                        Hung
                    </Chip>
                    <IconButton tooltip="Activities">
                        <Activities />
                    </IconButton>
                     <IconButton tooltip="Messages">
                        <Message />
                    </IconButton>
                </div>
            </div>
        );
    }
}


interface IQuickAccessComponentProps {

}

interface IQuickAccessComponentState {

}