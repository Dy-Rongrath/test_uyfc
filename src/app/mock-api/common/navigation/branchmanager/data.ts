// ================================================================================>> Core Library

// ================================================================================>> Thrid Party Library

// ================================================================================>> Custom Library
// Helper
import { HelpersNavigationItem } from 'helpers/components/navigation';

export const NavigationBranchManager: HelpersNavigationItem[] = [

    //===================================>> Dashboard
    {
        id: 'dashboard',
        title: 'ផ្ទាំងព័ត៌មាន',
        type: 'basic',
        icon : 'mat_outline:dashboard',
        link: '/branchmanager/dashboard'
        
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
                link: '/branchmanager/administrative/letter-in'
            },
            {
                id: 'letter-out',
                title: 'លិខិតចេញ',
                type: 'basic',
                link: '/branchmanager/administrative/letter-out'
            },
            {
                id: 'visitor',
                title: 'អ្នកទស្សនា',
                type: 'basic',
                link: '/branchmanager/administrative/visitor'
            },
            {
                id: 'application',
                title: 'កម្មវិធី',
                type: 'basic',
                link: '/branchmanager/administrative/application'
            }
        ]
    },
    // //===================================>> Finance 
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
                link: '/branchmanager/finance/revenue'
            },
            {
                id: 'cost',
                title: 'កត់ត្រាចំណាយ',
                type: 'basic',
                link: '/branchmanager/finance/cost'
            },
            {
                id: 'material',
                title: 'គ្រប់គ្រងសារពើភ័ណ្ឌ',
                type: 'basic',
                link: '/branchmanager/finance/material'
            },
        ]
    },

    //===================================>> Manage-Member
    {
        id: 'manage-members',
        title: 'គ្រប់គ្រងសមាជិក',
        type: 'collapsable',
        icon: 'feather:user',
        children: [
            {
                id: 'members',
                title: 'សមាជិក-សមាជិកា',
                type: 'basic',
                link: '/branchmanager/manage-members/members'
            },
            {
                id: 'resign',
                title: 'លាឈប់ពីការងារ',
                type: 'basic',
                link: '/branchmanager/manage-members/resign'
            },
            {
                id: 'move-work',
                title: 'ផ្លាស់ប្តូរកន្លែងការងារ',
                type: 'basic',
                link: '/branchmanager/manage-members/move-work'
            },
        ]
    },

    //===================================>> Developing Capacity
    {
        id: 'developing-capacity',
        title: 'អភិវឌ្ឍសមត្ថភាព',
        type: 'collapsable',
        icon: 'feather:clipboard',
        children: [
            {
                id: 'training',
                title: 'វគ្គបណ្តុះបណ្តាល',
                type: 'basic',
                link: '/branchmanager/developing-capacity/training'
            },
            {
                id: 'study-tour',
                title: 'ទស្សនៈកិច្ចសិក្សា',
                type: 'basic',
                link: '/branchmanager/developing-capacity/study-tour'
            },
        ]
    },

    //===================================>> Disseminate News
    {
        id: 'disseminate-news',
        title: 'ផ្សព្វផ្សាយព័ត៍មាន',
        type: 'basic',
        icon: 'feather:share-2',
        link: '/branchmanager/disseminate-news'
    },

    // //===================================>> Observation
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
                link: '/branchmanager/observations/voting'
            },
            {
                id: 'exam',
                title: 'ប្រឡង',
                type: 'basic',
                link: '/branchmanager/observations/exam'
            },
        ]
    },

    // //===================================>> activities
    {
        id: 'activity',
        title: 'សកម្មភាពប្រចាំថ្ងៃ',
        type: 'basic',
        icon: 'feather:activity',
        link: '/branchmanager/activity'
    },

    // //===================================>> Groupwork
    {
        id: 'group',
        title: 'ក្រុមការងារ',
        type: 'basic',
        icon: 'mat_solid:groups',
        link: '/branchmanager/groupwork'
    },

    // //===================================>> BranchInfo
    {
        id: 'about-branch',
        title: 'ព័ត៌មានសាខា',
        type: 'basic',
        icon: 'mat_outline:info',
        link: '/branchmanager/branch-info'
    },
];
