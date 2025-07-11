import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'helpers-pdf-viewer',
    standalone: true,
    imports: [CommonModule, PdfViewerModule, MatIconModule, MatButtonModule, MatDialogModule],
    templateUrl: './template.html',
    styleUrls: ['./style.scss']
})
export class HelpersViewerComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { file?: File, url: string, type: string },
        private dialogRef: MatDialogRef<HelpersViewerComponent>
    ) { }

    ngOnInit() {
        console.log(this.data)
    }
}
