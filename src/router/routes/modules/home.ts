import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Home: AppRouteRecordRaw = {
  path: '/home',
  name: 'Home',
  component: DEFAULT_LAYOUT,
  redirect: '/home/index',
  meta: {
    order: -1,
    locale: 'menu.home',
    requiresAuth: true,
    icon: 'icon-home',
  },
  children: [
    {
      path: '/home/index',
      name: 'HomeIndex',
      component: () => import('@/views/home/index.vue'),
      meta: {
        icon: 'icon-dashboard',
        locale: 'menu.dashboard',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};
export default Home;
