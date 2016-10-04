import * as Models from '../models';

export interface ILoginModel{
    email: string;
    password: string;
}

export interface IRegisterModel {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
}

export interface IRequestNewValidationModel {

}

export interface IValidateAccountModel {

}