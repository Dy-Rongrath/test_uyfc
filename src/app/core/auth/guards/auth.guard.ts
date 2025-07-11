// ================================================================================>> Core Library
import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

// ================================================================================>> Thrid Party Library
// RxJS
import { of, switchMap }    from 'rxjs';

// ================================================================================>> Custom Library
// Core
import { AuthService }      from 'app/core/auth/service';

export const AuthGuard: CanActivateFn | CanActivateChildFn = () => {
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(AuthService).check().pipe(
        switchMap((authenticated) => {
            // If the user is not authenticated...
            if (!authenticated) {

                // Redirect to the sign-in page with a redirectUrl param
                const urlTree = router.parseUrl(`auth/sign-in`);
                return of(urlTree);
            }
            
            // Allow the access
            return of(true);
        }),
    );
};

