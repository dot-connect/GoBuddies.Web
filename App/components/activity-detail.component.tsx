import * as React from "react";
import * as Rx from "rxjs";
import SwipeableViews from "react-swipeable-views";
import autoPlay from "react-swipeable-views/lib/autoPlay";

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from "material-ui/Card";
import {Tabs, Tab} from "material-ui/Tabs";

import * as Models from "../models/models";
import * as Services from "../services";

export class ActivityDetailComponent extends React.Component<IActivityDetailComponentProps, IActivityDetailComponentState> {
    private activityId: string;
    private activityService: Services.ActivityService;
    private getActivityDetailSubcription: Rx.Subscription;

    constructor(props) {
        super(props);

        this.activityId = props.params.id;
        this.activityService = new Services.ActivityService();
        this.handleInfoTabActive = this.handleInfoTabActive.bind(this);
    }

    componentWillMount(): void {
        this.state = {
            infoTabSelectIndex: 0
        };
    }

    componentDidMount(): void {
        this.getActivityDetailSubcription = Rx.Observable.from(this.activityService.getActivityDetail(this.activityId))
            .subscribe(activity => this.onActivityLoaded(activity));
    }

    componentWillUnmount(): void {
        this.getActivityDetailSubcription.unsubscribe();
        this.getActivityDetailSubcription = null;
    }

    private onActivityLoaded(activity: Models.IActivity) {
        var cards: Array<JSX.Element> = this.getCardsFromMediaActivites(activity.mediaItems);
        this.setState({ mediaCards: cards });
    }

    private getCardsFromMediaActivites(items: Array<Models.IActivityMediaItem>): Array<JSX.Element> {
        var cards: Array<JSX.Element> = new Array<JSX.Element>();
        for (let i: number = 0; i < items.length; i++) {
            var card: JSX.Element = (
                <Card style={{ height: 400 }}>
                    <CardMedia overlay={<CardTitle title={items[i].description}/>}>
                        <img src={items[i].url} />
                    </CardMedia>
                </Card>
            );

            cards.push(card);
        }

        return cards;
    }    

    private handleInfoTabActive(index: number) {
        this.setState({ infoTabSelectIndex: index });
    }

    render(): JSX.Element {
        const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
        
        return (
            <div style={{ margin: "0 auto" }}>
                <div>
                    <AutoPlaySwipeableViews>
                        {this.state.mediaCards}
                    </AutoPlaySwipeableViews>
                </div>
                <div style={{ marginTop: 20 }}>
                    <Tabs onChange={this.handleInfoTabActive}
                        value={this.state.infoTabSelectIndex}>
                        <Tab label="Infomation" value={0} />
                        <Tab label="Contents" value={1} />
                        <Tab label="Resources" value={2} />
                         <Tab label="Map" value={3} />
                    </Tabs>
                    <SwipeableViews index={this.state.infoTabSelectIndex}>
                        <div style={{ background: "#FEA900" }}>
Within Editor, some block types are given default CSS styles to limit the amount of basic configuration required to get engineers up and running with custom editors.

By defining a blockStyleFn prop function for an Editor, it is possible to specify classes that should be applied to blocks at render time.
                        </div>
                        <div style={{ background: "#B3DC4A" }}>
                           The Draft library includes default block CSS styles within DraftStyleDefault.css. (Note that the annotations on the CSS class names are artifacts of Facebook's internal CSS module management system.)

These CSS rules are largely devoted to providing default styles for list items, without which callers would be responsible for managing their own default list styles.

                        </div>
                        <div style={{ background: "#6AC0FF" }}>
                          The blockStyleFn prop on Editor allows you to define CSS classes to style blocks at render time. For instance, you may wish to style 'blockquote' type blocks with fancy italic text
                        </div>
                    </SwipeableViews>
                </div>
            </div>
        );
    }
}

interface IActivityDetailComponentProps {

}

interface IActivityDetailComponentState {
    mediaCards?: Array<JSX.Element>;
    infoTabSelectIndex?: number;
}