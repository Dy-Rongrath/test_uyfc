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
import { MemberNavigation } from './data';

@Injectable({ providedIn: 'root' })
export class NavigationMemberMockApi {
    private readonly Navigation: HelpersNavigationItem[] = MemberNavigation;

    constructor(private _helpersMockApiService: HelpersMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._helpersMockApiService.onGet('api/navigation/member').reply(() => {
            // Return a successful response with a cloned default navigation data
            return [200, { default: cloneDeep(this.Navigation) }];
        });
    }
}