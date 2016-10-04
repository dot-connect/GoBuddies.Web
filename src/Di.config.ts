import * as Common from './common';
import * as Services from './services';

function init(): void {
    Common.Composition.registerSelf<Services.ActivityService>(Services.ActivityService, false);
    Common.Composition.registerSelf<Services.UserService>(Services.UserService, false);
    Common.Composition.registerSelf<Services.ClientService>(Services.ClientService, true);
}

export {
    init
}
