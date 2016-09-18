import * as ClientServices from "./client/services";
import { Kernel, interfaces } from "inversify";

let kernel: Kernel = new Kernel();

kernel.bind<ClientServices.HttpClient>(ClientServices.HttpClient).toSelf();
kernel.bind<ClientServices.UiService>(ClientServices.UiService).toSelf();

function register<T>(identifier: interfaces.ServiceIdentifier<T>, isSeletion: boolean = false) {
    if (isSeletion) {
        kernel.bind<T>(identifier).toSelf().inSingletonScope();
        return;
    }

    kernel.bind<T>(identifier).toSelf();
}

function get<T>(identifier: interfaces.ServiceIdentifier<T>): T {
    return kernel.get<T>(identifier);
}

function getAll<T>(identifier: interfaces.ServiceIdentifier<T>): Array<T> {
    return kernel.getAll<T>(identifier);
}

export {
    register,
    get,
    getAll
}