// ================================================================================>> Core Library
import { Component, ViewChild } from '@angular/core';

// ================================================================================>> Thrid Party Library
// Material
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';

// ================================================================================>> Custom Library
// Local
import { ChangePasswordComponent } from '../profile/change-password/component';
import { LogsComponent } from './logs/component';
import { TwoFactorComponent } from './two-factor/component';

@Component({
    selector: 'account-security',
    standalone: true,
    imports: [MatTabsModule, ChangePasswordComponent, TwoFactorComponent, LogsComponent],
    templateUrl: './template.html',
    styleUrls: ['./style.scss']
})
export class SecurityComponent {
    @ViewChild('tabGroup') tabGroup: MatTabGroup;
    constructor() { }

    tabChanged(selectedIndex: number): void {
        // This function is called when the tab selection changes
        const selectedTab = this.tabGroup._tabs.toArray()[selectedIndex];
        console.log(selectedTab.textLabel);
    }
}
