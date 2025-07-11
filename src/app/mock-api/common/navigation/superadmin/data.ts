// ================================================================================>> Core Library

// ================================================================================>> Thrid Party Library

// ================================================================================>> Custom Library
// Helper
import { HelpersNavigationItem } from "helpers/components/navigation";

export const NavigationSuperAdmin: HelpersNavigationItem[] = [
  //===================================>> Dashboard
  {
    id: "dashboard",
    title: "ផ្ទាំងព័ត៌មាន",
    type: "basic",
    icon: "mat_outline:dashboard",
    link: "superadmin/dashboard",
  },

  // //===================================>> branch
  {
    id: "branch",
    title: "សាខា",
    type: "basic",
    icon: "mat_outline:account_tree",
    link: "/superadmin/branch",
  },
  
  // //===================================>> Report
  // {
  //   id: "reports",
  //   title: "អភិវឌ្ឍសមត្ថិភាព",
  //   icon: "mat_outline:assignment",
  //   // link: "/admin/reports",
  //   type: "collapsable",
  //   children: [
  //     {
  //       id: "training",
  //       title: "វគ្គបណ្តុះបណ្តាល",
  //       type: "basic",
  //       link: "/superadmin/reports/training",
  //     },
  //     {
  //       id: "visitor",
  //       title: "ទស្សនៈកិច្ចសិក្សា",
  //       type: "basic",
  //       link: "/superadmin/reports/visitor",
  //     },
  //   ],
  // },

  // //===================================>> Member
  {
    id: "member",
    title: "សមាជិក-សមាជិកា",
    type: "basic",
    icon: "mat_outline:supervisor_account",
    link: "/superadmin/member",
  },

  // //===================================>> User
  {
    id: "user",
    title: "អ្នកប្រើប្រាស់",
    type: "basic",
    icon: "mat_outline:groups",
    link: "/superadmin/user",
  },

  //===================================>> Setting
  {
    id: "setting",
    title: "ការកំណត់",
    type: "collapsable",
    icon: "mat_outline:settings",
    children: [
      // {
      //   id: "role",
      //   title: "តួនាទី",
      //   type: "basic",
      //   link: "/superadmin/setting/role",
      // },

      {
        id: "UserTitle",
        title: "ងារ",
        type: "basic",
        link: "/superadmin/setting/UserTitle",
      },

      // {
      //   id: "position",
      //   title: "មុខតំណែង",
      //   type: "basic",
      //   link: "/superadmin/setting/position",
      // },

      {
        id: "TypeLetter",
        title: "ប្រភេទលិខិត",
        type: "basic",
        link: "/superadmin/setting/TypeLetter",
      },

      {
        id: "TypeAnnouncement",
        title: "ប្រភេទខ្លឹមសារ",
        type: "basic",
        link: "/superadmin/setting/TypeAnnouncement",
      },

      {
        id: "TypeElection",
        title: "ប្រភេទការបោះឆ្នោត",
        type: "basic",
        link: "/superadmin/setting/TypeElection",
      },
    ],
  },
];
