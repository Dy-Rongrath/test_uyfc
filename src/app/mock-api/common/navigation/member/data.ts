import { HelpersNavigationItem } from 'helpers/components/navigation';

export const MemberNavigation: HelpersNavigationItem[] = [

    //===================================>> Dashboard
    // {
    //     id: 'dashboard',
    //     title: 'ផ្ទាំងព័ត៌មាន',
    //     type: 'basic',
    //     icon : 'mat_outline:dashboard',
    //     link: '/finance/dashboard'
    // },
    //===================================>> Customers
    // {
    //     id: 'customers',
    //     title: 'អតិថិជន',
    //     type: 'collapsable',
    //     icon: 'mat_outline:groups',
    //     children: [
    //         {
    //             id: 'guest',
    //             title: 'ភ្ញៀវ',
    //             type: 'basic',
    //             link: '/finance/customers/guest'
    //         },
    //         {
    //             id: 'customer',
    //             title: 'អតិថិជន',
    //             type: 'basic',
    //             link: '/finance/customers/customer'
    //         }
    //     ]
    // },
    // //===================================>> Account
    {
        id: 'account',
        title: 'គណនី',
        type: 'basic',
        icon: 'heroicons_outline:user-circle',
        link: '/account'
    }
];
