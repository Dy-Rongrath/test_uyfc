// ================================================================================>> Core Library
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// ================================================================================>> Thrid Party Library
// Transloco
import { Translation, TranslocoLoader } from '@ngneat/transloco';

// RxJS
import { Observable } from 'rxjs';

// ================================================================================>> Custom Library

@Injectable({providedIn: 'root'})
export class TranslocoHttpLoader implements TranslocoLoader
{
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get translation
     *
     * @param lang
     */
    getTranslation(lang: string): Observable<Translation>
    {
        return this._httpClient.get<Translation>(`./assets/i18n/${lang}.json`);
    }
}
