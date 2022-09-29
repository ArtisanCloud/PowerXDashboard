export default [
  {
    name: '首页',
    path: '/dashboard',
    component: '@/pages/Dashboard',
    routes: [
      {
        name: '一级页面',
        path: '/dashboard/13',
        component: '@/pages/Table',
      },
    ],
  },
  {
    name: '权限演示',
    path: '/access',
    component: '@/pages/Access',
  },
  {
    name: ' CRUD 示例',
    path: '/table',
    component: '@/pages/Table',
  },
];
