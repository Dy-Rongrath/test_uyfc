import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import jwt_decode from 'jwt-decode';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// RxJS
import { Subject, takeUntil } from 'rxjs';

// Custom Library
import { Navigation } from 'app/core/navigation/interface';
import { NavigationService } from 'app/core/navigation/service';
import { UserService } from 'app/core/user/service';

// Layout
import { LanguagesComponent } from 'app/layout/common/languages/component';
import { NotificationsComponent } from 'app/layout/common/notifications/component';
import { SearchComponent } from 'app/layout/common/search/component';
import { UserComponent } from 'app/layout/common/user/component';

// Helper
import { HelpersFullscreenComponent } from 'helpers/components/fullscreen';
import { HelpersLoadingBarComponent } from 'helpers/components/loading-bar';
import { HelpersNavigationService, HelpersNavigationComponent } from 'helpers/components/navigation';
import { HelpersMediaWatcherService } from 'helpers/services/media-watcher';
import { LoadingComponent } from 'helpers/shared/loading/component';
import { AuthService } from 'app/core/auth/service';

@Component({
    selector: 'dense-layout',
    templateUrl: './template.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        LoadingComponent,
        HelpersNavigationComponent,
        MatButtonModule,
        MatIconModule,
        LanguagesComponent,
        HelpersFullscreenComponent,
        UserComponent,
        NgIf,
        RouterOutlet
    ]
})
export class DenseLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    role: string;
    storedRole: string;
    navigationAppearance: 'default' | 'dense' = 'default';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _navigationService: NavigationService,
        private _helpersMediaWatcherService: HelpersMediaWatcherService,
        private _helpersNavigationService: HelpersNavigationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService,
        private _authService: AuthService,
    ) { }

    ngOnInit(): void {
        // Subscribe to navigation data
        this._navigationService.navigation$.pipe(takeUntil(this._unsubscribeAll)).subscribe((navigation: Navigation) => {
            this.navigation = navigation;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Subscribe to user changes
        // this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user) => {
        //     this._changeDetectorRef.markForCheck();
        // });

        // Subscribe to media changes
        this._helpersMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
            // Check if the screen is small
            this.isScreenSmall = !matchingAliases.includes('md');

            // Change the navigation appearance
            if (this.isScreenSmall) {
                this.navigationAppearance = this.isScreenSmall ? 'default' : 'dense';
            }
        });

        // Retrieve roles from localStorage
        const role = localStorage.getItem('currentRole');
        if (role) {
            this.role = role;
            // console.log('Role retrieved from localStorage:', this.role);
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._helpersNavigationService.getComponent<HelpersNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    /**
     * Toggle the navigation appearance
     */
    toggleNavigationAppearance(): void {
        this.navigationAppearance = (this.navigationAppearance === 'default' ? 'dense' : 'default');
    }

    
    // Get the user role
    getUserRole(): string {
        const token: string = this._authService.access_token;
        const tokenPayload: any = jwt_decode(token);
        // console.log(tokenPayload);
        const branch = tokenPayload?.user.branch.kh_name
        const groupwork = tokenPayload?.user.groupwork.name;
        // console.log(value);
        switch (this.role) {
            case 'SuperAdmin':
                return 'អភិបាលប្រព័ន្ធ ';

            case 'BranchManager':
                return 'ប្រធានសាខា ' + branch;

            case 'BranchMember':
                return 'សមាជិកសាខា '+ groupwork;

            case 'GroupManager':
                return 'ប្រធានក្រុមការងារ ' + groupwork;

            case 'Member':
                return 'សមាជិក';
                    
            default:
                return this.storedRole;
        }
    }
}
