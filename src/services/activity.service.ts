import * as Models from '../models/models';

import { injectable, inject } from 'inversify';

@injectable()
export class ActivityService {
    public async getActivities(): Promise<Array<Models.IActivity>> {
        let activities = new Array<Models.IActivity>();
        for (let i = 0; i < 10; i++) {
            let user: Models.IUser = {
                id: i.toString(),
                userName: 'HungDL',
                email: 'hungdl.uit@gmail.com',
                lastName: 'dao luong',
                firstName: 'hung',
                avartarUrl: 'http://www.material-ui.com/images/jsa-128.jpg'
            };

            let activity: Models.IActivity = {
                name: 'Viet Nam Web Submit 2016',
                dateTime: null,
                ownedUser: user,
                id: i.toString()
            };

            activities.push(activity);
        }

        return await Promise.resolve(activities);
    }

    public async getActivityDetail(id: string): Promise<Models.IActivity> {
        let user: Models.IUser = {
            id: 'aaa',
            userName: 'HungDL',
            email: 'hungdl.uit@gmail.com',
            lastName: 'dao luong',
            firstName: 'hung',
            avartarUrl: 'http://www.material-ui.com/images/jsa-128.jpg'
        };

        let mediaItems: Array<Models.IActivityMediaItem> = [
            { description: 'Staff that are well trained provide this consistently', url: 'http://www.thehospitalitytrainingcompany.com/attachments/Image/customer_training.jpg' },
            { description: 'Laméris Ootech BV, Diensten', url: 'http://www.ootech.nl/mysite/modules/SFIL0100/504_lantech-consultancy.jpg' },
            { description: 'Investment: Investment Banking', url: 'http://financetraining.com/wp-content/uploads/2011/07/Certificate-Lady.jpg' },
            { description: 'Provide QI Training and Resources to Staff', url: 'http://dudleymind.org.uk/wp-content/uploads/2014/09/Legionella-Training-Aqua-Legion.jpg' },
            { description: 'Training - ASSA ABLOY New Zealand', url: 'http://www.assaabloy.co.nz/presets/medium/Local/AU/OWNA%20Images/1000-Training.jpg' }
        ];      

        let activity: Models.IActivity = {
            name: 'Viet Nam Web Submit 2016',
            dateTime: null,
            ownedUser: user,
            id: id,
            mediaItems: mediaItems
        };

        return await Promise.resolve(activity);
    }
}
