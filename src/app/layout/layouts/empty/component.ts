// ================================================================================>> Core Library
import { NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// ================================================================================>> Thrid Party Library
// RxJS
import { Subject } from 'rxjs';

// ================================================================================>> Custom Library

@Component({
    selector: 'empty-layout',
    templateUrl: './template.html',
    standalone: true,
    imports: [NgIf, RouterOutlet],
})
export class EmptyLayoutComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
