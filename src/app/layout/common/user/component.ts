// ================================================================================>> Core Library
import { NgClass, NgFor, NgIf }     from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink }       from '@angular/router';

// ================================================================================>> Thrid Party Library
import { MatButtonModule }  from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule }    from '@angular/material/icon';
import { MatMenuModule }    from '@angular/material/menu';
import jwt_decode           from 'jwt-decode';
// RxJS
import { Subject, takeUntil } from 'rxjs';

// ================================================================================>> Custom Library
// Core
import { AuthService }  from 'app/core/auth/service';
import { User }         from 'app/core/user/interface';
import { UserService }  from 'app/core/user/service';
import { Role }         from 'app/core/auth/interface';

// Environment
import { environment as env }           from 'environments/environment';
import { MatDialog, MatDialogConfig }   from '@angular/material/dialog';
import { SwitchRoleComponent }          from './switch-role/component';
import { ProfileComponent }             from 'app/resources/account/profile/component';

@Component({
    selector    : 'user',
    templateUrl : './template.html',
    exportAs    : 'user',
    standalone  : true,
    imports     : [
        MatButtonModule, 
        MatMenuModule, 
        NgIf, 
        MatIconModule, 
        RouterLink, 
        MatDividerModule
    ],
})

export class UserComponent implements OnInit, OnDestroy {

    @Input() showAvatar: boolean = true;
    user: User;
    role: string;
    storedRole: string;
    fileUrl = env.FILE_BASE_URL;
    staticImg: string = 'assets/images/logo/avatar.png';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    userRoles: string[] = []; 
    disableRoleSwitch: boolean = false; 

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _authService: AuthService,
        private _userService: UserService,
        private _router     : Router,
        private _matDialog  : MatDialog
    ) { }
    ngOnInit(): void {

        // Subscribe to user changes
        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
            this.user = user;
            this.userRoles = user.roles.map(role => role.name);
            this.disableRoleSwitch = this.userRoles.length < 2;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Fetch roles from localStorage
        const role = localStorage.getItem('currentRole');
        if (role) {
            this.role = role;
        }

        // Initialize userRoles here or fetch from a service
        this.userRoles = this.getUserRole();
        this.disableRoleSwitch = this.userRoles.length < 2; // Disable role switch if only one role
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    viewSwitchRole(): void {

        if (this.userRoles.length < 2) {
            return; // Do nothing if the user has only one role
        }

        const dialogConfig      = new MatDialogConfig();
        // dialogConfig.data = this.user.organizations;
        dialogConfig.autoFocus  = false;
        dialogConfig.position   = { right: '0px' };
        dialogConfig.height     = '100dvh';
        dialogConfig.width      = '100dvw';
        dialogConfig.maxWidth   = '570px'
        dialogConfig.panelClass = 'mat-dialog-switch-role';
        dialogConfig.enterAnimationDuration = '0s';
        this._matDialog.open(SwitchRoleComponent, dialogConfig);
    }

    signOut(): void {
        this._authService.signOut();
        this._router.navigateByUrl('/auth/sign-in');
    }

    profile(): void {
        // this._authService.profile();
        this._router.navigateByUrl('/auth/profile');
    }

   // Method to return a list of user roles (array of strings)
    getUserRole(): string[] {
        const roles: string[] = [];

        // Here, add roles as strings to the array
        switch (this.role) {
            case 'SuperAdmin':
                roles.push('អភិបាលប្រព័ន្ធ');
                break;
            case 'BranchManager':
                roles.push('ប្រធានសាខា');
                break;
            case 'BranchMember':
                roles.push('សមាជិកសាខា');
                break;
            case 'GroupManager':
                roles.push('អ្នកគ្រប់គ្រងក្រុម');
                break;
            case 'Member':
                roles.push('សមាជិក');
                break;
            default:
                roles.push(this.storedRole);
                break;
        }
        
        return roles; // Return an array of roles
    }
}
