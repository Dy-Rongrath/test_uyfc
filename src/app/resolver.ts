import { inject } from '@angular/core';
import { Router } from '@angular/router';

import jwt_decode from 'jwt-decode';
import { Observable, forkJoin, map } from 'rxjs';
import { NavigationService } from 'app/core/navigation/service';
import { NotificationsService } from 'app/layout/common/notifications/service';
import { AuthService } from './core/auth/service';
import { UserService } from './core/user/service';

const roleServiceMap = {
  SuperAdmin: {
    navigationServiceMethod: 'getSuperAdminNavigation',
    notificationsServiceMethod: 'getAll',
  },
  BranchManager: {
    navigationServiceMethod: 'getBranchManagerNavigation',
    notificationsServiceMethod: 'getAll',
  },
  BranchMember: {
    navigationServiceMethod: 'getBranchMemberNavigation',
    notificationsServiceMethod: 'getAll',
  },
  GroupManager: {
    navigationServiceMethod: 'getGroupManagerNavigation',
    notificationsServiceMethod: 'getAll',
  },
  Member: {
    navigationServiceMethod: 'getMemberNavigation',
    notificationsServiceMethod: 'getAll',
  },
};

export const initialDataResolver = () => {
  const router = inject(Router);
  const token = inject(AuthService).access_token;
  const navigationService = inject(NavigationService);
  const notificationsService = inject(NotificationsService);

  const tokenPayload: any = jwt_decode(token);
  const user = (inject(UserService).user = tokenPayload.user);

  // Fetch role from localStorage
  const storedRole = localStorage.getItem('currentRole');

  let role: string | null = null;

  //if there currentRole alrd exist in localstroage we use it, if it doesnt then we set user role the first role in the user data and set it in localstorage
  if (storedRole) {
    role = storedRole;
  } else {
    role = user.roles[0];
    localStorage.setItem('currentRole', JSON.stringify(role));
  }

  // Check if role exists and fetch data accordingly
  if (role) {
    const roleConfig = roleServiceMap[role];
    if (roleConfig) {
      const navigationObservable =
        navigationService[roleConfig.navigationServiceMethod]();
      const notificationsObservable =
        notificationsService[roleConfig.notificationsServiceMethod]();
      return forkJoin({
        navigation: navigationObservable,
        notifications: notificationsObservable,
      });
    }

    // console.log(roleConfig);
  }

  // If role config not found or no role, clear any stored data and navigate to the default page
  localStorage.clear();
  sessionStorage.clear();
  router.navigateByUrl('');
  return new Observable<any[]>();
};
