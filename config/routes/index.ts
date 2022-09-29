import routesInstall from './install';
import routesAuth from './auth';
import routesAdmin from './admin';

export default [
  {
    path: '/',
    layout: false,
    component: './Home',
  },

  // routes for installing system
  routesInstall,

  // routes for user to auth
  routesAuth,

  // routes for authorized user
  ...routesAdmin,
];
