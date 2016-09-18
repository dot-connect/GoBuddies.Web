import * as HttpModels from '../models/http-models';
import * as Common from '../common';

import { injectable, inject } from "inversify";

@injectable()
export class UserService {
    private httpClient: Common.Client.Services.HttpClient;

    public constructor(httpClient: Common.Client.Services.HttpClient) {
        this.httpClient = httpClient;
    }

    public async register(data: HttpModels.IRegisterModel): Promise<Common.Client.Models.IResponse> {
        return await this.httpClient.post("http://localhost:5000/Account/Register", data);
    }

    public async login(data: HttpModels.ILoginModel): Promise<Common.Client.Models.IResponse> {
        return await this.httpClient.post("http://localhost:5000/Account/Login", data);
    }

    public async requestNewValidationCode(data: HttpModels.IRequestNewValidationModel): Promise<Common.Client.Models.IResponse> {
        return await this.httpClient.post("http://localhost:5000/Account/ValidationCode", data)
    }
}
    