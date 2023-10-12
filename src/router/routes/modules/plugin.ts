import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Plugin: AppRouteRecordRaw = {
  path: '/plugin',
  name: 'Plugin',
  component: DEFAULT_LAYOUT,
  redirect: '/home/index',
  meta: {
    order: 100,
    locale: 'menu.plugin',
    requiresAuth: true,
    icon: 'icon-plus',
  },
  children: [],
};

export default Plugin;
