import * as Services from './index';
import * as HttpModels from '../models/http-models';
import * as Common from '../common';

export class UserService {

    constructor() {
    }

    public async register(data: HttpModels.IRegisterModel): Promise<Common.Web.Models.IResponse> {
        return await Services.HttpClient.post("http://localhost:5000/Account/Register", data);
    }

     public async login(data: HttpModels.ILoginModel): Promise<Common.Web.Models.IResponse> {
        return await Services.HttpClient.post("http://localhost:5000/Account/Login", data);
    }
}
    