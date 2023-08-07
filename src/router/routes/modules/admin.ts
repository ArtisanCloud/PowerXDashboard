import { DEFAULT_LAYOUT, EMPTY_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Admin: AppRouteRecordRaw = {
  path: '/admin',
  name: 'Admin',
  component: DEFAULT_LAYOUT,
  meta: {
    order: 99,
    locale: 'menu.admin',
    requiresAuth: true,
    icon: 'icon-tool',
  },
  children: [
    // employee
    {
      path: '/admin/employee',
      name: 'Employee',
      component: EMPTY_LAYOUT,
      redirect: '/admin/employee/list',
      meta: {
        icon: 'icon-user',
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
          path: '/admin/employee/detail/:id',
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
      meta: {
        icon: 'icon-relation',
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
              name: 'OrganizationDepartmentList',
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
        // position
        {
          path: '/admin/organization/position',
          name: 'OrganizationPosition',
          component: EMPTY_LAYOUT,
          redirect: '/admin/organization/position/list',
          meta: {
            locale: 'menu.admin.organization.position',
            requiresAuth: true,
            roles: ['*'],
            hideChildrenInMenu: true,
          },
          children: [
            {
              path: '/admin/organization/position/list',
              name: 'OrganizationPositionList',
              component: () =>
                import('@/views/admin/organization/position/index.vue'),
              meta: {
                locale: 'menu.admin.organization.position.list',
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
      component: EMPTY_LAYOUT,
      redirect: '/admin/permission/role',
      meta: {
        icon: 'icon-safe',
        locale: 'menu.admin.permission',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: '/admin/permission/role',
          name: 'Role',
          component: () => import('@/views/admin/permission/role/index.vue'),
          meta: {
            locale: 'menu.admin.permission.role',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    // data dictionary
    {
      path: '/admin/dictionary',
      name: 'DataDictionary',
      component: () => import('@/views/admin/dictionary/index.vue'),
      meta: {
        icon: 'icon-book',
        locale: 'menu.admin.dictionary',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default Admin;
