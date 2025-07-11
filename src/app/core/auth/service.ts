// ================================================================================>> Core Library
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

// ================================================================================>> Thrid Party Library
// RxJS
import { Observable, ReplaySubject, of, switchMap } from 'rxjs';

// ================================================================================>> Custom Library
// Core
import { AuthUtils } from 'app/core/auth/utils';
import { UserService } from 'app/core/user/service';

// Environment
import { environment as env } from 'environments/environment';

// Local
import { ResponseLogin } from './interface';
import { Role } from './interface';
import { User } from '../user/interface';

    @Injectable({ providedIn: 'root' })
    export class AuthService {
        
    private _baseUrl: string = env.API_BASE_URL;
    private _authenticated: boolean = false;
    private _phone      : ReplaySubject<{ phone: string }>          = new ReplaySubject<{ phone: string }>(1);
    private _password   : ReplaySubject<{ password: string }>       = new ReplaySubject<{ password: string }>(1);
    private _token      : ReplaySubject<{ access_token: string }>   = new ReplaySubject<{ access_token: string }>(1);

    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
    ) { }

    /* -------------------------------------------------------------------------- */
    /*  @ Setter & getter for access token
    /* -------------------------------------------------------------------------- */
    set access_token(access_token: string) {
        const rmbme = localStorage.getItem("rememberMe");
        if (JSON.parse(rmbme)) {
            localStorage.setItem("access_token", access_token);
        }
        else {
            sessionStorage.setItem("access_token", access_token);
        }
    }
    get access_token(): string {
        const rmbme = localStorage.getItem('rememberMe');

        if(JSON.parse(rmbme)){
            sessionStorage.removeItem("access_token");
            return localStorage.getItem("access_token") ?? "";
        }
        localStorage.removeItem("access_token");
        return sessionStorage.getItem("access_token") ?? "";
    }
   
    set phone(value: { phone: string }) {
        this._phone.next(value)
    }

    get phone$(): Observable<{ phone: string }> {
        return this._phone.asObservable();
    }
    
    set password(value: { password: string }) {
        this._password.next(value)
    }

    get password$(): Observable<{ password: string }> {
        return this._password.asObservable();
    }

    set token(value: { access_token: string }) {
        this._token.next(value)
    }

    get token$(): Observable<{ access_token: string }> {
        return this._token.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    signIn(credentials: { phone: string, password: string, rememberMe: boolean }): Observable<ResponseLogin> {
        return this._httpClient.post<ResponseLogin>(`${this._baseUrl}/auth/login`, credentials).pipe(

            switchMap((res: ResponseLogin) => {
                // console.log('responseLogin', res);

                // Store the access token in local storage
                const rmbme = localStorage.getItem('rememberMe');
                if(JSON.parse(rmbme)){
                    localStorage.setItem("access_token", res.access_token);
                }else {
                    sessionStorage.setItem("access_token", res.access_token);
                }
                

                const user: {user: User} = jwt_decode(res?.access_token);
                
                // Set the user in the user service
                this._userService.user = user.user;
                this._userService.setRolesFromResponse(user?.user.roles);
    
                // Extract roles' slugs and store them separately
                const rolesSlugs: string[] = user?.user.roles.map(
                  (role: any) => role.slug
                );
                
                localStorage.setItem('roles', JSON.stringify(rolesSlugs));
    
                // Set default currentRole to the first role in the roles array
                if (rolesSlugs.length > 0) {

                    // Set the current role in localStorage
                    localStorage.setItem('currentRole', rolesSlugs[0]);
                }

                return of(res);
            }),
        );
    }
    /**
     * Sign out
     */
    signOut(): Observable<boolean> {
        localStorage.clear();
        sessionStorage.clear();
        this._authenticated = false; // Update authentication status
        return of(true);
    }

    check(): Observable<boolean> {
        
        if (this.access_token) {
            return of(!AuthUtils.isTokenExpired(this.access_token)); // Check token expiration
        }
        return of(false);
    }
}
