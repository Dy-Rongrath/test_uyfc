// ================================================================================>> Core Library
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// ================================================================================>> Thrid Party Library
// RxJS
import { Observable, ReplaySubject, tap } from 'rxjs';

// ================================================================================>> Custom Library
// Core
import { Navigation     } from 'app/core/navigation/interface';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    constructor(private _httpClient: HttpClient) { }

    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    getGroupManagerNavigation(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/navigation/groupmanager').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            }),
        );
    }

    getMemberNavigation(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/navigation/member').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            }),
        );
    }

    getBranchManagerNavigation(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/navigation/branchmanager').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            }),
        );
    }

    getBranchMemberNavigation(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/navigation/branchmember').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            }),
        );
    }

    getSuperAdminNavigation(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/navigation/superadmin').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            }),
        );
    }
}
