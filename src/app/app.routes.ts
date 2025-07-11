// ================================================================================>> Core Library
import { Route } from '@angular/router';

// ================================================================================>> Local Library
import { initialDataResolver } from 'app/resolvers';
import { roleResolver } from 'app/core/auth/resolvers/role.resolver';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/component';
import { SystemRole } from './layout/common/user/role.enum';

export const appRoutes: Route[] = [
  // ================================================================================>> Authenticated Routes

  // Redirect empty path to '/dashboard'
  { path: '', pathMatch: 'full', redirectTo: 'superadmin/dashboard' },
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    component: LayoutComponent,
    data: { layout: 'empty' },
    loadChildren: () =>
      import('app/resources/account/auth/routes').then((m) => m.default),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    resolve: { initialData: initialDataResolver },
    children: [
    ],
  },
];
