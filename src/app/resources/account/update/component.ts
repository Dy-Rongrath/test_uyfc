

// ================================================================================>> Core Library
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild, inject,EventEmitter,Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


// ================================================================================>> Thrid Party Library
// Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';

// File Drop
import { NgxFileDropModule, NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

// PDF Viewer
import { PdfViewerModule } from 'ng2-pdf-viewer';

// RxJS
import { Observable, Subject, map, startWith } from 'rxjs';

// Moment.js
import moment from 'moment';
// ================================================================================>> Custom Library
// Helper
import { SnackbarService } from 'helpers/services/snack-bar/service';
import { GlobalConstants } from 'helpers/shared/global-constants';
import { HelpersViewerComponent } from 'helpers/shared/viewer/component';
import { PortraitComponent } from 'helpers/shared/portrait/component';

// Local
import { LoadingSpinnerService } from 'helpers/shared/loading/service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'update',
    templateUrl: './template.html',
    styleUrls: ['./style.scss'],
    standalone: true,
    imports: [
        RouterModule,
        FormsModule,
        MatIconModule,
        CommonModule,
        MatTooltipModule,
        AsyncPipe,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        NgxFileDropModule,
        PdfViewerModule,
        HelpersViewerComponent,
        MatRadioModule,
        MatDialogModule,
        PortraitComponent,
    ]
})
export class UpdateComponent implements OnInit, OnDestroy {
    @Input() src: string = 'assets/images/avatars/profile user.webp';
    @Input() name: string = 'Avatar';
    // @Output() updatedGuest: EventEmitter<ResponseGuest> = new EventEmitter<ResponseGuest>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    updateForm: UntypedFormGroup;
    saving: boolean = false;
    isLoading: boolean;
    sexOptions: { id: number; name: string }[] = [
        { id: 1, name: 'ប្រុស' },
        { id: 2, name: 'ស្រី' },
    ];
    guestId: number;
    // guest: ResponseGuest;
    constructor(
        // @Inject(MAT_DIALOG_DATA) public data: { id: number, guest: ResponseGuest },
        private dialogRef: MatDialogRef<UpdateComponent>,
        private formBuilder: UntypedFormBuilder,
        private snackBarService: SnackbarService,
        // private guestService: GuestService,
    ) {
        // this.guest = data.guest;
        // this.guestId = data.id;
    }

    ngOnInit(): void {
        this.ngBuilderForm();
    }
    ngBuilderForm(): void {
        this.updateForm = this.formBuilder.group({
            sex_id : [null],
            sure_name : [null],
            given_name: [null],
            lattin_name : [null],
            phone : [null],
            email : [null],
            facebook : [null],
            telegram : [null],
            card_no : [null],
            pob : [null],
            dob : [null],
            address : [null],
            image : [null]
        });
    }
    srcChange(base64: string): void {
        this.updateForm.get('image').setValue(base64);
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    // submit() {
    //     if (this.updateForm.valid && !this.saving) {
    //         this.saving = true;
    //         const body: any = {
    //             sex_id: this.updateForm.value.sex_id,
    //             sure_name: this.updateForm.value.sure_name,
    //             given_name: this.updateForm.value.given_name,
    //             lattin_name: this.updateForm.value.lattin_name,
    //             phone: this.updateForm.value.phone,
    //             email: this.updateForm.value.email,
    //             facebook: this.updateForm.value.facebook,
    //             telegram: this.updateForm.value.telegram,
    //             card_no: this.updateForm.value.card_no,
    //             pob: this.updateForm.value.pob,
    //             dob: this.updateForm.value.dob,
    //             address: this.updateForm.value.address,
    //             image: this.updateForm.value.image
    //         };
    
    //         this.guestService.updateGuest(this.guestId, body).subscribe({
    //             next: (response) => {
    //                 // Construct a ResponseEmergency object from the response data
    //                 const updatedGuest = {
    //                     sex_id : response.data.sex_id,
    //                     sure_name : response.data.sure_name,
    //                     given_name: response.data.given_name,
    //                     lattin_name : response.data.lattin_name,
    //                     phone : response.data.phone,
    //                     email : response.data.email,
    //                     facebook : response.data.facebook,
    //                     telegram : response.data.telegram,
    //                     card_no : response.data.card_no,
    //                     pob : response.data.pob,
    //                     dob : response.data.dob,
    //                     address : response.data.address,
    //                     image : response.data.image,
    //                 };
    //                 // Emit the updated emergency data
    //                 this.updatedGuest.emit(updatedGuest);
    //                 this.dialogRef.close();
    //                 this.snackBarService.openSnackBar('Updated successfully.', GlobalConstants.success);
    //             },
    //             error: (err: HttpErrorResponse) => {
    //                 this.saving = false;
    //                 const errors: { field: string, message: string }[] | undefined = err.error.errors;
    //                 let message: string = err.error.message ?? GlobalConstants.genericError;
    //                 if (errors && errors.length > 0) {
    //                     message = errors.map((obj) => obj.message).join(', ');
    //                 }
    //                 this.snackBarService.openSnackBar(message, GlobalConstants.error);
    //             },
    //             complete: () => {
    //                 this.saving = false;
    //             }
    //         });
    //     }
    // }
    closeDialog() {
        this.dialogRef.close();
    }
}