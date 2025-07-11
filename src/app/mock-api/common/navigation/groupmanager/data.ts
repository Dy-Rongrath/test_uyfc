import { HelpersNavigationItem } from 'helpers/components/navigation';

export const GroupManagerNavigation: HelpersNavigationItem[] = [

       //===================================>> Dashboard
    {
        id: 'dashboard',
        title: 'ផ្ទាំងព័ត៌មាន',
        type: 'basic',
        icon : 'mat_outline:dashboard',
        link: '/groupmanager/dashboard'
    },

    //===================================>> Administrative 
    {
        id: 'administrative',
        title: 'រដ្ឋបាល',
        type: 'collapsable',
        icon: 'mat_solid:library_books',
        children: [
            {
                id: 'letter-in',
                title: 'លិខិតចូល',
                type: 'basic',
                link: '/groupmanager/administrative/letter-in'
            },
            {
                id: 'letter-out',
                title: 'លិខិតចេញ',
                type: 'basic',
                link: '/groupmanager/administrative/letter-out'
            },
            
            // {
            //     id: 'visitor',
            //     title: 'អ្នកទស្សនា',
            //     type: 'basic',
            //     link: '/groupmanager/administrative/visitor'
            // },
            {
                id: 'application',
                title: 'កម្មវិធី',
                type: 'basic',
                link: '/groupmanager/administrative/application'
            }
        ]
    },

    // //===================================>> Finance <<<----------------------------------------------------------------
    // {
    //     id: 'finance',
    //     title: 'ហិរញ្ញវត្ថុ',
    //     type: 'collapsable',
    //     icon: 'mat_outline:account_balance',
    //     children: [
    //         {
    //             id: 'revenue',
    //             title: 'កត់ត្រាចំណូល',
    //             type: 'basic',
    //             link: '/groupmanager/finance/revenue'
    //         },
    //         {
    //             id: 'cost',
    //             title: 'កត់ត្រាចំណាយ',
    //             type: 'basic',
    //             link: '/groupmanager/finance/cost'
    //         },
    //         {
    //             id: 'material',
    //             title: 'គ្រប់គ្រងសាពើភ័ណ្ឌ',
    //             type: 'basic',
    //             link: '/groupmanager/finance/material'
    //         },
    //     ]
    // },

    // //===================================>> Member
    {
        id: 'membership',
        title: 'គ្រប់គ្រងសមាជិក',
        type: 'collapsable',
        icon: 'feather:user',
        // link: '/branchmember/member'
        children: [
            {
                id: 'member',
                title: 'សមាជិក-សមាជិកា',
                type: 'basic',
                link: '/groupmanager/membership/member'
            },
            {
                id: 'resign',
                title: 'លាឈប់ពីការងារ',
                type: 'basic',
                link: '/groupmanager/membership/resign'
            },
            {
                id: 'change-workplace',
                title: 'ផ្លាស់ប្តូរកន្លែងការងារ',
                type: 'basic',
                link: '/groupmanager/membership/change-workplace'
            },
        ]
    },

    // //===================================>> ​report
    // {
    //     id: 'development',
    //     title: 'អភិវឌ្ឍសមត្ថភាព​',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:clipboard',
    //     children: [
    //         {
    //             id      : 'training',
    //             title   : 'វគ្គបណ្តុះបណ្តាល',
    //             type    : 'basic',
    //             link    : '/groupmanager/development/training'
    //         },
    //         {
    //             id      : 'study-tour',
    //             title   : 'ទស្សនៈកិច្ចសិក្សា',
    //             type    : 'basic',
    //             link    : '/groupmanager/development/study-tour'
    //         },
    //     ]
    // },

    // // //===================================>> share
    {
        id: 'media',
        title: 'ផ្សព្វផ្សាយព័ត៌មាន',
        type: 'basic',
        icon: 'feather:share-2',
        link: '/groupmanager/media'
    },

    
    // // //===================================>> see
    {
        id: 'observations',
        title: 'សង្កេតការ',
        type: 'collapsable',
        icon: 'mat_outline:filter_center_focus',
        children: [
            {
                id: 'voting',
                title: 'បោះឆ្នោត',
                type: 'basic',
                link: '/groupmanager/observations/voting'
            },
            {
                id: 'exam',
                title: 'ប្រឡង',
                type: 'basic',
                link: '/groupmanager/observations/exam'
            },
        ]
    },

    // // //===================================>> activities
    {
        id: 'activity',
        title: 'សកម្មភាពប្រចាំថ្ងៃ',
        type: 'basic',
        icon: 'feather:activity',
        link: '/groupmanager/activity'
    },

];
