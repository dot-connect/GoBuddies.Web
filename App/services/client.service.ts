import * as Rx from "rxjs";
import { injectable } from "inversify";

@injectable()
export class ClientService {
    public isAuthenticated: Rx.BehaviorSubject<boolean>;

    public constructor() {
        this.isAuthenticated = new Rx.BehaviorSubject<boolean>(false);
    }
}