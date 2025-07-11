// ================================================================================>> Core Library
import { Routes } from '@angular/router';

// ================================================================================>> Third Party Library

// ================================================================================>> Custom Library
// Local
// import { VerifyComponent } from './verify-otp/component';
// import { SignInComponent } from './sign-in/component';

export default [
    {
        path     : 'sign-in',
        loadComponent: () => import("./sign-in/component").then(m => m.SignInComponent)
    },
    // {
    //     path     : 'verify',
    //     component: VerifyComponent,
    // },
    
] as Routes;
