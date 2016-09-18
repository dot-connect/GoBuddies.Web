import * as Models from '../models';
import { injectable, inject } from "inversify";

@injectable()
export class HttpClient {
    public get(uri: string, data?: any) {
        var request: RequestInit = {
            mode: "cors"
        };

        fetch(uri, request);
    }

    public async  post(uri: string, data?: any): Promise<Models.IResponse> {
        var request: RequestInit = {
            method: "post",
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:5000",
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        var result: Response = await fetch(uri, request);
        if (result.ok) {
            var jsonData: Models.IResponse = await result.json();
            return jsonData;
        }
    }
}

