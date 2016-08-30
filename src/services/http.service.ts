import * as Common from '../common';

export class HttpClient {
    public static get(uri: string, data?: any) {
        var request: RequestInit = {
            mode: "cors"
        };

        fetch(uri, request);
    }

    public static async  post(uri: string, data?: any): Promise<Common.Web.Models.IResponse> {
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
            var jsonData: Common.Web.Models.IResponse = await result.json();
            return jsonData;
        }
    }
}

