import { inject }       from '@angular/core';
import { Router }       from '@angular/router';
import { of }           from 'rxjs';
import { map, take }    from 'rxjs/operators';
import { UserService }  from 'app/core/user/service';
import { SystemRole }   from 'app/layout/common/user/role.enum';
import { NavigationService } from 'app/core/navigation/service';

export const roleResolver = (allowedRoles: string | string[]) => {
    return () => {
        const _navigationService    = inject(NavigationService);
        const router                = inject(Router);
        const userService           = inject(UserService);

        // console.log(_navigationService.getSuperAdminNavigation());

        return userService.user$.pipe(
            take(1),
            map(user => {
                const currentRole = localStorage.getItem('currentRole');
                // console.log('Current role:', currentRole);

                // Convert currentRole to array                   
                const currentRoles: string[] = currentRole ? [currentRole] : [];
                if (user && currentRoles.some(role => Array.isArray(allowedRoles) ? allowedRoles.includes(role) : role === allowedRoles)) {
                    return true; // User has a valid role
                } else {

                    // Navigate to the appropriate route based on the user's role
                    const userRole = allowedRoles.includes(currentRole); // Assume first role as primary for navigation
                    // console.log('allowrole:', allowedRoles);
                    // Use switch-case for clarity
                    
                    if (!userRole) {

                        if (currentRole === SystemRole.SuperAdmin) {
                            
                            router.navigateByUrl('/superadmin/dashboard')

                        } else if (currentRole === SystemRole.BranchManager) {
                            router.navigateByUrl('/branchmanager/dashboard')
                            
                        } else if (currentRole === SystemRole.BranchMember) {
                            router.navigateByUrl('/branchmember/dashboard')
                            
                        } else if (currentRole === SystemRole.GroupManager) {
                            router.navigateByUrl('/groupmanager/dashboard')
                        } else {

                            // Navigate to a default or home route
                            router.navigateByUrl('/account'); // Navigate to a default or home route
                        }
                        // Show unauthorized access message
                        return of(false);
                    }

                }
                    
            })
        );
    };
};
