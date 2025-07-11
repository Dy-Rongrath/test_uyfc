// ================================================================================>> Core Library
import { Routes } from '@angular/router';

// ================================================================================>> Thrid Party Library

// ================================================================================>> Custom Library
// Local
import { AccountComponent } from './component';
import { ProfileComponent } from './profile/component';

export default [
    {
        path     : '',
        component: AccountComponent,
    },
    {
        path: '',
        children:[
            {
                path: 'profile',
                component: ProfileComponent
            }
        ]
    },
] as Routes;
