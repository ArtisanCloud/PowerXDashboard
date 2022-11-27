export default [
  {
    name: '首页',
    path: '/dashboard',
    component: '@/pages/Dashboard',
  },

  {
    name: '营销获客',
    path: '/crm/channel',
    routes: [
      {
        name: '渠道活码',
        path: '/crm/channel/contactWay',
        component: '@/pages/Customer/ContactWay',
      },
    ],
  },
  {
    name: '客户维护',
    path: '/crm/maintenance',
    routes: [
      {
        name: '客户群发',
        path: '/crm/maintenance/sendChatMessage',
        component: '@/pages/Customer/SendChatMessage',
      },
      {
        name: '客户群群发',
        path: '/crm/maintenance/sendGroupChatMessage',
        component: '@/pages/Customer/SendGroupChatMessage',
      },
    ],
  },

  {
    name: '客户管理',
    path: '/crm/customer',
    routes: [
      {
        name: '客户标签',
        path: '/crm/customer/tag',
        component: '@/pages/Customer/Tag',
      },
      {
        name: '客户管理',
        path: '/crm/customer/index',
        component: '@/pages/Customer',
      },
      {
        name: '客户迁移',
        path: '/crm/customer/transfer',
        component: '@/pages/Customer/Transfer',
      },
    ],
  },

  {
    name: '客户群运营',
    path: '/crm/customer/group',
    routes: [
      {
        name: '客户群列表',
        path: '/crm/customer/group/list',
        component: '@/pages/Customer/Group',
      },
      {
        name: '客户群标签',
        path: '/crm/customer/group/tag',
        component: '@/pages/Customer/Group/Tag',
      },
    ],
  },
  {
    name: '标签管理',
    path: '/crm/tag',
    component: '@/pages/Tag',
  },
  {
    name: '配置中心',
    path: '/setting',
    routes: [
      {
        name: '员工管理',
        path: '/setting/employee',
        icon: 'HomeOutlined',
        component: '@/pages/Setting/Employee',
      },
      {
        name: '权限管理',
        path: '/setting/permission',
        icon: 'HomeOutlined',
        component: '@/pages/Setting/Permission',
      },
      {
        name: '角色配置',
        path: '/setting/role',
        icon: 'HomeOutlined',
        routes: [
          {
            name: '角色添加',
            path: '/setting/role/create',
            icon: 'HomeOutlined',
            component: '@/pages/Setting/Role/create',
          },
        ],
      },
      {
        name: '菜单配置',
        path: '/setting/menu',
        icon: 'HomeOutlined',
        component: '@/pages/Setting/Menu',
      },
    ],
  },
];
