import { CommonModule } from '@angular/common';
import { Component, Input, Inject, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from 'helpers/services/snack-bar/service';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

@Component({
    selector: 'app-portrait-user',
    templateUrl: './template.html',
    styleUrls: ['./style.scss'],
    standalone: true,
    imports: [MatIconModule, MatDialogModule, CommonModule, MatButtonModule]
})
export class PortraitUserComponent {
    @Input() src: string = 'assets/images/avatars/image-icon.jpg';
    @Input() delete: boolean;
    @Input() index: string = '';
    @Input() title: string = 'guest';
    @Input() mode: string = 'READONLY';
    @Input() responseType: string = 'base64';
    @Input() disabled: boolean;
    @Input() name: string = '';  
    @Input() tagBackgroundColor: string = '#fbbd08'; // New input for tag background color
    @Input() imageBorderColor: string = '#fbbd08'; // New input for image border color
    @Output() srcChange = new EventEmitter();
    constructor(
        public dialog: MatDialog,
        private snackBar: SnackbarService
    ) { }

    remove(): void {
        this.delete = false;
        this.src = 'assets/images/avatars/image-icon.jpg';
        this.srcChange.emit('');
    }

    fileChangeEvent(event: any): void {
        let check: string = '';
        check = event.target?.files[0]?.type ?? '';
        if (check.substring(0, 5) === 'image') {
            const dialogRef = this.dialog.open(PortraitDialogComponent, {
                width: '600px',
                data: {
                    event: event,
                    responseType: this.responseType,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result !== '') {
                    this.delete = true;
                    this.src = result;
                    this.srcChange.emit(result);
                }
            });
        } else {
            console.log(check.substring(0, 5));
            this.snackBar.openSnackBar('សូមជ្រើសរើស file ប្រភេទជារូបភាព', 'error');
        }
    }

    selectFile(): void {
    if (this.mode === 'READONLY') {
        return;
    }
    const fileInput = document.getElementById(`portraitFile-${this.index}`);
    if (fileInput) {
        fileInput.click();
    } else {
        console.error(`File input element with ID portraitFile-${this.index} not found.`);
    }
}
}

// ===================================================================>> Dialog
@Component({
    selector: 'app-portrait-user-dialog',
    templateUrl: 'dialog.html',
    styleUrls: ['./style.scss'],
    standalone: true,
    imports: [MatIconModule, MatDialogModule, ImageCropperModule]
})
export class PortraitDialogComponent {
    public result: any;
    public imageChangedEvent: any = '';

    constructor(
        public dialogRef: MatDialogRef<PortraitDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private snackBar: SnackbarService
    ) {
        this.imageChangedEvent = data.event;
    }

    close(): void {
        this.dialogRef.close('');
    }

    imageCropped(event: ImageCroppedEvent): void {
        if (this.data.responseType === 'base64') {
            this.result = event.base64 ? event.base64 : '';
        } else {
            this.result = event;
        }
    }
    imageLoaded(): void {
        // show cropper
    }
    cropperReady(): void {
        // cropper ready
    }
    loadImageFailed(): void {
        // show message
    }
}
