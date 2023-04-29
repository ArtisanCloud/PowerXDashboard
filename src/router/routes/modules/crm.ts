import { DEFAULT_LAYOUT, EMPTY_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const CRM: AppRouteRecordRaw = {
  path: '/crm',
  name: 'CRM',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.crm',
    requiresAuth: true,
    icon: 'icon-user-group',
  },
  children: [
    // domain management
    {
      path: '/crm/domain',
      name: 'Domain',
      component: EMPTY_LAYOUT,
      redirect: '/crm/domain/leads',
      meta: {
        icon: 'icon-user',
        locale: 'menu.crm.domain',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/crm/domain/leads',
          name: 'PublicLeads',
          component: () => import('@/views/crm/customer-domain/lead/index.vue'),
          meta: {
            locale: 'menu.crm.domain.publicLeads',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/crm/domain/customer',
          name: 'CustomerManagement',
          component: () =>
            import('@/views/crm/customer-domain/customer/index.vue'),
          meta: {
            locale: 'menu.crm.domain.customerManagement',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    // product service
    {
      path: '/crm/product-service',
      name: 'ProductService',
      component: EMPTY_LAYOUT,
      redirect: '/crm/product-service/product-management',
      meta: {
        icon: 'icon-gift',
        locale: 'menu.crm.productService',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/crm/product-service/store',
          name: 'Store Management',
          component: () =>
            import('@/views/crm/product-service/store/index.vue'),
          meta: {
            locale: 'menu.crm.productService.store',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/crm/product-service/artisan',
          name: 'Artisan Management',
          component: () =>
            import('@/views/crm/product-service/artisan/index.vue'),
          meta: {
            locale: 'menu.crm.productService.artisan',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/crm/product-service/product-management',
          name: 'ProductManagement',
          component: () =>
            import('@/views/crm/product-service/product-management/index.vue'),
          meta: {
            locale: 'menu.crm.productService.productManagement',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/crm/product-service/product-category',
          name: 'ProductCategory',
          component: () =>
            import('@/views/crm/product-service/product-category/index.vue'),
          meta: {
            locale: 'menu.crm.productService.productCategory',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/crm/product-service/price-book',
          name: 'PriceBook',
          component: () =>
            import('@/views/crm/product-service/price-book/index.vue'),
          meta: {
            locale: 'menu.crm.productService.priceBook',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    // marketing management
    {
      path: '/crm/marketing',
      name: 'Marketing',
      component: EMPTY_LAYOUT,
      redirect: '/crm/marketing/mgm',
      meta: {
        icon: 'icon-live-broadcast',
        locale: 'menu.crm.marketing',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/crm/marketing/mgm',
          name: 'MGM',
          component: () => import('@/views/crm/marketing/mgm/index.vue'),
          meta: {
            locale: 'menu.crm.marketing.mgm',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/crm/marketing/media-management',

          name: 'MediaManagement',
          component: () =>
            import('@/views/crm/marketing/media-management/index.vue'),
          meta: {
            locale: 'menu.crm.marketing.mediaManagement',
            requiresAuth: true,
            roles: [''],
          },
        },
        {
          path: '/crm/marketing/brand-story',
          name: 'BrandStory',
          component: () =>
            import('@/views/crm/marketing/brand-story/index.vue'),
          meta: {
            locale: 'menu.crm.marketing.brandStory',
            requiresAuth: true,
            roles: [''],
          },
        },
      ],
    },
    // business management
    {
      path: '/crm/business',
      name: 'Business',
      component: EMPTY_LAYOUT,
      redirect: '/crm/business/opportunity',
      meta: {
        locale: 'menu.crm.business',
        requiresAuth: true,
        roles: [''],
      },
      children: [
        {
          path: '/crm/business/opportunity',
          name: 'Opportunity',
          component: () => import('@/views/crm/business/opportunity/index.vue'),
          meta: {
            locale: 'menu.crm.business.opportunity',
            requiresAuth: true,
            roles: [''],
          },
        },
        {
          path: '/crm/business/quote',
          name: 'Quote',
          component: () => import('@/views/crm/business/quote/index.vue'),
          meta: {
            locale: 'menu.crm.business.quote',
            requiresAuth: true,
            roles: [''],
          },
        },
        {
          path: '/crm/business/contract',
          name: 'Contract',
          component: () => import('@/views/crm/business/contract/index.vue'),
          meta: {
            locale: 'menu.crm.business.contract',
            requiresAuth: true,
            roles: [''],
          },
        },
      ],
    },
    // transaction management
    {
      path: '/crm/transaction',
      name: 'Transaction',
      component: EMPTY_LAYOUT,
      redirect: '/crm/transaction/order',
      meta: {
        locale: 'menu.crm.transaction',
        requiresAuth: true,
        roles: [''],
      },
      children: [
        {
          path: '/crm/transaction/order',
          name: 'Order',
          component: () => import('@/views/crm/transaction/order/index.vue'),
          meta: {
            locale: 'menu.crm.transaction.order',
            requiresAuth: true,
            roles: [''],
          },
        },
        {
          path: '/crm/transaction/payment',
          name: 'Payment',
          component: () => import('@/views/crm/transaction/payment/index.vue'),
          meta: {
            locale: 'menu.crm.transaction.payment',
            requiresAuth: true,
            roles: [''],
          },
        },
      ],
    },
    // membership management
    {
      path: '/crm/membership',
      name: 'Membership',
      component: EMPTY_LAYOUT,
      redirect: '/crm/membership/list',
      meta: {
        locale: 'menu.crm.membership',
        requiresAuth: true,
        roles: [''],
      },
      children: [
        {
          path: '/crm/membership/list',
          name: 'MembershipList',
          component: () => import('@/views/crm/membership/list/index.vue'),
          meta: {
            locale: 'menu.crm.membership.list',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/crm/membership/points',
          name: 'PointsManagement',
          component: () => import('@/views/crm/membership/points/index.vue'),
          meta: {
            locale: 'menu.crm.membership.points',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
  ],
};

export default CRM;
