import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const InfoOrganization: AppRouteRecordRaw = {
  path: '/info-organization',
  name: 'Info Organization',
  component: DEFAULT_LAYOUT,
  meta: {
    order: 4,
    locale: 'menu.infoOrganization',
    requiresAuth: true,
    icon: 'icon-tags',
  },
  children: [
    {
      path: '/info-organization/label',
      name: 'Label',
      component: () => import('@/views/info-organization/label/index.vue'),
      meta: {
        icon: 'icon-mind-mapping',
        locale: 'menu.infoOrganization.label',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: '/info-organization/tag',
      name: 'Tag',
      component: () => import('@/views/info-organization/tag/index.vue'),
      meta: {
        icon: 'icon-tag',
        locale: 'menu.infoOrganization.tag',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: '/info-organization/category',
      name: 'Category',
      component: () => import('@/views/info-organization/category/index.vue'),
      meta: {
        icon: 'icon-apps',
        locale: 'menu.infoOrganization.category',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};
export default InfoOrganization;
