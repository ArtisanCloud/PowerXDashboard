import { DEFAULT_LAYOUT, EMPTY_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SCRMWecom: AppRouteRecordRaw = {
  path: '/scrm/wecom',
  name: 'Scrm WeCom',
  meta: {
    order: 3,
    locale: 'menu.scrm.wecom',
    requiresAuth: true,
    icon: 'iconfont-icon-qiyeweixin',
  },
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: '/scrm/wecom/organization',
      name: 'WeCom Organization',
      component: () => import('@/views/scrm/wecom/organization/user/index.vue'),
      meta: {
        icon: 'icon-stamp',
        locale: 'menu.scrm.wecom.organization',
        requiresAuth: true,
        roles: ['*'],
      },
      // children: [
      //   {
      //     path: '/scrm/wecom/user',
      //     name: 'WeComWechatUser',
      //     component: () =>
      //       import('@/views/scrm/wecom/organization/user/index.vue'),
      //     meta: {
      //       locale: 'menu.scrm.wecom.users',
      //       requiresAuth: true,
      //       roles: ['*'],
      //     },
      //   },
      //   {
      //     path: '/scrm/wecom/user-group',
      //     name: 'WeComWechatGroup',
      //     component: () =>
      //       import('@/views/scrm/wecom/organization/user-group/index.vue'),
      //     meta: {
      //       locale: 'menu.scrm.wecom.group',
      //       requiresAuth: true,
      //       roles: ['*'],
      //     },
      //   },
      // ],
    },
    {
      path: '/scrm/wecom/marketing-acquisition',
      name: 'WeComMarketingAcquisition',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-qrcode',
        locale: 'menu.scrm.wecom.marketingAcquisition',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/scrm/wecom/marketing-acquisition/enterprise-qr',
          name: 'WeComEnterpriseQR',
          component: () =>
            import(
              '@/views/scrm/wecom/marketing-acquisition/enterprise-qr/index.vue'
            ),
          meta: {
            locale: 'menu.scrm.wecom.marketingAcquisition.enterpriseQR',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/wecom/marketing-acquisition/user-group-qr',
          name: 'WeComGroupQR',
          component: () =>
            import(
              '@/views/scrm/wecom/marketing-acquisition/group-qr/index.vue'
            ),
          meta: {
            locale: 'menu.scrm.wecom.marketingAcquisition.groupQR',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },

    // CMS
    {
      path: '/scrm/wecom/cms',
      name: 'WeComCMS',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-image',
        locale: 'menu.scrm.wecom.cms',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/scrm/wecom/cms/script-lib',
          name: 'WeComScriptLib',
          component: () =>
            import('@/views/scrm/wecom/cms/script-lib/index.vue'),
          meta: {
            locale: 'menu.scrm.wecom.cms.scriptLib',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/wecom/cms/media',
          name: 'WeComMedia',
          component: () => import('@/views/scrm/wecom/cms/media/index.vue'),
          meta: {
            locale: 'menu.scrm.wecom.cms.media',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },

    // customer management
    {
      path: '/scrm/wecom/customer-domain',
      name: 'WeComCustomerDomain',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-user',
        locale: 'menu.scrm.wecom.customerDomain',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/scrm/wecom/customer-domain/customer',
          name: 'WeComCustomer',
          component: EMPTY_LAYOUT,
          redirect: '/scrm/wecom/customer-domain/customer/list',
          meta: {
            locale: 'menu.scrm.wecom.customerDomain.customer',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
          children: [
            {
              path: '/scrm/wecom/customer-domain/customer/list',
              name: 'WeComCustomerList',
              component: () =>
                import('@/views/scrm/wecom/customer-domain/customer/index.vue'),
              meta: {
                locale: 'menu.scrm.wecom.customerDomain.customer',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: '/scrm/wecom/customer-domain/customer/detail/:id',
              name: 'WeComCustomerDetail',
              component: () =>
                import(
                  '@/views/scrm/wecom/customer-domain/customer/detail/index.vue'
                ),
              meta: {
                locale: 'menu.scrm.wecom.customerDomain.customer.detail',
                requiresAuth: true,
                roles: ['*'],
              },
            },
          ],
        },
        {
          path: '/scrm/wecom/customer-domain/tag',
          name: 'WeComCorpTag',
          component: () =>
            import('@/views/scrm/wecom/customer-domain/tag/index.vue'),
          meta: {
            locale: 'menu.scrm.wecom.customerDomain.tag',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/wecom/customer-domain/migrate',
          name: 'WeComMigrate',
          component: () =>
            import('@/views/scrm/wecom/customer-domain/migrate/index.vue'),
          meta: {
            locale: 'menu.scrm.wecom.customerDomain.migrate',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/wecom/customer-domain/black-list',
          name: 'WeComBlackList',
          component: () =>
            import('@/views/scrm/wecom/customer-domain/black-list/index.vue'),
          meta: {
            locale: 'menu.scrm.wecom.customerDomain.blackList',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },

    // customer management
    {
      path: '/scrm/wecom/operation',
      name: 'WeComOperation',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-shake',
        locale: 'menu.scrm.wecom.operation',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/scrm/wecom/operation/user-group-send',
          name: 'WeComGroupSend',
          component: () =>
            import('@/views/scrm/wecom/operation/group-send/index.vue'),
          meta: {
            locale: 'menu.scrm.wecom.operation.groupSend',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
        },
        {
          path: '/scrm/wecom/operation/welcome-script',
          name: 'WeComWelcomeScript',
          component: () =>
            import('@/views/scrm/wecom/operation/welcome-script/index.vue'),
          meta: {
            locale: 'menu.scrm.wecom.operation.welcomeScript',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
        },
        {
          path: '/scrm/wecom/operation/moment',
          name: 'WeComMoment',
          component: () =>
            import('@/views/scrm/wecom/operation/moment/index.vue'),
          meta: {
            locale: 'menu.scrm.wecom.operation.moment',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
        },
        {
          path: '/scrm/wecom/operation/user-user-group-send-history',
          name: 'WeComUserGroupSendHistory',
          component: () =>
            import(
              '@/views/scrm/wecom/operation/user-group-send-history/index.vue'
            ),
          meta: {
            locale: 'menu.scrm.wecom.operation.userGroupSendHistory',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
        },
      ],
    },

    // customer user-group management
    {
      path: '/scrm/wecom/customer-user-group/',
      name: 'WeComCustomerGroup',
      component: EMPTY_LAYOUT,
      meta: {
        icon: 'icon-user-group',
        locale: 'menu.scrm.wecom.customerGroup',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/scrm/wecom/customer-user-group/user-group',
          name: 'WeComGroup',
          component: () =>
            import('@/views/scrm/wecom/customer-operation/group/index.vue'),
          meta: {
            locale: 'menu.scrm.wecom.customerGroup.group',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/scrm/wecom/customer-user-group/tag',
          name: 'WeComTagGroup',
          component: () =>
            import('@/views/scrm/wecom/customer-operation/tag/index.vue'),
          meta: {
            locale: 'menu.scrm.wecom.customerGroup.tag',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },

    // app management
    {
      path: '/scrm/wecom/app',
      name: 'WeComApp',
      component: () => import('@/views/scrm/wecom/app/index.vue'),
      meta: {
        icon: 'icon-apps',
        locale: 'menu.scrm.wecom.app',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    // session archive
    {
      path: '/scrm/wecom/session-archive',
      name: 'WeComSessionArchive',
      component: () => import('@/views/scrm/wecom/session-archive/index.vue'),
      meta: {
        icon: 'icon-history',
        locale: 'menu.scrm.wecom.sessionArchive',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    // smart customer service
    {
      path: '/scrm/wecom/smart-cs',
      name: 'WeComSmartCS',
      component: () => import('@/views/scrm/wecom/smart-cs/index.vue'),
      meta: {
        icon: 'icon-robot',
        locale: 'menu.scrm.wecom.smartCS',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SCRMWecom;
