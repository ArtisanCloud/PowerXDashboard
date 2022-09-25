import routesInstall from './install';
import routesAuth from './auth';
import routesAdmin from './admin';

export default [
  // routes for installing system
  routesInstall,

  // routes for user to auth
  routesAuth,

  // routes for authorized user
  {
    path: '/',
    redirect: '/home',
    wrappers: ['@/wrappers/auth'],
    routes: routesAdmin,
  },
];
