import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Home: AppRouteRecordRaw = {
  path: '/home',
  name: 'Home',
  component: DEFAULT_LAYOUT,
  redirect: '/home/index',
  meta: {
    locale: 'menu.home',
    requiresAuth: true,
    icon: 'icon-home',
    order: -1,
  },
  children: [
    {
      path: '/home/index',
      name: 'HomeIndex',
      component: () => import('@/views/home/index.vue'),
      meta: {
        locale: 'menu.home.index',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};
export default Home;
