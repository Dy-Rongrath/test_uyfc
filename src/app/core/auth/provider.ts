// ================================================================================>> Core Library
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, makeEnvironmentProviders, Provider } from '@angular/core';

// ================================================================================>> Thrid Party Library

// ================================================================================>> Custom Library
// Core
import { authInterceptor }  from 'app/core/auth/interceptor';
import { AuthService }      from 'app/core/auth/service';

export const provideAuth = (): EnvironmentProviders => {
    return makeEnvironmentProviders([
        provideHttpClient(withInterceptors([authInterceptor])),
        {

            // Initialize AuthService on app initialization
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(AuthService),
            multi   : true,
        }
    ]);
};
