import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SearchService } from 'app/layout/common/search/service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CapitalizePipe } from 'helpers/pipes/capitalize.pipe';
import { KhmerDatePipe } from 'helpers/pipes/khmer-date.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Item } from './interface';
import { environment as env } from 'environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-search',
    standalone: true,
    templateUrl: './template.html',
    styleUrls: ['./style.scss'],
    animations: [
        trigger('fadeInOnly', [
            transition(':enter', [   // :enter is alias for 'void => *'
                style({ opacity: 0, transform: 'scale(0.5)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
            ]),
            // No transition defined for :leave, so it disappears instantly
        ]),
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CapitalizePipe,
        KhmerDatePipe,
        MatTooltipModule
    ]
})
export class SearchComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @ViewChild('handleResponsive') handleResponsive!: ElementRef;
    displayedColumns: string[] = ['name', 'creator', 'created_at', 'size'];
    dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>([]);
    items: Item[] = [];
    fileUrl: string = env.FILE_BASE_URL;
    isGrid: boolean = false;

    boxWidth: number;
    numColumns: number = 5;
    maxHeight: number = 200;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _searchService: SearchService
    ) { }

    toggleView(value: boolean): void {
        this.isGrid = value;
    }

    ngOnInit(): void {
        // Subscribe to user changes
        this._searchService.items$.pipe(takeUntil(this._unsubscribeAll)).subscribe((items: Item[]) => {
            this.items = items;
            this.dataSource.data = items;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // Advance Implement
    ngAfterViewInit(): void {
        this.updateLayout();
    }

    @HostListener('window:resize', [])
    onResize(): void {
        this.updateLayout();
    }

    private updateLayout(): void {
        this.logBoxWidth();

        if (this.boxWidth > 1440) {
            this.setLayout(5, 200);
        } else if (this.boxWidth > 1024 && this.boxWidth <= 1440) {
            this.setLayout(4, 190);
        } else if (this.boxWidth > 960 && this.boxWidth <= 1024) {
            this.setLayout(3, 220);
        } else if (this.boxWidth > 600 && this.boxWidth <= 960) {
            this.setLayout(2, 260);
        } else {
            this.setLayout(1, 300);
        }
    }

    private setLayout(numColumns: number, maxHeight: number): void {
        this.numColumns = numColumns;
        this.maxHeight = maxHeight;
    }

    private logBoxWidth(): void {
        this.boxWidth = this.handleResponsive.nativeElement.offsetWidth;
    }
}
