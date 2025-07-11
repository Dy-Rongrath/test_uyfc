import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HelpersNavigationService } from 'helpers/components/navigation/service';
import { HelpersNavigationItem } from 'helpers/components/navigation/interface';
import { HelpersNavigationBasicItemComponent } from 'helpers/components/navigation/components/basic/component';
import { HelpersNavigationCollapsableItemComponent } from 'helpers/components/navigation/components/collapsable/component';
import { HelpersNavigationComponent } from 'helpers/components/navigation/component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector       : 'helpers-navigation-group-item',
    templateUrl    : './template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [NgClass, NgIf, MatIconModule, NgFor, HelpersNavigationBasicItemComponent, HelpersNavigationCollapsableItemComponent, forwardRef(() => HelpersNavigationGroupItemComponent)],
})
export class HelpersNavigationGroupItemComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_autoCollapse: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() autoCollapse: boolean;
    @Input() item: HelpersNavigationItem;
    @Input() name: string;

    private _HelpersNavigationComponent: HelpersNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _helpersNavigationService: HelpersNavigationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the parent navigation component
        this._HelpersNavigationComponent = this._helpersNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._HelpersNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll),
        ).subscribe(() =>
        {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
