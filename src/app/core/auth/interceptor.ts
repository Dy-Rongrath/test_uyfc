// ================================================================================>> Core Library
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

// ================================================================================>> Thrid Party Library
// RxJS
import { catchError, Observable, throwError } from 'rxjs';

// ================================================================================>> Custom Library
// Core
import { AuthService } from 'app/core/auth/service';
import { AuthUtils } from 'app/core/auth/utils';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    // Clone the request object
    let newReq = req.clone();

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    if (authService.access_token && !AuthUtils.isTokenExpired(authService.access_token)) {

        // Add Authorization header with the access token to the request
        newReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authService.access_token),
        });
    }

    // Response
    return next(newReq).pipe(
        catchError((error) => {
            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Sign out
                
                authService.signOut();

                // Reload the app
                location.reload();
            }

            return throwError(() => error);
        }),
    );
};

