import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'test-pdf-viewer',
    standalone: true,
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer.component.scss'],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        PdfViewerModule,
        MatDialogModule,
        FormsModule,
        MatInputModule
    ]
})
export class HeplerPdfViewerComponent {

    pdfSrc: string = 'assets/images/final-exam.pdf';

    constructor(
        @Inject(MAT_DIALOG_DATA) private readonly _pdf_url: string,
    ) {
        this.pdfSrc = this._pdf_url;
    }

    currentPage = 1;
    totalPages: number;
    zoom = 1; // Default zoom level
    normalZoom = 1; // Normal or default zoom level
    highZoom = 2; // Higher zoom level for toggling in

    afterLoadComplete(pdfData: any): void {
        this.totalPages = pdfData.numPages;
    }

    validateInput(event: any): void {
        // Allow numbers only, remove non-digit characters
        const input = event.target;
        const initialLength = input.value.length;
        input.value = input.value.replace(/[^0-9]/g, '');
        if (input.value.length !== initialLength) {
            event.preventDefault();
        }
    }

    goToPage(): void {
        this.currentPage = Math.min(Math.max(1, this.currentPage), this.totalPages); // Ensures the page number is within valid range
    }

    zoomIn(): void {
        this.zoom *= 1.1;
    }

    zoomOut(): void {
        this.zoom /= 1.1;
    }

    zoomToggle(): void {
        if (this.zoom !== this.normalZoom) {
            this.zoom = this.normalZoom; // Reset to normal zoom
        } else {
            this.zoom = this.highZoom; // Toggle to higher zoom
        }
    }

    downloadPDF(): void {
        // Create a link and trigger the download
        const link = document.createElement('a');
        link.href = this.pdfSrc;
        link.download = 'download.pdf';  // You might want to use a specific file name
        link.click();
    }

    printPDF(): void {
        // Open the PDF in a new window and invoke the print dialog
        const win = window.open(this.pdfSrc, '_blank');
        win.onload = () => {
            win.print();
        };
    }

}
