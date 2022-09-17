import { DEFAULT_LAYOUT, EMPTY_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Scrm: AppRouteRecordRaw = {
  path: '/scrm',
  name: 'Scrm',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.scrm',
    requiresAuth: true,
    icon: 'icon-dashboard',
  },
  children: [
    // customer management
    {
      path: '/scrm/customer',
      name: 'WeWorkCustomer',
      component: EMPTY_LAYOUT,
      redirect: '/scrm/customer/list',
      meta: {
        locale: 'menu.scrm.customer',
        requiresAuth: true,
        roles: ['*'],
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: '/scrm/customer/list',
          name: 'WeWorkCustomerList',
          component: () => import('@/views/scrm/customer/index.vue'),
          meta: {
            locale: 'menu.scrm.customer',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/customer/detail/:id',
          name: 'WeWorkCustomerDetail',
          component: () => import('@/views/scrm/customer/detail/index.vue'),
          meta: {
            locale: 'menu.scrm.customer.detail',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    // customer group management
    {
      path: '/scrm/customer-group',
      name: 'WeWorkCustomerGroup',
      component: () => import('@/views/scrm/customer-group/index.vue'),
      meta: {
        locale: 'menu.scrm.customerGroup',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // tag management
    {
      path: '/scrm/tag',
      name: 'WeWorkTag',
      component: () => import('@/views/scrm/tag/index.vue'),
      meta: {
        locale: 'menu.scrm.tag',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // session archive
    {
      path: '/scrm/session-archive',
      name: 'WeWorkSessionArchive',
      component: () => import('@/views/scrm/session-archive/index.vue'),
      meta: {
        locale: 'menu.scrm.sessionArchive',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // enterprise wechat qr code
    {
      path: '/scrm/enterprise-qr',
      name: 'WeWorkEnterpriseQR',
      component: () => import('@/views/scrm/enterprise-qr/index.vue'),
      meta: {
        locale: 'menu.scrm.enterpriseQR',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // smart customer service
    {
      path: '/scrm/smart-cs',
      name: 'WeWorkSmartCS',
      component: () => import('@/views/scrm/smart-cs/index.vue'),
      meta: {
        locale: 'menu.scrm.smartCS',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default Scrm;
