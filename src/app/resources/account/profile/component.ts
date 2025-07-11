// ================================================================================>> Core Library
import { CommonModule }                     from '@angular/common';
import { Component, Input }                 from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ================================================================================>> Thrid Party Library
// Material
import { MatButtonModule }              from '@angular/material/button';
import { MatDialog, MatDialogConfig}    from '@angular/material/dialog';
import { MatDividerModule }             from '@angular/material/divider';
import { MatIconModule }                from '@angular/material/icon';

// ================================================================================>> Custom Library

// Environment
import { environment as env }   from 'environments/environment';

// Helper
import { PortraitComponent }    from 'helpers/shared/portrait/component';


import { AccountService }       from '../service';
import { SnackbarService }      from 'helpers/services/snack-bar/service';
import { GlobalConstants }      from 'helpers/shared/global-constants';
import { Profile }              from '../interface';
import { MatMenuModule }        from '@angular/material/menu';
import { KhmerDatePipe }        from "../../../../helpers/pipes/khmer-date.pipe";
import { UpdateProfileDialogComponent } from './update-dialog/component';
import { ChangePasswordComponent } from './change-password/component';
import { PortraitRaduisComponent } from 'helpers/shared/portraitraduis/component';

@Component({
    selector    : 'account-profile',
    templateUrl : './template.html',
    styleUrls   : ['./style.scss'],
    standalone  : true,
    imports: [
    // =====================>> Core 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // =====================>> Third
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    // =====================>> Custom
    KhmerDatePipe,
    MatIconModule,
    
],

})
export class ProfileComponent {

    @Input() user: Profile;
    @Input() src: string = 'assets/images/avatars/female.jpg';

    fileUrl = env.FILE_BASE_URL;

    public signature: string
    public loading: boolean;

    public dataSetup    : { id: number, name: string }[] = [];

    constructor(
        private readonly _matDialog     : MatDialog,
        private readonly accountService : AccountService,
        private readonly snackbarService: SnackbarService,
    ) { }

    ngOnInit(): void {
        this.getProfile();
        this._setupOnInit();
    }

    getProfile(): void {
        this.loading = true;
        this.accountService.getProfile().subscribe({
            next: (data: any) => {
                // this.setup = data.setup;
                this.user = data;
                this.loading = false;

                console.log('User:', this.user);
            },
            error: (error) => {
                this.loading = false;
                this.snackbarService.openSnackBar(error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        })
    }

    private _setupOnInit(): void {
        this.accountService.getDataSetupUserTitle().subscribe({
            next: res => {
                // console.log('Setup data:', res); // Log the data here
                this.dataSetup = res;
            },
            error: err => this.snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error)
        });
    }
    
    openEditDialog():void {
        const dialog = new MatDialogConfig();
        // dialog.data = this.user;    
        dialog.data = {
            item: this.user,
            setup: this.dataSetup
        };
        dialog.autoFocus    = false;
        dialog.position     = { right: '0', top: '0' };
        dialog.maxWidth     = '557px';
        dialog.width        = '100%';
        dialog.height       = '100vh';
        dialog.panelClass   = 'side-dialog';
        const dialogRef     = this._matDialog.open(UpdateProfileDialogComponent, dialog);
        dialogRef.afterClosed().subscribe((result: any) => {
            this.getProfile();
        });

    }

    openChangePasswordDialog():void {
        const dialog        = new MatDialogConfig();
        dialog.autoFocus    = false;
        dialog.position     = { right: '0', top: '0' };
        dialog.maxWidth     = '557px';
        dialog.width        = '100%';
        dialog.height       = '100vh';
        dialog.panelClass   = 'side-dialog';
        this._matDialog.open(ChangePasswordComponent, dialog).afterClosed().subscribe(() => {
            this.getProfile();
        });
    }

    // openEnable2FADialog():void {
    //     const dialog = new MatDialogConfig();
    //     dialog.data = this.user.phone;
    //     dialog.autoFocus = false;
    //     dialog.position = { right: '0', top: '0' };
    //     dialog.width = '450px';
    //     dialog.height = '100vh';
    //     dialog.panelClass = 'side-dialog';
    //     this._matDialog.open(TwoFADialogComponent, dialog);
    // }

    // setupData(): void {
    //     this.loadingSpinner.open();
    //     this.accountService.setup().subscribe({
    //         next: (response: ResponseSetup) => {
    //             this.setup = response.data;
    //             this.loadingSpinner.close();
    //         },
    //         error: (err: HttpErrorResponse) => {
    //             const error: { httpStatus: 400, message: string } = err.error;
    //             this.snackBarService.openSnackBar(error.message ?? GlobalConstants.genericError, GlobalConstants.error);
    //             this.loadingSpinner.close();
    //         }
    //     })
    // }

    back(): void {
        window.history.back();
    }
}
