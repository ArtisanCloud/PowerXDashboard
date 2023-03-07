import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Admin: AppRouteRecordRaw = {
  path: '/admin',
  name: 'Admin',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.admin',
    requiresAuth: true,
    icon: 'icon-dashboard',
  },
  children: [
    // employee
    {
      path: '/admin/employee',
      name: 'Employee',
      component: () => import('@/views/admin/employee/index.vue'),
      meta: {
        locale: 'menu.admin.employee',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: '/admin/employee/detail',
      name: 'EmployeeDetail',
      component: () => import('@/views/admin/employee/index.vue'),
      meta: {
        locale: 'menu.admin.employee',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    // permission
    {
      path: '/admin/permission',
      name: 'Permission',
      component: () => import('@/views/admin/permission/index.vue'),
      meta: {
        locale: 'menu.admin.permission',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default Admin;
