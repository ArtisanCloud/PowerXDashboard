import type { MenuItem } from '~/composables/api/services/menuService';

/**
 * 菜单管理组合式函数
 */
export const useMenu = () => {
  const { t } = useI18n();

  // 静态菜单数据
  const staticMenuData: MenuItem[] = [
    {
      id: 'dashboard',
      title: '仪表盘',
      icon: 'i-heroicons-home',
      path: '/dashboard',
      order: 1,
      visible: true,
      permissions: ['dashboard.view']
    },
    {
      id: 'users',
      title: '用户管理',
      icon: 'i-heroicons-users',
      order: 2,
      visible: true,
      permissions: ['users.view'],
      children: [
        {
          id: 'user-list',
          title: '用户列表',
          icon: 'i-heroicons-list-bullet',
          path: '/users',
          parentId: 'users',
          order: 1,
          visible: true,
          permissions: ['users.list']
        },
        {
          id: 'user-roles',
          title: '用户角色',
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
      title: '内容管理',
      icon: 'i-heroicons-document-text',
      order: 3,
      visible: true,
      permissions: ['content.view'],
      children: [
        {
          id: 'articles',
          title: '文章管理',
          icon: 'i-heroicons-newspaper',
          path: '/content/articles',
          parentId: 'content',
          order: 1,
          visible: true,
          permissions: ['content.articles']
        },
        {
          id: 'categories',
          title: '分类管理',
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
      title: '数据分析',
      icon: 'i-heroicons-chart-bar',
      path: '/analytics',
      badge: 'New',
      order: 4,
      visible: true,
      permissions: ['analytics.view']
    },
    {
      id: 'settings',
      title: '系统设置',
      icon: 'i-heroicons-cog-6-tooth',
      order: 5,
      visible: true,
      permissions: ['settings.view'],
      children: [
        {
          id: 'system',
          title: '系统配置',
          icon: 'i-heroicons-server',
          path: '/settings/system',
          parentId: 'settings',
          order: 1,
          visible: true,
          permissions: ['settings.system']
        },
        {
          id: 'security',
          title: '安全设置',
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

  // 模拟加载状态
  const menuLoading = ref(false);
  const menuError = ref(null);
  
  // 刷新菜单函数
  const refreshMenus = () => {
    menuLoading.value = true;
    setTimeout(() => {
      menuLoading.value = false;
    }, 500);
  };

  /**
   * 处理菜单数据，添加排序
   */
  const processMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter(item => item.visible)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item,
        children: item.children ? processMenuItems(item.children) : undefined
      }));
  };

  // 处理后的菜单数据
  const menuItems = computed<MenuItem[]>(() => {
    return processMenuItems(staticMenuData);
  });

  /**
   * 根据路径查找菜单项
   */
  const findMenuByPath = (path: string, items: MenuItem[] = menuItems.value): MenuItem | null => {
    for (const item of items) {
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const found = findMenuByPath(path, item.children);
        if (found) return found;
      }
    }
    return null;
  };

  /**
   * 获取菜单面包屑
   */
  const getMenuBreadcrumb = (path: string): MenuItem[] => {
    const breadcrumb: MenuItem[] = [];
    
    const findPath = (items: MenuItem[], targetPath: string, currentPath: MenuItem[] = []): boolean => {
      for (const item of items) {
        const newPath = [...currentPath, item];
        
        if (item.path === targetPath) {
          breadcrumb.push(...newPath);
          return true;
        }
        
        if (item.children && findPath(item.children, targetPath, newPath)) {
          return true;
        }
      }
      return false;
    };
    
    findPath(menuItems.value, path);
    return breadcrumb;
  };

  /**
   * 检查用户是否有访问指定菜单的权限
   */
  const hasMenuPermission = (menuId: string): boolean => {
    // 这里可以添加权限检查逻辑
    // 目前简单返回 true，实际应用中应该检查用户权限
    return true;
  };

  /**
   * 获取扁平化的菜单列表（包含所有子菜单）
   */
  const flatMenuItems = computed<MenuItem[]>(() => {
    const flatten = (items: MenuItem[]): MenuItem[] => {
      const result: MenuItem[] = [];
      for (const item of items) {
        result.push(item);
        if (item.children) {
          result.push(...flatten(item.children));
        }
      }
      return result;
    };
    return flatten(menuItems.value);
  });

  return {
    // 数据
    menuItems,
    flatMenuItems,
    menuLoading,
    menuError,
    
    // 方法
    refreshMenus,
    findMenuByPath,
    getMenuBreadcrumb,
    hasMenuPermission
  };
};

};
