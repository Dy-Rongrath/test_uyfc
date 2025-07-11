// ================================================================================>> Core Library
import { NgIf }                 from "@angular/common";
import { Component, OnInit }    from "@angular/core";
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";


// ================================================================================>> Third Party Library
// Material
import { MatButtonModule }          from '@angular/material/button';
import { MatCheckboxModule }        from '@angular/material/checkbox';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatIconModule }            from '@angular/material/icon';
import { MatInputModule }           from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Captcha
import { RecaptchaModule }      from "ng-recaptcha";

// RxJS
import { Subject, takeUntil }   from "rxjs";

// ================================================================================>> Custom Library
// Core
import { AuthService }          from "app/core/auth/service";

// Environment
import { environment as env }   from "environments/environment";

// Helper
import { SnackbarService }      from "helpers/services/snack-bar/service";
import { GlobalConstants }      from "helpers/shared/global-constants";

@Component({
  selector      : "auth-sign-in",
  templateUrl   : "./template.html",
  styleUrls     : ["./style.scss"],
  standalone        : true,
  imports       : [
    // =====================>> Core
    FormsModule,
    NgIf,
    ReactiveFormsModule,

    // =====================>> Third
    RecaptchaModule,

        // =====================>> Custom
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
    ]
})

export class SignInComponent implements OnInit {
  public siteKey    : string = env.RecaptchaSiteKey;
  public signInForm : UntypedFormGroup;
  public isLoading  : boolean = false;
  public phone      : string = null;

  private _unsubscribeAll: Subject<{ phone: number }> = new Subject<{
    phone: number;
  }>();

  constructor(
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _router     : Router,
    private _snackbarService: SnackbarService,
  ) {}

    ngOnInit(): void {

        // Retrieve the "Remember Me" state and phone number from localStorage
        const rememberMe    = localStorage.getItem('rememberMe') === 'true';
        const phone         = rememberMe ? localStorage.getItem('rememberMePhone') : '';
        // Subscribe to user changes
        this._authService.phone$.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: { phone: string }) => {
            this.phone = data.phone;
            setTimeout(() => {
                const phoneInput = document.getElementById('phoneInput') as HTMLInputElement;
                if (phoneInput) {
                    phoneInput.focus();
                }
            }, 0);
        });

        // Initialize the form with the retrieved "Remember Me" state and phone number
        this.signInForm = this._formBuilder.group({
            // 012446856 kAH5X8
            phone: ['', [Validators.required, Validators.minLength(9)]],
            password: ['', Validators.required],
            rememberMe: [rememberMe]
        });
    }
    onRememberMeChange(event: any): void {
        const rememberMe = event.checked;
        localStorage.setItem('rememberMe', rememberMe.toString());
        if (!rememberMe) {
            localStorage.removeItem('rememberMePhone');
        }
    }
    
    signIn(): void {
        this.isLoading = true;
        this.signInForm.disable();
    
        const { phone, password, rememberMe } = this.signInForm.value;
    
        if (rememberMe) {
            localStorage.setItem('rememberMePhone', phone);
        }
    
        this._authService.signIn({ phone, password, rememberMe }).subscribe({
            next: _res => {

                this.isLoading          = false;
                this._authService.phone = this.signInForm.value;
                this._snackbarService.openSnackBar("Sign in successfully", GlobalConstants.success);
    
                // Redirect based on user role after successful login
                const currentRole = localStorage.getItem('currentRole'); // Assuming you have a method to get user role from AuthService
                // console.log("conrent role user:" + currentRole); // Add this line to check the value

                switch (currentRole) {
                    
                    case 'SuperAdmin':
                        this._router.navigateByUrl('/superadmin/dashboard');
                        break;

                    case 'BranchManager':
                        this._router.navigateByUrl('/branchmanager/dashboard');
                        break;

                    case 'BranchMember':
                        this._router.navigateByUrl('/branchmember/dashboard');
                        break;

                    case 'GroupManager':
                        this._router.navigateByUrl('/groupmanager/dashboard');
                        break;

                    case 'Member':
                        this._router.navigateByUrl('/member/dashboard');
                        break;
                        
                    default:
                        this._router.navigateByUrl('/'); // Navigate to a default dashboard if no role matches
                        break;
                }
            },
            error: err => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message ?? GlobalConstants.genericError, GlobalConstants.error);
                this.signInForm.enable();
            }
        });
    }
    

    onResolved(response: string): void {
        // Not implemented yet
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    forgotPassword(): void {
        this._router.navigateByUrl('/auth/forgot-password');
    }
}

