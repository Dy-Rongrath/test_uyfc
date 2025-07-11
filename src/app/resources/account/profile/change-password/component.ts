// ================================================================================>> Core Library
import { CommonModule }     from '@angular/common';
import { Component }        from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef }     from '@angular/material/dialog';

// ================================================================================>> Thrid Party Library
// Material
import { MatButtonModule }      from '@angular/material/button';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatIconModule }        from '@angular/material/icon';
import { MatInputModule }       from '@angular/material/input';
import { AccountService } from '../../service';
import { SnackbarService } from 'helpers/services/snack-bar/service';
import { GlobalConstants } from 'helpers/shared/global-constants';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/service';

// ================================================================================>> Custom Library

@Component({
    selector    : 'change-password',
    standalone  : true,
    imports     : [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
    templateUrl : './template.html',
    styleUrls   : ['./style.scss']
})
export class ChangePasswordComponent {

    changePasswordForm: UntypedFormGroup;

    public isLoading: boolean;

    constructor(
        private readonly formBuilder: UntypedFormBuilder,
        private dialogRef: MatDialogRef<ChangePasswordComponent>,
        private _accountService: AccountService,
        private _snackBarService: SnackbarService,
        private router          : Router,
        private _authService: AuthService,
        // private route: ActivatedRoute,

    ) { }

    ngOnInit(): void {
        this.changePasswordForm = this.formBuilder.group({
            old_password:       ['', [Validators.required, Validators.minLength(6),Validators.maxLength(20)]],
            new_password:       ['', [Validators.required, Validators.minLength(6),Validators.maxLength(20)]],
            confirm_password:   ['', [Validators.required, Validators.minLength(6),Validators.maxLength(20)]]
        });
    }
    closeDialog() {
        this.dialogRef.close();
    }

    signOut(): void {
        this._authService.signOut();
        this.router.navigateByUrl('/auth/sign-in');
    }

    submit(): void {

        this.changePasswordForm.disable();
        this.isLoading = true;
        this._accountService.updatePassword(this.changePasswordForm.value).subscribe({
            next: (response) => {
                this.isLoading = false;
                // const tokenPayload: { exp: number, iat: number, user: User } = jwt_decode(response.token);
                // this._userService.user = tokenPayload.user;
                // localStorage.setItem('accessToken', response.token);
                this.changePasswordForm.enable();
               
                this._snackBarService.openSnackBar(response.message, GlobalConstants.success);            
                this.dialogRef.close(); // Close dialog after navigation
                this.signOut();
                
            },
            error: (err) => {
                this.changePasswordForm.enable();
                this.isLoading = false;
                const errors: { field: string, message: string }[] | undefined = err.error.errors;
                let message: string = err.error.message ?? GlobalConstants.genericError;
                if (errors && errors.length > 0) {
                    message = errors.map((obj) => obj.message).join(', ')
                }
                this._snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }
}
