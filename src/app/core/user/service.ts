import { Injectable }       from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { User }             from 'app/core/user/interface';
import { Role }             from '../auth/interface';
import { ResponseLogin }    from '../auth/interface';
import { HttpClient }       from '@angular/common/http';
import { environment as env } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(
        private httpClient: HttpClient
    ) { }
    
    // @Inject private constructor for testing
    private _user   : ReplaySubject<User> = new ReplaySubject<User>(1);
    private _roles  : Role[] = [];

    set user(value  : User) {
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // get user$(): Observable<User> {
    //     return this.httpClient.get<any>(
    //         `${env.API_BASE_URL}/my-profile`
    //     );
    // }


    getUser(): User | null {
        let currentUser: User | null = null;
        this._user.subscribe(user => currentUser = user).unsubscribe();
        return currentUser;
    }
    

    setRolesFromResponse(roles: any) {
        if(roles?.length > 0 && roles){   
            this._roles = roles;
        }
    }

    
    get roles(): Role[] {
        return this._roles;
    }
}

