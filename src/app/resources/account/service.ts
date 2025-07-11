// ================================================================================>> Core Library
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';;

// ================================================================================>> Thrid Party Library
// RxJS
import { Observable } from 'rxjs';
// ================================================================================>> Custom Library
// Environment
import { environment as env } from 'environments/environment';

// Local
import { ReqUpdatePassword, ReqUpdateProfile, ResUpdatePassword, ResUpdateProfile, ReqUpdateSignature, ResponseSetup, ResGenerate2FA, ReqVerify2FA, Profile, UpdateProfile } from './interface';

@Injectable({ providedIn: 'root' })
export class AccountService {

    private readonly _url: string = env.API_BASE_URL;
    private readonly _httpOptions = {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };

    // ==================== Get data-setup
    setup(): Observable<ResponseSetup> {
        return this.http.get<ResponseSetup>(this._url + '/users/data-setup', this._httpOptions);
    }

    getDataSetupUserTitle(): Observable<any> {
        return this.http.get<any>(this._url+ `/setup/user-title`);     
    }

    constructor(
        private readonly http: HttpClient,
    ) {}
    
        // ==================== Update Profile
    updateProfile(data: UpdateProfile): Observable<UpdateProfile> {
        return this.http.put<UpdateProfile>(this._url + '/my-profile/update', data, this._httpOptions);
    }

    getProfile (): Observable<Profile>{
        return this.http.get<Profile>(this._url + '/my-profile', this._httpOptions);
    }

    // updateProfile (): Observable<Profile>{
    //     return this.http.get<Profile>(this._url + '/my-profile', this._httpOptions);
    // }
    // ==================== Update Signature
    // updateSignature(data: ReqUpdateSignature): Observable<ResUpdateSignature> {
    //     return this.http.put<ResUpdateSignature>(this._url + '/profile/signature', data, this._httpOptions);
    // }

    // ==================== Generate 2FA QR
    // generate2FA(): Observable<ResGenerate2FA> {
    //     return this.http.post<ResGenerate2FA>(this._url + '/auth/2fa/generate', this._httpOptions);
    // }
    
    // ==================== Verify 2FA  
    // verify2FA(data: ReqVerify2FA): Observable<ResVerify2FA> {
    //     return this.http.post<ResVerify2FA>(this._url + '/auth/2fa/authenticate', data, this._httpOptions);
    // }
    
    // =================== Update password
    updatePassword(data: ReqUpdatePassword): Observable<ResUpdatePassword> {
        return this.http.put<ResUpdatePassword>(this._url + '/my-profile/update-password', data, this._httpOptions);
    }

}
