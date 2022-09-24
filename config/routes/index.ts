import routesInstall from './install';
import routesUser from './user';
import routesAdmin from './admin';

export default [
  // routes for installing system
  routesInstall,

  // routes for user to auth
  routesUser,

  // routes for authorized user
  {
    path: '/',
    redirect: '/home',
    wrappers: ['@/wrappers/auth'],
    routes: routesAdmin,
  },
];
