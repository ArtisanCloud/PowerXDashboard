import { DEFAULT_LAYOUT, EMPTY_LAYOUT } from '../base';
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
      component: EMPTY_LAYOUT,
      redirect: '/admin/employee/list',
      meta: {
        locale: 'menu.admin.employee',
        requiresAuth: true,
        roles: ['*'],
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: '/admin/employee/list',
          name: 'EmployeeList',
          component: () => import('@/views/admin/employee/index.vue'),
          meta: {
            locale: 'menu.admin.employee',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: '/admin/employee/:id/detail',
          name: 'EmployeeDetail',
          component: () => import('@/views/admin/employee/detail/index.vue'),
          meta: {
            locale: 'menu.admin.employee.detail',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    // organization
    {
      path: '/admin/organization',
      name: 'Organization',
      component: EMPTY_LAYOUT,
      redirect: '/admin/organization/department',
      meta: {
        locale: 'menu.admin.organization',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/admin/organization/department',
          name: 'OrganizationEmployee',
          component: EMPTY_LAYOUT,
          redirect: '/admin/organization/department/list',
          meta: {
            locale: 'menu.admin.organization.department',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
          children: [
            {
              path: '/admin/organization/department/list',
              name: 'DepartmentList',
              component: () =>
                import('@/views/admin/organization/department/index.vue'),
              meta: {
                locale: 'menu.admin.organization.department.list',
                requiresAuth: true,
                roles: ['*'],
              },
            },
          ],
        },
      ],
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
