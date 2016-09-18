import * as Common from "./common";
import * as Services from "./services";

function init(): void {
    Common.DiContainer.register<Services.ActivityService>(Services.ActivityService, false);
    Common.DiContainer.register<Services.UserService>(Services.UserService, false);
    Common.DiContainer.register<Services.ClientService>(Services.ClientService, true);
}

export {
    init
}