// ================================================================================>> Core Library
import { CommonModule }         from '@angular/common';
import { Component, Inject }    from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';

// ================================================================================>> Thrid Party Library
// Material
import { MatButtonModule }      from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatIconModule }        from '@angular/material/icon';
import { MatInputModule }       from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Decoder
import jwt_decode from 'jwt-decode';

// ================================================================================>> Custom Library
// Core
import { UserService } from 'app/core/user/service';

// Environment
import { environment as env }   from 'environments/environment';

// Helper
import { SnackbarService }      from 'helpers/services/snack-bar/service';
import { GlobalConstants }      from 'helpers/shared/global-constants';
import { PortraitComponent }    from 'helpers/shared/portrait/component';

// Local
import { AccountService }       from '../../service';
import { Profile }              from '../../interface';
import { MatSelectModule }      from '@angular/material/select';
import { PortraitRaduisComponent } from 'helpers/shared/portraitraduis/component';
import { AuthService } from 'app/core/auth/service';

@Component({
    selector    : 'account-profile-update-dialog',
    templateUrl : './template.html',
    styleUrls   : ['./style.scss'],
    standalone  : true,
    imports: [
        // =====================>> Core 
        CommonModule, FormsModule, ReactiveFormsModule, 

        // =====================>> Third
        MatButtonModule, 
        MatDialogModule, 
        MatFormFieldModule, 
        MatIconModule, 
        MatInputModule, 
        MatProgressSpinnerModule,
        MatSelectModule,

        // =====================>> Custom
        PortraitComponent,
        PortraitRaduisComponent
    ],
})
export class UpdateProfileDialogComponent {

    public form : UntypedFormGroup;
    public src  : string
    public isLoading: boolean;
    // dataSetupUserTitle: { id: number, name: string }[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public  _data: {
            
            item: Profile,
            setup: { id: number, name: string }[],
            
        },

        private readonly _dialogRef         : MatDialogRef<UpdateProfileDialogComponent>,
        private readonly _formBuilder       : UntypedFormBuilder,
        private readonly _accountService    : AccountService,
        private readonly _snackBarService   : SnackbarService,
        private readonly _userService       : UserService,
        private readonly _authservice       : AuthService,
    ) { }

    ngOnInit(): void {
        this.ngBuilderForm();
        // this._setupOnInit();
        this.src = env.FILE_BASE_URL +'/'+ this._data.item?.avatar;
        // console.log(this.src);
    }

    ngBuilderForm(): void {
        this.form = this._formBuilder.group({
            avatar  : [Validators.required],
            user_title: [this._data?.item?.user_title?.id, Validators.required],
            name    : [this._data?.item?.name , Validators.required],
            email   : [this._data?.item?.email, [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            phone   : [this._data?.item?.phone, [Validators.required, Validators.pattern(/^(\+855|0)[1-9]\d{7,8}$/)]],
        });
    }
    
    usernameValidator(control: AbstractControl): { [key: string]: any } | null {
        const forbidden = /[^\w]/.test(control.value);
        return forbidden ? { 'forbiddenUsername': { value: control.value } } : null;
    }

    khmerNameValidator(control: AbstractControl): { [key: string]: any } | null {
        const khmerNameRegex = /^[\u1780-\u17FF\s]+$/; // Unicode range for Khmer characters
        const valid = khmerNameRegex.test(control.value);
        return valid ? null : { 'invalidKhmerName': true };
    }
    
    englishNameValidator(control: AbstractControl): { [key: string]: any } | null {
        const englishNameRegex = /^[a-zA-Z\s]+$/; // Only allows letters and whitespace
        const valid = englishNameRegex.test(control.value);
        return valid ? null : { 'invalidEnglishName': true };
    }
    
    srcChange(base64: string): void {
        this.form.get('avatar').setValue(base64);
    }

    submit(): void {

        this.form.disable();
        this.isLoading = true;
        this._accountService.updateProfile(this.form.value).subscribe({
            next: (response) => {
                this.isLoading = false;
                // const tokenPayload: { exp: number, iat: number, user: User } = jwt_decode(response.token);
                
                this._userService.user = {
                  ...this._userService.user,
                  phone: response.user.phone,
                  avatar: response.user.avatar,
                  email: response.user.email,
                  user_title: response.user.user_title.name,
                  name: response.user.name,
                };

                this._authservice.access_token = response.access_token;

                // localStorage.setItem('accessToken', response.token);
                this._snackBarService.openSnackBar(response.message, GlobalConstants.success);
                this._dialogRef.close();
            },
            error: (err) => {
                this.form.enable();
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
    closeDialog() {
        this._dialogRef.close();
    }
}
