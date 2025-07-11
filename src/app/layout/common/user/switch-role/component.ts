import { ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule }         from '@angular/common';
import { MatIconModule }        from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService }          from 'app/core/auth/service';
import { NavigationService }    from 'app/core/navigation/service';
import { Router }               from '@angular/router';
import { Subject }              from 'rxjs';
import { takeUntil }            from 'rxjs/operators';
import { Role }                 from 'app/core/auth/interface';
import { NotificationsComponent } from '../../notifications/component';
import { SystemRole }           from '../role.enum';

const roleServiceMap = {

    'SuperAdmin': {
        navigationServiceMethod: 'getSuperAdminNavigation',
        notificationsServiceMethod: 'getAll',
    },
    'BranchManager': {
        navigationServiceMethod: 'getBranchManagerNavigation',
        notificationsServiceMethod: 'getAll',
    },
    'BranchMember': {
        navigationServiceMethod: 'getBranchMemberNavigation',
        notificationsServiceMethod: 'getAll',
    },
    'GroupManager': {
        navigationServiceMethod: 'getGroupManagerNavigation',
        notificationsServiceMethod: 'getAll',
    },
    'Member': {
        navigationServiceMethod: 'getMemberNavigation',
        notificationsServiceMethod: 'getAll',
    },

};

@Component({
    selector    : 'layout-user-switch-role',
    standalone  : true,
    templateUrl : './template.html',
    styleUrls   : ['./style.scss'],
    imports     : [
        CommonModule,
        MatIconModule,
        MatDialogModule,
    ]
})
export class SwitchRoleComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    public roles        : Role[] = [];
    public selectedRole : Role;
    userRoles: any[] = []; 
    disableRoleSwitch: boolean = false; // Add property to track disabled stat

    @Output() roleChanged = new EventEmitter<string>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef          : MatDialogRef<SwitchRoleComponent>,
        private _changeDetectorRef  : ChangeDetectorRef,
        private _authService        : AuthService,
        private _router             : Router,
        private _navigationService  : NavigationService,
    ) {}

    ngOnInit(): void {
        // Get roles from localStorage
        const storedRoles = localStorage.getItem('roles');
        if (storedRoles) {
            this.roles = JSON.parse(storedRoles).map((slug: string) => ({
                id: 0, // Default or fetch ID if needed
                name: this.formatRoleName(slug), // Formatting name
                slug,
                is_default: false,
            }));
        }
        // Get current role from localStorage
        const currentRoleSlug = localStorage.getItem('currentRole');
        this.selectedRole = this.roles.find(role => role.slug === currentRoleSlug);

        // Deactivate all roles initially
        this.roles.forEach(role => role['active'] = 0);

        // Activate the current role
        if (this.selectedRole) {
            this.selectedRole['active'] = 1;
        }

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // Unsubscribe from all subscriptions
    setActive(role: any): void {

        if (this.disableRoleSwitch) {
            return; // Do nothing if role switch is disabled
        }

        this.roles.forEach(r => r['active'] = 0);
        role['active'] = 1;
        this.selectedRole = role;
        const roleConfig = roleServiceMap[role.slug];

        // Set the current role in localStorage
        localStorage.setItem('currentRole', role.slug);
        if (!roleConfig) {
            this.signOut();
            return;
        }

        this._navigationService[roleConfig.navigationServiceMethod]().subscribe(() => {
            let navigateUrl = '';

            // Navigate to the respective dashboard based on the selected role
            switch (this.selectedRole.slug) {

                case 'SuperAdmin':
                    navigateUrl = '/superadmin/dashboard';
                    break;

                case SystemRole.BranchManager:
                    navigateUrl = '/branchmanager/dashboard';
                    break;

                case SystemRole.BranchMember:
                    navigateUrl = '/branchmember/dashboard';
                    break;

                case SystemRole.GroupManager:
                    navigateUrl = '/groupmanager/dashboard';
                    break;
                    
                case SystemRole.Member:
                    navigateUrl = '/account';
                    break;

                default:
                    navigateUrl = '';
            }
            this._router.navigateByUrl(navigateUrl).then(() => {
                window.location.reload();
            });
            this._dialogRef.close();
        });
    }

    signOut(): void {
        this._authService.signOut().subscribe(() => {
            this._router.navigateByUrl('/auth/sign-in');
        });
    }

    // Method to return CSS classes based on role slug
    getRoleStyles(slug: string): string[] {
        switch (slug) {

            case 'SuperAdmin':
                return ['text-red-500', 'bg-red-200'];

            case 'BranchManager':
                return ['text-green-600', 'bg-green-200'];

            case 'BranchMember':
                return ['text-blue-500', 'bg-blue-200'];

            case 'GroupManager':
                return ['text-yellow-600', 'bg-yellow-200'];

            case 'Member':
                return ['text-yellow-600', 'bg-yellow-200'];

            default:
                return ['text-gray-500', 'bg-gray-200'];
        }
    }

    // Method to format role name to display in UI
    private formatRoleName(slug: string): string {
        switch (slug) {
            
            case 'SuperAdmin':
                return 'អភិបាលប្រព័ន្ធ';

            case 'BranchManager':
                return 'ប្រធានសាខា';

            case 'BranchMember':
                return 'សមាជិកសាខា';

            case 'GroupManager':
                return 'អ្នកគ្រប់គ្រងក្រុម';  

            case 'Member':
                    return 'សមាជិក';  
    
            default:
                return slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    }
}
