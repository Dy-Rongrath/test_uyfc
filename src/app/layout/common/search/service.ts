// ================================================================================>> Core Library
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// ================================================================================>> Thrid Party Library
// RxJS
import { Observable, ReplaySubject, tap } from 'rxjs';

// ================================================================================>> Custom Library
import UserBaseUrl from 'app/resources/user/env';

@Injectable({ providedIn: 'root' })
export class SearchService {
    private _close: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _items: ReplaySubject<any> = new ReplaySubject<any>(1);

    constructor(private _httpClient: HttpClient) { }

    set isClose(value: boolean) {
        this._close.next(value);
    }
    get isClose$(): Observable<boolean> {
        return this._close.asObservable();
    }

    get items$(): Observable<any> {
        return this._items.asObservable();
    }

    getSetup(): Observable<any> {
        return this._httpClient.get<any>(`${UserBaseUrl}/search/setup`);
    }

    getKey(params: { key: string }): Observable<any> {
        return this._httpClient.get<any>(`${UserBaseUrl}/search/get-key`, { params: params });
    }

    getItems(params: { key: string, cat_id?: number, org_id?: number, type_id?: number, tag_id?: number, from?: string, to?: string }): Observable<any> {
        return this._httpClient.get<any>(`${UserBaseUrl}/search`, { params: params }).pipe(
            tap((response: any) => {
                this._items.next(response?.data);
            }),
        );
    }

    set itemHistory(value: string[]) {
        localStorage.setItem('history', JSON.stringify(value));
    }
    get itemHistory(): string[] {
        const itemsString = localStorage.getItem('history');
        return JSON.parse(itemsString) ?? [];
    }
}
