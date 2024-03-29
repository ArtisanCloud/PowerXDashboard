import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const OfficialAccount: AppRouteRecordRaw = {
  path: '/wechat-official-account',
  name: 'Wechat Official Account',
  component: DEFAULT_LAYOUT,
  meta: {
    order: 3,
    locale: 'menu.wechat.official',
    requiresAuth: true,
    icon: 'icon-wechat',
  },
  children: [
    {
      path: '/wechat-official-account/menu',
      name: 'Wechat Official Account Menu',
      component: () => import('@/views/wechat/official-account/menu/index.vue'),
      meta: {
        locale: 'menu.wechat.official.menu',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: '/wechat-official-account/media',
      name: 'Wechat Official Account Media',
      component: () =>
        import('@/views/wechat/official-account/media/index.vue'),
      meta: {
        locale: 'menu.wechat.official.media',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default OfficialAccount;
