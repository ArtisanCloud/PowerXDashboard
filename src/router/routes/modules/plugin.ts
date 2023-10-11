import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Plugin: AppRouteRecordRaw = {
  path: '/plugin',
  name: 'Plugin',
  component: DEFAULT_LAYOUT,
  redirect: '/home/index',
  meta: {
    order: -1,
    locale: '插件列表',
    requiresAuth: true,
    icon: 'icon-plus',
  },
  children: [],
};

export default Plugin;
