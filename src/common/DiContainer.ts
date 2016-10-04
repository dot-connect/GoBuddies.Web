import * as ClientServices from './client/services';
import { Kernel, interfaces } from 'inversify';

export default class Composition {

    private static kernel: Kernel = new Kernel();

    public static init() {
        this.kernel.bind<ClientServices.HttpClient>(ClientServices.HttpClient).to(ClientServices.HttpClient);
        this.kernel.bind<ClientServices.UiService>(ClientServices.UiService).toSelf();
    }

    public static registerSelf<T>(identifier: interfaces.ServiceIdentifier<T>, isSingletion: boolean = false) {
        if (isSingletion) {
            this.kernel.bind<T>(identifier).toSelf().inSingletonScope();
            return;
        }

        this.kernel.bind<T>(identifier).toSelf();
    }

    public static registerTo<T>(identifier: interfaces.ServiceIdentifier<T>, identifier2: interfaces.Newable<T>, isSingletion: boolean = false): void {
        if (isSingletion) {
            this.kernel.bind<T>(identifier).to(identifier2).inSingletonScope();
            return;
        }

        this.kernel.bind<T>(identifier).to(identifier2);
    }

    public static registerConstructor<T>(identifier: interfaces.ServiceIdentifier<T>, identifier2: interfaces.Newable<T>): void {
        this.kernel.bind<T>(identifier).toConstructor(identifier2);
    }

    public static get<T>(identifier: interfaces.ServiceIdentifier<T>): T {
        return this.kernel.get<T>(identifier);
    }

    public static getAll<T>(identifier: any): Array<T> {
        return this.kernel.getAll<T>(identifier);
    }
}
