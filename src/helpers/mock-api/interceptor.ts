import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HELPERS_MOCK_API_DEFAULT_DELAY } from 'helpers/mock-api/constants';
import { HelpersMockApiService } from 'helpers/mock-api/service';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';

export const mockApiInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> =>
{
    const defaultDelay = inject(HELPERS_MOCK_API_DEFAULT_DELAY);
    const helpersMockApiService = inject(HelpersMockApiService);

    // Try to get the request handler
    const {
        handler,
        urlParams,
    } = helpersMockApiService.findHandler(request.method.toUpperCase(), request.url);

    // Pass through if the request handler does not exist
    if ( !handler )
    {
        return next(request);
    }

    // Set the intercepted request on the handler
    handler.request = request;

    // Set the url params on the handler
    handler.urlParams = urlParams;

    // Subscribe to the response function observable
    return handler.response.pipe(
        delay(handler.delay ?? defaultDelay ?? 0),
        switchMap((response) =>
        {
            // If there is no response data,
            // throw an error response
            if ( !response )
            {
                response = new HttpErrorResponse({
                    error     : 'NOT FOUND',
                    status    : 404,
                    statusText: 'NOT FOUND',
                });

                return throwError(response);
            }

            // Parse the response data
            const data = {
                status: response[0],
                body  : response[1],
            };

            // If the status code is in between 200 and 300,
            // return a success response
            if ( data.status >= 200 && data.status < 300 )
            {
                response = new HttpResponse({
                    body      : data.body,
                    status    : data.status,
                    statusText: 'OK',
                });

                return of(response);
            }

            // For other status codes,
            // throw an error response
            response = new HttpErrorResponse({
                error     : data.body.error,
                status    : data.status,
                statusText: 'ERROR',
            });

            return throwError(response);
        }));
};
