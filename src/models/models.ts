export type gender = "male" | "female"; 
export type validationMethod = "email" | "sms";

export interface IUser{
    id: string;
    userName: string;
    email: string;
    lastName: string;
    firstName: string;
    avartarUrl: string;
}

export interface IActivityMediaItem{
    description?: string;
    url?: string;
}

export interface IActivity{
    id: string;
    name: string;
    dateTime: Date;
    ownedUser: IUser,
    mediaItems?: Array<IActivityMediaItem> 
}

