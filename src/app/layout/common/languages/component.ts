// ================================================================================>> Core Library
import { NgFor, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

// ================================================================================>> Thrid Party Library
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

// RxJS
import { take } from 'rxjs';

// Transloco
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';

// ================================================================================>> Custom Library
// Helper
import { HelpersNavigationService, HelpersNavigationComponent } from 'helpers/components/navigation';

@Component({
    selector: 'languages',
    templateUrl: './template.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'languages',
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, NgTemplateOutlet, NgFor],
})
export class LanguagesComponent implements OnInit, OnDestroy {
    availableLangs: AvailableLangs;
    activeLang: string;
    flagCodes: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _helpersNavigationService: HelpersNavigationService,
        private _translocoService: TranslocoService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the available languages from transloco
        this.availableLangs = this._translocoService.getAvailableLangs();

        // Subscribe to language changes
        this._translocoService.langChanges$.subscribe((activeLang) => {
            // Get the active lang
            this.activeLang = activeLang;

            // Update the navigation
            this._updateNavigation(activeLang);
        });

        // Set the country iso codes for languages for flags
        this.flagCodes = {
            'en': 'us',
            'kh': 'kh',
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: string): void {
        // Set the active lang
        this._translocoService.setActiveLang(lang);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the navigation
     *
     * @param lang
     * @private
     */
    private _updateNavigation(lang: string): void {
        // For the demonstration purposes, we will only update the Dashboard names
        // from the navigation but you can do a full swap and change the entire
        // navigation data.
        //
        // You can import the data from a file or request it from your backend,
        // it's up to you.

        // Get the component -> navigation data -> item
        const navComponent = this._helpersNavigationService.getComponent<HelpersNavigationComponent>('mainNavigation');

        // Return if the navigation component does not exist
        if (!navComponent) {
            return null;
        }

        // Get the flat navigation data
        const navigation = navComponent.navigation;

        // Get the dashboard item by id and update its title
        const projectDashboardItem = this._helpersNavigationService.getItem('dashboard', navigation);
        if (projectDashboardItem) {
            this._translocoService.selectTranslate('dashboard').pipe(take(1)).subscribe((translation) => {
                // Set the title
                projectDashboardItem.title = translation;
                // Refresh the navigation component
                navComponent.refresh();
            });
        }
    }
}
