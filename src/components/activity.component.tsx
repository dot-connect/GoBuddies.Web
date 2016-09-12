import * as React from 'react';
import * as Rx from 'rxjs-es/src/rx';
import { Link } from 'react-router';
import * as Layout from '../common/client/ui/layout';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import * as Models from '../models/models';
import * as Services from '../services';


export class ActivityComponent extends React.Component<IActivityComponentProps, IActivityComponentState> {
    private activityService: Services.ActivityService;
    private getActivitySubcription: Rx.Subscription;

    constructor(props) {
        super(props);
        this.activityService = new Services.ActivityService();
    }

    componentWillMount(): void {        
        this.props = {
            activities: null
        };

        this.state = {
            rows: null
        };
    }

    componentDidMount(): void {
        this.getActivitySubcription = Rx.Observable.from(this.activityService.getActivities())
                                                   .subscribe(activities => {
                                                        this.props.activities = activities;
                                                        this.updateRows();
                                                   });
    }

    componentWillUnmount(): void {
        this.getActivitySubcription.unsubscribe();
        this.getActivitySubcription = null;
    }

    private updateRows(): void {
        var cards = this.props.activities.map(activity => this.getCardFromActivity(activity));
        var dives = this.renderRowsFromItems(cards, 3);
        this.setState({ rows: dives });
    }

    private getCardFromActivity(activity: Models.IActivity): JSX.Element {
        return (
            <Card>
                <CardHeader title={activity.ownedUser.lastName}
                    avatar={activity.ownedUser.avartarUrl}
                    subtitle={activity.ownedUser.email}/>
                <CardMedia overlay={<CardTitle title={activity.name} subtitle={activity.dateTime} />}>
                    <img src="http://www.material-ui.com/images/nature-600-337.jpg" />                   
                </CardMedia>
                <CardActions>
                    <Link to={`/activity/${activity.id}`}>Detail...</Link>
                </CardActions>
            </Card>
        );
    }

    private renderRowsFromItems(items: Array<JSX.Element>, rowCount: number): Array<JSX.Element> {
        var p = 1 / rowCount;
        var dives: Array<JSX.Element> = new Array<JSX.Element>();
        var rowCells: Array<JSX.Element>;
        for (var i = 0; i < items.length; i++) {
            if (i % rowCount == 0) {
                if (rowCells != null && rowCells.length != 0) {
                    dives.push(<div>{rowCells}</div>);   
                }

                rowCells = new Array<JSX.Element>();
            }

            if (i / rowCount < rowCount) {               
                var cell = <Layout.Cell inline={true} width={p} min={256} padding={4}>{items[i]}</Layout.Cell>;
                rowCells.push(cell);
            }
        }

        return dives;
    }

    render() {
       
        return (
            
            <Layout.Grid gutter={8}>
                {this.state.rows}
            </Layout.Grid>
        );
    }
}

interface IActivityComponentProps{
    activities?: Array<Models.IActivity>
}

interface IActivityComponentState{
    rows: Array<JSX.Element>;
}