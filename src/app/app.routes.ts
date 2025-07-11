// ================================================================================>> Core Library
import { Route } from '@angular/router';

// ================================================================================>> Local Library
import { initialDataResolver } from './resolver';
import { roleResolver } from './core/auth/resolvers/role.resolver';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from './layout/component';
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
      import('./resources/account/auth/routes').then((m) => m.default),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    resolve: { initialData: initialDataResolver },
    children: [],
  },
];
