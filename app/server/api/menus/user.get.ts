import type { MenuItem } from '~/composables/api/services/menuService';

export default defineEventHandler(async (event) => {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 模拟菜单数据（这些数据通常来自数据库）
  const menuData: MenuItem[] = [
    {
      id: 'agent',
      title: 'menu.agent',
      icon: 'i-heroicons-chat-bubble-left-right',
      path: '/agent',
      order: 1,
      visible: true,
      permissions: ['agent.view']
    },
    {
      id: 'dashboard',
      title: 'menu.dashboard',
      icon: 'i-heroicons-home',
      path: '/dashboard',
      order: 2,
      visible: true,
      permissions: ['dashboard.view']
    },
    {
      id: 'users',
      title: 'menu.users',
      icon: 'i-heroicons-users',
      order: 3,
      visible: true,
      permissions: ['users.view'],
      children: [
        {
          id: 'user-list',
          title: 'menu.userList',
          icon: 'i-heroicons-list-bullet',
          path: '/users',
          parentId: 'users',
          order: 1,
          visible: true,
          permissions: ['users.list']
        },
        {
          id: 'user-roles',
          title: 'menu.userRoles',
          icon: 'i-heroicons-shield-check',
          path: '/users/roles',
          parentId: 'users',
          order: 2,
          visible: true,
          permissions: ['users.roles']
        }
      ]
    },
    {
      id: 'content',
      title: 'menu.content',
      icon: 'i-heroicons-document-text',
      order: 4,
      visible: true,
      permissions: ['content.view'],
      children: [
        {
          id: 'articles',
          title: 'menu.articles',
          icon: 'i-heroicons-newspaper',
          path: '/content/articles',
          parentId: 'content',
          order: 1,
          visible: true,
          permissions: ['content.articles']
        },
        {
          id: 'categories',
          title: 'menu.categories',
          icon: 'i-heroicons-tag',
          path: '/content/categories',
          parentId: 'content',
          order: 2,
          visible: true,
          permissions: ['content.categories']
        }
      ]
    },
    {
      id: 'analytics',
      title: 'menu.analytics',
      icon: 'i-heroicons-chart-bar',
      path: '/analytics',
      badge: 'New',
      order: 5,
      visible: true,
      permissions: ['analytics.view']
    },
    {
      id: 'settings',
      title: 'menu.settings',
      icon: 'i-heroicons-cog-6-tooth',
      order: 6,
      visible: true,
      permissions: ['settings.view'],
      children: [
        {
          id: 'system',
          title: 'menu.systemSettings',
          icon: 'i-heroicons-server',
          path: '/settings/system',
          parentId: 'settings',
          order: 1,
          visible: true,
          permissions: ['settings.system']
        },
        {
          id: 'security',
          title: 'menu.security',
          icon: 'i-heroicons-lock-closed',
          path: '/settings/security',
          parentId: 'settings',
          order: 2,
          visible: true,
          permissions: ['settings.security']
        }
      ]
    }
  ];

  // 模拟根据用户权限过滤菜单
  // 在实际应用中，这里会根据用户的角色和权限来过滤菜单
  const filteredMenus = menuData.filter(menu => menu.visible);

  return {
    code: 200,
    message: 'success',
    data: filteredMenus
  };
});