import { HttpRequest } from '@angular/common/http';
import { HelpersMockApiReplyCallback } from 'helpers/mock-api/interface';
import { Observable, of, take, throwError } from 'rxjs';

export class HelpersMockApiHandler
{
    request!: HttpRequest<any>;
    urlParams!: { [key: string]: string };

    // Private
    private _reply: HelpersMockApiReplyCallback = undefined;
    private _replyCount = 0;
    private _replied = 0;

    /**
     * Constructor
     */
    constructor(
        public url: string,
        public delay?: number,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for response callback
     */
    get response(): Observable<any>
    {
        // If the execution limit has been reached, throw an error
        if ( this._replyCount > 0 && this._replyCount <= this._replied )
        {
            return throwError('Execution limit has been reached!');
        }

        // If the response callback has not been set, throw an error
        if ( !this._reply )
        {
            return throwError('Response callback function does not exist!');
        }

        // If the request has not been set, throw an error
        if ( !this.request )
        {
            return throwError('Request does not exist!');
        }

        // Increase the replied count
        this._replied++;

        // Execute the reply callback
        const replyResult = this._reply({
            request  : this.request,
            urlParams: this.urlParams,
        });

        // If the result of the reply callback is an observable...
        if ( replyResult instanceof Observable )
        {
            // Return the result as it is
            return replyResult.pipe(take(1));
        }

        // Otherwise, return the result as an observable
        return of(replyResult).pipe(take(1));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reply
     *
     * @param callback
     */
    reply(callback: HelpersMockApiReplyCallback): void
    {
        // Store the reply
        this._reply = callback;
    }

    /**
     * Reply count
     *
     * @param count
     */
    replyCount(count: number): void
    {
        // Store the reply count
        this._replyCount = count;
    }
}


