// import from constant

export default {
  path: '/user',
  layout: false,
  routes: [
    {
      name: 'login',
      path: '/user/login',
      component: './User/Login',
    },
    {
      name: 'authorized',
      path: '/user/system/authorized',
      component: './User/Authorized',
    },
  ],
};
