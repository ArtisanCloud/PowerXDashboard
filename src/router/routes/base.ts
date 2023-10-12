import type { RouteRecordRaw } from 'vue-router';
import {
  LOGIN_ROUTE_NAME,
  NOT_FOUND_ROUTE_NAME,
  REDIRECT_ROUTE_NAME,
} from '@/router/constants';

export const DEFAULT_LAYOUT = () => import('@/layout/default-layout.vue');
export const EMPTY_LAYOUT = () => import('@/layout/empty-layout.vue');

export const REDIRECT_MAIN: RouteRecordRaw = {
  path: '/redirect',
  name: 'RedirectWrapper',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    hideInMenu: true,
  },
  children: [
    {
      path: '/redirect/:path',
      name: REDIRECT_ROUTE_NAME,
      component: () => import('@/views/redirect/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: NOT_FOUND_ROUTE_NAME,
  component: () => import('@/views/not-found/index.vue'),
};

export const LOGIN_ROUTE: RouteRecordRaw = {
  path: '/login',
  name: LOGIN_ROUTE_NAME,
  component: () => import('@/views/login/index.vue'),
  meta: {
    requiresAuth: false,
  },
};
