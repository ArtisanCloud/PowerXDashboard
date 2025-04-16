import { DEFAULT_LAYOUT } from '@/router/routes/base';

import { AppRouteRecordRaw } from '../types';

const SCRMOfficialAccount: AppRouteRecordRaw = {
  path: '/scrm/official-account',
  name: 'SCRM Official Account',
  component: DEFAULT_LAYOUT,
  meta: {
    order: 3,
    locale: 'menu.scrm.official',
    requiresAuth: true,
    icon: 'icon-wechat',
  },
  children: [
    {
      path: '/scrm/official-account/menu',
      name: 'Wechat Official Account Menu',
      component: () => import('@/views/scrm/official-account/menu/index.vue'),
      meta: {
        locale: 'menu.scrm.official.menu',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: '/scrm/official-account/media',
      name: 'Wechat Official Account Media',
      component: () => import('@/views/scrm/official-account/media/index.vue'),
      meta: {
        locale: 'menu.scrm.official.media',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SCRMOfficialAccount;
