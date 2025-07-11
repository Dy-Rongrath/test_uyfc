// ================================================================================>> Core Library
import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';

// ================================================================================>> Thrid Party Library

// ================================================================================>> Custom Library
// Core
import { IconsService } from 'app/core/icons/service';

export const provideIcons = (): Array<Provider | EnvironmentProviders> =>
{
    return [
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(IconsService),
            multi   : true,
        },
    ];
};
