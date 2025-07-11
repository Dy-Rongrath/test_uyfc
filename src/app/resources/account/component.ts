// ================================================================================>> Core Library
import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';


// ================================================================================>> Thrid Party Library
// Material
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

// RxJS
import { Subject, takeUntil } from 'rxjs';

// ================================================================================>> Custom Library
// Core
import { User } from 'app/core/user/interface';
import { UserService } from 'app/core/user/service';

// Environment
import { environment as env } from 'environments/environment';

// Helper
import { HelpersMediaWatcherService } from 'helpers/services/media-watcher';

// Local
import { ProfileComponent } from './profile/component';
import { SecurityComponent } from './security/component';
import { ChangePasswordComponent } from './profile/change-password/component';
import { UpdateComponent } from './update/component';
@Component({
    selector: 'account',
    templateUrl: './template.html',
    styleUrls: ['./style.scss'],
    standalone: true,
    imports: [
        // =====================>> Core 
        NgClass, 
        NgFor, 
        NgSwitch, 
        NgSwitchCase, 

        // =====================>> Third
        MatIconModule, 
        MatSidenavModule, 

        // =====================>> Custom
        ProfileComponent, 
        SecurityComponent,
    ]
})
export class AccountComponent implements OnInit, OnDestroy {
    
    @ViewChild('drawer') drawer: MatDrawer;

    public drawerMode: 'over' | 'side' = 'side';
    public drawerOpened: boolean = true;

    public panels: any[] = [];
    public selectedPanel: string = 'profile';

    public user: User;
    public src: string = 'assets/images/avatars/profile user.webp';
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _mediaWatcherService: HelpersMediaWatcherService,
        private _userService: UserService,
        private matDialog: MatDialog,

    ) { }

    /**
     * On init
     */
    ngOnInit(): void {
        // Setup available panels
        this.panels = [
            {
                id: 'profile',
                icon: 'heroicons_outline:user-circle',
                title: 'គណនី'
            },
            // {
            //     id: 'note',
            //     icon: 'mat_outline:pending_actions',
            //     title: 'កំណត់ហេតុ'
            // }
        ];

        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
            this.user = user;
            this.src = env.FILE_BASE_URL + this.user.avatar;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Subscribe to media changes
        this._mediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
            // Set the drawerMode and drawerOpened
            if (matchingAliases.includes('lg')) {
                this.drawerMode = 'side';
                this.drawerOpened = true;
            }
            else {
                this.drawerMode = 'over';
                this.drawerOpened = false;
            }

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    onChangePw(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.position = { right: '0px' };
        dialogConfig.height = '100dvh';
        dialogConfig.width = '100dvw';
        dialogConfig.maxWidth = '650px';
        dialogConfig.panelClass = 'custom-mat-dialog-as-mat-drawer';
        dialogConfig.enterAnimationDuration = '0s';
        const dialogRef = this.matDialog.open( ChangePasswordComponent, dialogConfig);
    }   
    onUpdate() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.position = { right: '0px' };
        dialogConfig.height = '100dvh';
        dialogConfig.width = '100dvw';
        dialogConfig.maxWidth = '550px';
        dialogConfig.panelClass = 'custom-mat-dialog-as-mat-drawer';
        dialogConfig.enterAnimationDuration = '0s';

        const dialogRef = this.matDialog.open(UpdateComponent, {
            ...dialogConfig,
            // data: { id: this.guest.id, guest: this.guest } // Pass the id and guest data to the UpdateGuestComponent
        });
    }

}
