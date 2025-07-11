// // ================================================================================>> Core Library
// import { NgIf } from '@angular/common';
// import { HttpErrorResponse } from '@angular/common/http';
// import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, HostListener } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';

// // ================================================================================>> Thrid Party Library
// // Material
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// // RxJS
// import { Subject, takeUntil } from 'rxjs';

// // ================================================================================>> Custom Library
// // Core
// import { AuthService } from 'app/core/auth/service';

// // Helper
// import { SnackbarService } from 'helpers/services/snack-bar/service';
// import { GlobalConstants } from 'helpers/shared/global-constants';

// @Component({
//     selector: 'auth-verify-otp',
//     templateUrl: './template.html',
//     styleUrls: ['./style.scss'],
//     standalone: true,
//     imports: [
//         // =====================>> Core 
//         FormsModule, 
//         NgIf, 
//         // =====================>> Third
//         // =====================>> Custom
//         MatButtonModule, 
//         MatIconModule, 
//         MatProgressSpinnerModule,

//     ],
// })
// export class VerifyComponent implements OnInit, OnDestroy {

//     @ViewChild('input1') input1: ElementRef;
//     @ViewChild('input2') input2: ElementRef;
//     @ViewChild('input3') input3: ElementRef;
//     @ViewChild('input4') input4: ElementRef;
//     @ViewChild('input5') input5: ElementRef;
//     @ViewChild('input6') input6: ElementRef;

//     public token: string = '';
//     public numStr1: string = '';
//     public numStr2: string = '';
//     public numStr3: string = '';
//     public numStr4: string = '';
//     public numStr5: string = '';
//     public numStr6: string = '';
//     public otpCode: string = '';
//     public remainingTime: number = 0;
//     public reSendOtp: boolean = false;
//     public isLoading: boolean = false;
//     public countdownInterval: any;
//     public phone: string = '';
//     public canSubmit: boolean = false;

//     private _unsubscribeAll: Subject<void> = new Subject<void>();

//     constructor(
//         private _authService: AuthService,
//         private _snackbarService: SnackbarService,
//         private _router: Router,
//     ) { }

//     ngOnInit(): void {
//         this.remainingTime = 60;
//         this.startCountdown();
//         // Subscribe to user changes
//         this._authService.phone$.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: { phone: string }) => {
//             this.phone = data.phone;
//         });
//         if (!this.phone) {
//             this._snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
//             this._router.navigateByUrl('/auth/sign-in');
//             return;
//         }
//     }

//     startCountdown() {
//         this.remainingTime -= 1;
//         this.countdownInterval = setInterval(() => {
//             if (this.remainingTime > 0) {
//                 this.remainingTime--;
//             } else {
//                 clearInterval(this.countdownInterval);
//                 this.reSendOtp = true;
//                 this.numStr1 = this.numStr2 = this.numStr3 = this.numStr4 = this.numStr5 = this.numStr6 = '';
//                 this.canSubmit = false;
//             }
//         }, 1000);
//     }

//     toLogin(): void {
//         clearInterval(this.countdownInterval);
//         this._router.navigateByUrl('/auth/sign-in');
//     }

//     formatTime(seconds: number): string {
//         const minutes: number = Math.floor(seconds / 60);
//         const remainingSeconds: number = seconds % 60;
//         return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//     }

//     resendOtp(): void {
//         this.isLoading = true;
//         this._authService.resendOtp({ phone: this.phone }).subscribe({
//             next: (response) => {
//                 this.isLoading = false;
//                 this.remainingTime = 120;
//                 this.startCountdown();
//                 this.reSendOtp = false;
//                 this._snackbarService.openSnackBar(response.message, GlobalConstants.success);
//             },
//             error: (err: HttpErrorResponse) => {
//                 console.log(err)
//                 const errors: { field: string, message: string }[] | undefined = err.error.errors;
//                 let message: string = err.error.message;
//                 if (errors && errors.length > 0) {
//                     message = errors.map((obj) => obj.message).join(', ')
//                 }
//                 this._snackbarService.openSnackBar(message ?? GlobalConstants.genericError, GlobalConstants.error);
//                 this.isLoading = false;
//             }
//         });
//     }

//     verify(): void {
//         this.isLoading = true;
//         this._authService.verifyOtp({ phone: this.phone, otp: this.otpCode }).subscribe({
//             next: (_response) => {
//                 this.isLoading = false;
//                 this._snackbarService.openSnackBar("OTP has been successfully verified", GlobalConstants.success);

//                 this._authService.token$.pipe(takeUntil(this._unsubscribeAll)).subscribe((_response: { token: string }) => {
//                     this.token = _response.token;
//                 });
//                 if (!this.token) {
//                     this._snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
//                     this._router.navigateByUrl('/auth/sign-in');
//                     return;
//                 }

//                 this._authService.verified(this.token);
//                 this._router.navigateByUrl('');
//             },
//             error: (err: HttpErrorResponse) => {
//                 const errors: { field: string, message: string }[] | undefined = err.error.errors;
//                 let message: string = err.error.message;
//                 if (errors && errors.length > 0) {
//                     message = errors.map((obj) => obj.message).join(', ')
//                 }
//                 this._snackbarService.openSnackBar(message ?? GlobalConstants.genericError, GlobalConstants.error);
//                 this.isLoading = false;
//             }
//         });
//     }

//     keyDownHandler1(event: KeyboardEvent | any): void {
//         if (event.key === 'Backspace') {
//             this.numStr1 = '';
//             this.checkValid();
//             event.preventDefault();
//         } else if (event.key === 'Tab') {
//             event.preventDefault();
//         } else {
//             var keyCode = event.which || event.keyCode;

//             if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
//                 if (this.numStr1 !== '') {
//                     this.input2.nativeElement.focus();
//                 }
//                 event.preventDefault();
//             } else {
//                 const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//                 if (array.includes(event.key)) {
//                     this.numStr1 = event.key;
//                     if (!this.checkValid()) {
//                         this.input2.nativeElement.focus();
//                     } else {
//                         this.input1.nativeElement.blur();
//                     }
//                     event.preventDefault();
//                 } else {
//                     // Prevent input of non-English numbers (Khmer numbers)
//                     event.preventDefault();
//                 }
//             }
//         }

//     }

//     keyDownHandler2(event: KeyboardEvent | any): void {
//         if (event.key === 'Backspace') {
//             if (this.numStr2 === '') {
//                 this.input1.nativeElement.focus();
//             }
//             this.numStr2 = '';
//             this.checkValid();
//             event.preventDefault();
//         } else if (event.key === 'Tab') {
//             event.preventDefault();
//         } else {
//             var keyCode = event.which || event.keyCode;

//             if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
//                 if (this.numStr2 !== '') {
//                     this.input3.nativeElement.focus();
//                 }
//                 event.preventDefault();
//             } else {
//                 const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//                 if (array.includes(event.key)) {
//                     this.numStr2 = event.key;
//                     if (!this.checkValid()) {
//                         this.input3.nativeElement.focus();
//                     } else {
//                         this.input2.nativeElement.blur();
//                     }
//                     event.preventDefault();
//                 } else {
//                     // Prevent input of non-English numbers (Khmer numbers)
//                     event.preventDefault();
//                 }
//             }
//         }
//     }

//     keyDownHandler3(event: KeyboardEvent | any): void {
//         if (this.numStr3 === '') {
//             this.input2.nativeElement.focus();
//         }
//         if (event.key === 'Backspace') {
//             this.numStr3 = '';
//             this.checkValid();
//             event.preventDefault();
//         } else if (event.key === 'Tab') {
//             event.preventDefault();
//         } else {
//             var keyCode = event.which || event.keyCode;

//             if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
//                 if (this.numStr3 !== '') {
//                     this.input4.nativeElement.focus();
//                 }
//                 event.preventDefault();
//             } else {
//                 const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//                 if (array.includes(event.key)) {
//                     this.numStr3 = event.key;
//                     if (!this.checkValid()) {
//                         this.input4.nativeElement.focus();
//                     } else {
//                         this.input3.nativeElement.blur();
//                     }
//                     event.preventDefault();
//                 } else {
//                     // Prevent input of non-English numbers (Khmer numbers)
//                     event.preventDefault();
//                 }
//             }
//         }
//     }

//     keyDownHandler4(event: KeyboardEvent | any): void {
//         if (event.key === 'Backspace') {
//             if (this.numStr4 === '') {
//                 this.input3.nativeElement.focus();
//             }
//             this.numStr4 = '';
//             this.checkValid();
//             event.preventDefault();
//         } else if (event.key === 'Tab') {
//             event.preventDefault();
//         } else {
//             var keyCode = event.which || event.keyCode;

//             if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
//                 if (this.numStr4 !== '') {
//                     this.input5.nativeElement.focus();
//                 }
//                 event.preventDefault();
//             } else {
//                 const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//                 if (array.includes(event.key)) {
//                     this.numStr4 = event.key;
//                     if (!this.checkValid()) {
//                         this.input5.nativeElement.focus();
//                     } else {
//                         this.input4.nativeElement.blur();
//                     }
//                     event.preventDefault();
//                 } else {
//                     // Prevent input of non-English numbers (Khmer numbers)
//                     event.preventDefault();
//                 }
//             }
//         }
//     }

//     keyDownHandler5(event: KeyboardEvent | any): void {
//         if (event.key === 'Backspace') {
//             if (this.numStr5 === '') {
//                 this.input4.nativeElement.focus();
//             }
//             this.numStr5 = '';
//             this.checkValid();
//             event.preventDefault();
//         } else if (event.key === 'Tab') {
//             event.preventDefault();
//         } else {
//             var keyCode = event.which || event.keyCode;

//             if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
//                 if (this.numStr5 !== '') {
//                     this.input6.nativeElement.focus();
//                 }
//                 event.preventDefault();
//             } else {
//                 const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//                 if (array.includes(event.key)) {
//                     this.numStr5 = event.key;
//                     if (!this.checkValid()) {
//                         this.input6.nativeElement.focus();
//                     } else {
//                         this.input5.nativeElement.blur();
//                     }
//                     event.preventDefault();
//                 } else {
//                     // Prevent input of non-English numbers (Khmer numbers)
//                     event.preventDefault();
//                 }
//             }
//         }
//     }

//     keyDownHandler6(event: KeyboardEvent | any): void {
//         if (event.key === 'Backspace') {
//             if (this.numStr6 === '') {
//                 this.input5.nativeElement.focus();
//             }
//             this.numStr6 = '';
//             this.checkValid();
//             event.preventDefault();
//         } else if (event.key === 'Tab') {
//             event.preventDefault();
//         } else {
//             var keyCode = event.which || event.keyCode;

//             if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
//                 event.preventDefault();
//             } else {
//                 const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//                 if (array.includes(event.key)) {
//                     this.numStr6 = event.key;
//                     if (this.checkValid()) {
//                         this.input6.nativeElement.blur();
//                     }
//                     event.preventDefault();
//                 } else {
//                     // Prevent input of non-English numbers (Khmer numbers)
//                     event.preventDefault();
//                 }
//             }
//         }
//     }

//     // Listen for keyup event on the document
//     @HostListener('document:keyup', ['$event'])
//     handleKeyboardEvent(event: KeyboardEvent) {
//         if (event.key === 'Enter' && this.numStr6 !== '') {
//             if (this.checkValid()) {
//                 this.input6.nativeElement.blur();
//                 this.verify();
//             }
//             event.preventDefault();
//         }
//     }

//     checkValid(): boolean {
//         this.otpCode = this.numStr1 + this.numStr2 + this.numStr3 + this.numStr4 + this.numStr5 + this.numStr6;
//         this.canSubmit = this.otpCode.length === 6;
//         return this.canSubmit;
//     }

//     ngOnDestroy(): void {
//         // Unsubscribe from all subscriptions
//         this._unsubscribeAll.next(null);
//         this._unsubscribeAll.complete();
//     }
// }
