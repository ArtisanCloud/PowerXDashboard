export default {
  path: '/install',
  layout: false,
  routes: [
    {
      name: '安装系统',
      path: '/install',
      component: './Init/Install',
      layout: false,
    },
    {
      name: '初始化Root账号',
      path: '/install/root/init',
      component: './Init/Root',
      layout: false,
    },
  ],
};
