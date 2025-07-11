// ================================================================================>> Core Library
import { inject }                                       from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router }    from '@angular/router';

// ================================================================================>> Thrid Party Library
// RxJS
import { of, switchMap }    from 'rxjs';

// ================================================================================>> Custom Library
// Core
import { AuthService }      from 'app/core/auth/service';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (_route, _state) => {
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(AuthService).check().pipe(

        switchMap((authenticated) => {
            // If the user is authenticated...
            if (authenticated) {

                return of(router.parseUrl(''));
            }
            
            // Allow the access
            return of(true);
        }),
    );
};
    