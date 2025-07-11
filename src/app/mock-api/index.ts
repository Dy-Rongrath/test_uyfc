// ================================================================================>> Core Library

// ================================================================================>> Thrid Party Library

// ================================================================================>> Custom Library
// Mock API
import { NotificationsMockApi }              from 'app/mock-api/common/notifications/api';

// Local
import { NavigationSuperAdminMockApi }       from './common/navigation/superadmin/api';
import { NavigationBranchMemberMockApi }     from './common/navigation/branchmember/api';
import { NavigationBranchManagerMockApi }    from './common/navigation/branchmanager/api';
import { NavigationGroupManagerMockApi }     from './common/navigation/groupmanager/api';
import { NavigationMemberMockApi }           from './common/navigation/member/api';


export const mockApiServices = [
    NavigationSuperAdminMockApi,
    NavigationBranchMemberMockApi,
    NavigationBranchManagerMockApi,
    NavigationGroupManagerMockApi,
    NotificationsMockApi,
    NavigationMemberMockApi
];
