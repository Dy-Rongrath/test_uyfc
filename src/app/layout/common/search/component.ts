// ================================================================================>> Core Library
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// ================================================================================>> Thrid Party Library
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

// Moment.js
import moment from 'moment';

// ================================================================================>> Custom Library
// Helper
import { helpersAnimations } from 'helpers/animations';
import { SnackbarService } from 'helpers/services/snack-bar/service';
import { GlobalConstants } from 'helpers/shared/global-constants';

// Local
import { SearchService } from './service';

@Component({
    selector: 'layout-search',
    standalone: true,
    templateUrl: './template.html',
    styleUrls: ['./style.scss'],
    animations: helpersAnimations,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        MatMenuModule,
        MatButtonModule,
        MatDatepickerModule
    ]
})
export class SearchComponent implements OnInit {

    @ViewChild('buttonElement') buttonElement: ElementRef;
    @ViewChild('inputFilter') inputFilter!: ElementRef;

    searchForm: UntypedFormGroup;
    setup: any = null;
    histories: string[] = [];
    filtersData: { id: number, name: string, type: string, date: Date }[] = [];
    minHeight: number = 80;
    display: boolean = false;
    filter: string = '';
    onFocus: boolean = false;
    constructor(
        private formBuilder: UntypedFormBuilder,
        private elementRef: ElementRef,
        private router: Router,
        private searchService: SearchService,
        private snackbarService: SnackbarService
    ) { }

    ngOnInit(): void {
        this.histories = this.searchService.itemHistory;
        this.histories.forEach(() => {
            this.minHeight += 40;
        });
        this.ngBuilderForm();
        this.listenToInputFilterFocus();
    }

    ngBuilderForm(): void {
        this.searchForm = this.formBuilder.group({
            start_date: [null],
            end_date: [null],
            cat_id: [0],
            org_id: [0],
            type_id: [0],
            tag_id: [0],
        });
    }

    roleBack(): void {
        this.searchForm.setValue({
            cat_id: 0,
            org_id: 0,
            type_id: 0,
            tag_id: 0,
            start_date: null,
            end_date: null,
        });
    }

    isFilter: boolean = false;
    filters(): void {
        if (this.filter && this.filter.trim() != '') {
            this.searchService.getKey({ key: this.filter }).subscribe({
                next: response => {
                    this.minHeight = 0;
                    this.filtersData = response.data ?? [];
                    this.filtersData.forEach(() => {
                        this.minHeight += 42.5;
                    });
                    this.isFilter = true;
                },
                error: err => {
                    this.snackbarService.openSnackBar(err?.error?.message, GlobalConstants.error);
                }
            });
        } else {
            this.minHeight = 80;
            this.histories.forEach(() => {
                this.minHeight += 40;
            });
            this.isFilter = false;
        }
    }

    filterByKey(key: string): void {
        if ((key && key.trim() != '') || this.searchForm.value) {

            // Check if the key does not already exist in the array
            if (key.trim() != '' && !this.histories.includes(key)) {
                // Adding a new item to the beginning of the array
                this.histories.unshift(key);
                // Check if the array's length is greater than 3
                if (this.histories.length > 3) {
                    // Remove the last item
                    this.histories.pop();
                }
                // Set the history in the search service or local storage
                this.searchService.itemHistory = this.histories;
            }
            // =======================================================
            this.onFocus = false;
            this.display = false;
            this.filter = key;
            const params: { key: string, cat_id?: number, org_id?: number, type_id?: number, tag_id?: number, from?: string, to?: string } = { key: this.filter };
            if (this.searchForm.value.cat_id && this.searchForm.value.cat_id != 0) params.cat_id = this.searchForm.value.cat_id;
            if (this.searchForm.value.org_id && this.searchForm.value.org_id != 0) params.org_id = this.searchForm.value.org_id;
            if (this.searchForm.value.type_id && this.searchForm.value.type_id != 0) params.type_id = this.searchForm.value.type_id;
            if (this.searchForm.value.tag_id && this.searchForm.value.tag_id != 0) params.tag_id = this.searchForm.value.tag_id;
            if (this.searchForm.value.start_date && this.searchForm.value.end_date) {
                params.from = moment(new Date(this.searchForm.value.start_date)).format('MM:DD:YYYY');
                params.to = moment(new Date(this.searchForm.value.end_date)).format('MM:DD:YYYY');
            }
            this.searchService.getItems(params).subscribe({
                next: res => {
                    this.router.navigateByUrl('/search');
                },
                error: err => {
                    this.snackbarService.openSnackBar(err?.error?.message, GlobalConstants.error);
                }
            })
            // Remove focus from the input element
            if (this.inputFilter && this.inputFilter.nativeElement) {
                this.inputFilter.nativeElement.blur();
            }
        }
    }

    filterByItem(item: any): void {
        this.isFilter = false;
        // Not implementation yet
    }

    clear(event?: Event): void {
        if (event) {
            event.stopPropagation();
        }
        this.filter = '';
        // This checks if the nativeElement is there and then focuses it
        if (this.inputFilter && this.inputFilter.nativeElement) {
            this.inputFilter.nativeElement.focus();
        }
        this.filters();
    }

    removeHistory(item: string, event?: Event): void {
        if (event) {
            event.stopPropagation();
        }
        this.histories = this.histories.filter(v => v !== item);
        if (this.histories.length == 0) this.minHeight = 80;
        this.searchService.itemHistory = this.histories;
    }

    componentToggle(): void {
        if (!this.display) {
            this.onFocus = false;
        }
        this.display = !this.display;
        if (!this.setup) {
            this.searchService.getSetup().subscribe({
                next: res => {
                    this.setup = res.data;
                },
                error: err => {
                    console.error(err.error);
                }
            });
        }
    }

    // Method to handle clicks outside the button element.
    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        const buttonElement = this.buttonElement.nativeElement;
        const matMenuElement = document.querySelector('.mat-menu-panel');
        const matOptionElement = document.querySelector('.mat-mdc-option');
        const matCalendarElement = document.querySelector('.mat-datepicker-content-container');
        const overlayBachkropElement = document.querySelector('.cdk-overlay-backdrop');

        if (
            !buttonElement.contains(event.target as Node) &&
            !matMenuElement?.contains(event.target as Node) &&
            !matOptionElement?.contains(event.target as Node) &&
            !matCalendarElement?.contains(event.target as Node) &&
            !overlayBachkropElement?.contains(event.target as Node)
        ) {
            this.display = false;
            this.onFocus = false;
        }

        const navigationContent = document.querySelector('.helpers-navigation-content');
        if (navigationContent.contains(event.target as Node)) {
            this.filter = '';
        }
    }

    private listenToInputFilterFocus() {
        const inputFilter = this.elementRef.nativeElement.querySelector('#input-filter');
        if (inputFilter) {
            inputFilter.addEventListener('focus', () => {
                this.onFocus = true;
                this.display = false;
            });
        }
    }
}
