// ================================================================================>> Core Library
import { Injectable } from '@angular/core';

// ================================================================================>> Thrid Party Library
// Lodash-es
import { cloneDeep } from 'lodash-es';

// ================================================================================>> Custom Library
// Helper
import { HelpersNavigationItem } from 'helpers/components/navigation';
import { HelpersMockApiService } from 'helpers/mock-api';

// Local
import { NavigationBranchMember }     from './data';

@Injectable({ providedIn: 'root' })
export class NavigationBranchMemberMockApi {
    private readonly navigationManager: HelpersNavigationItem[] = NavigationBranchMember;

    constructor(private _helpersMockApiService: HelpersMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._helpersMockApiService.onGet('api/navigation/branchmember').reply(() => {
            // Return a successful response with a cloned default navigation data
            return [200, { default: cloneDeep(this.navigationManager) }];
        });
    }
}