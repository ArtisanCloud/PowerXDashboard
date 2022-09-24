export default [
  {
    name: '首页',
    path: '/home',
    component: './Home',
    routes: [
      {
        name: '一级页面',
        path: '/home/13',
        component: './Table',
      },
    ],
  },
  {
    name: '权限演示',
    path: '/access',
    component: './Access',
  },
  {
    name: ' CRUD 示例',
    path: '/table',
    component: './Table',
  },
];
