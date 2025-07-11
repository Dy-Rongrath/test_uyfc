// ================================================================================>> Core Library

// ================================================================================>> Thrid Party Library

// ================================================================================>> Custom Library
// Helper
import { HelpersNavigationItem } from 'helpers/components/navigation';

export const NavigationBranchMember: HelpersNavigationItem[] = [
    //===================================>> Dashboard
    {
        id: 'dashboard',
        title: 'ផ្ទាំងព័ត៌មាន',
        type: 'basic',
        icon : 'mat_outline:dashboard',
        link: '/branchmember/dashboard'
        
    },
    //===================================>> Administrative 
    {
        id: 'administrative',
        title: 'ការងាររដ្ឋបាល',
        type: 'collapsable',
        icon: 'mat_solid:library_books',
        children: [

            {
                id: 'letter-in',
                title: 'លិខិតចូល',
                type: 'basic',
                link: '/branchmember/administrative/letter-in'
            },
            
            {
                id: 'letter-out',
                title: 'លិខិតចេញ',
                type: 'basic',
                link: '/branchmember/administrative/letter-out'
            },

            {
                id: 'visitor',
                title: 'អ្នកទស្សនា',
                type: 'basic',
                link: '/branchmember/administrative/visitor'
            },
            {
                id: 'application',
                title: 'កម្មវិធី',
                type: 'basic',
                link: '/branchmember/administrative/application'
            }
        ]
    },

    // //===================================>> Finance <<<----------------------------------------------------------------
    {
        id: 'finance',
        title: 'ការងារហិរញ្ញវត្ថុ',
        type: 'collapsable',
        icon: 'mat_outline:account_balance',
        children: [
            {
                id: 'revenue',
                title: 'កត់ត្រាចំណូល',
                type: 'basic',
                link: '/branchmember/finance/revenue'
            },
            {
                id: 'cost',
                title: 'កត់ត្រាចំណាយ',
                type: 'basic',
                link: '/branchmember/finance/cost'
            },
            {
                id: 'material',
                title: 'គ្រប់គ្រងសាពើភ័ណ្ឌ',
                type: 'basic',
                link: '/branchmember/finance/material'
            },
        ]
    },

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
                link: '/branchmember/membership/member'
            },
            {
                id: 'resign',
                title: 'លាឈប់ពីការងារ',
                type: 'basic',
                link: '/branchmember/membership/resign'
            },
            {
                id: 'change-workplace',
                title: 'ផ្លាស់ប្តូរកន្លែងការងារ',
                type: 'basic',
                link: '/branchmember/membership/change-workplace'
            },
        ]
    },

    // //===================================>> ​report
    {
        id: 'development',
        title: 'អភិវឌ្ឍសមត្ថភាព​',
        type: 'collapsable',
        icon: 'heroicons_outline:clipboard',
        children: [
            {
                id      : 'training',
                title   : 'វគ្គបណ្តុះបណ្តាល',
                type    : 'basic',
                link    : '/branchmember/development/training'
            },
            {
                id      : 'study-tour',
                title   : 'ទស្សនៈកិច្ចសិក្សា',
                type    : 'basic',
                link    : '/branchmember/development/study-tour'
            },
        ]
    },

    // //===================================>> share
    {
        id: 'media',
        title: 'ផ្សព្វផ្សាយព័ត៌មាន',
        type: 'basic',
        icon: 'feather:share-2',
        link: '/branchmember/media'
    },

    // //===================================>> see
    {
        id: 'observations',
        title: 'អ្នកសង្កេតការណ៍',
        type: 'collapsable',
        icon: 'mat_outline:filter_center_focus',
        children: [
            {
                id: 'voting',
                title: 'បោះឆ្នោត',
                type: 'basic',
                link: '/branchmember/observations/voting'
            },
            {
                id: 'exam',
                title: 'ប្រឡង',
                type: 'basic',
                link: '/branchmember/observations/exam'
            },
        ]
    },

    // //===================================>> activities
    {
        id: 'activity',
        title: 'សកម្មភាពប្រចាំថ្ងៃ',
        type: 'basic',
        icon: 'feather:activity',
        link: '/branchmember/activity'
    },
    
];
