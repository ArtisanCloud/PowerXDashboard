# PowerX Admin 系统设计文档

## 1. 系统概述

PowerX Admin 是一个基于 NuxtJS 框架的插件化管理系统，具有动态菜单和模块化架构的特点。

### 1.1 核心特性
- 动态菜单：菜单配置通过后端API返回，支持权限控制
- 插件化架构：业务功能模块可独立开发、安装和卸载
- 响应式设计：适配各种设备屏幕
- 权限管理：基于角色的访问控制(RBAC)

## 2. 技术架构

### 2.1 技术栈
- **前端框架**: NuxtJS 3.x
- **UI组件库**: Element Plus / Ant Design Vue
- **状态管理**: Pinia
- **HTTP客户端**: $fetch (Nuxt内置)
- **路由**: Nuxt Router (基于Vue Router)
- **构建工具**: Vite

### 2.2 项目结构
```
PowerXAdmin/
├── app/
│   ├── components/          # 公共组件
│   │   ├── layout/         # 布局组件
│   │   ├── menu/           # 菜单组件
│   │   └── common/         # 通用组件
│   ├── composables/        # 组合式函数
│   ├── layouts/            # 布局模板
│   ├── middleware/         # 中间件
│   ├── pages/              # 页面路由
│   ├── plugins/            # Nuxt插件
│   ├── stores/             # Pinia状态管理
│   └── utils/              # 工具函数
├── plugins/                # 业务插件目录
│   ├── user-management/    # 用户管理插件
│   ├── content-management/ # 内容管理插件
│   └── system-settings/    # 系统设置插件
├── public/                 # 静态资源
├── server/                 # 服务端API (可选)
└── docs/                   # 文档
```

## 3. 动态菜单系统

### 3.1 菜单数据结构
```typescript
interface MenuItem {
  id: string
  title: string
  icon?: string
  path?: string
  component?: string
  children?: MenuItem[]
  meta?: {
    requiresAuth: boolean
    roles?: string[]
    permissions?: string[]
    hidden?: boolean
    keepAlive?: boolean
  }
}

interface MenuResponse {
  code: number
  message: string
  data: MenuItem[]
}
```

### 3.2 菜单API接口
```typescript
// GET /api/admin/menus
// 返回当前用户可访问的菜单列表
// 支持查询参数：
// - userId: 用户ID
// - roleId: 角色ID
// - includeHidden: 是否包含隐藏菜单
```

### 3.3 菜单渲染组件
```vue
<!-- components/menu/DynamicMenu.vue -->
<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="isCollapse"
    :unique-opened="true"
    router
  >
    <menu-item
      v-for="item in menuList"
      :key="item.id"
      :menu-item="item"
    />
  </el-menu>
</template>
```

## 4. 插件系统架构

### 4.1 插件结构定义
```typescript
interface PluginConfig {
  name: string
  version: string
  description: string
  author: string
  main: string              // 入口文件
  routes?: RouteConfig[]    // 路由配置
  menus?: MenuItem[]        // 菜单配置
  permissions?: string[]    // 权限配置
  dependencies?: string[]   // 依赖插件
  assets?: {
    css?: string[]
    js?: string[]
  }
}

interface RouteConfig {
  path: string
  component: string
  name?: string
  meta?: Record<string, any>
}
```

### 4.2 插件目录结构
```
plugins/user-management/
├── plugin.json           # 插件配置文件
├── index.ts             # 插件入口文件
├── components/          # 插件组件
├── pages/               # 插件页面
├── stores/              # 插件状态
├── composables/         # 插件组合函数
├── assets/              # 插件资源
└── README.md            # 插件说明
```

### 4.3 插件配置示例
```json
{
  "name": "user-management",
  "version": "1.0.0",
  "description": "用户管理插件",
  "author": "PowerX Team",
  "main": "index.ts",
  "routes": [
    {
      "path": "/users",
      "component": "pages/UserList.vue",
      "name": "UserList",
      "meta": {
        "title": "用户列表",
        "requiresAuth": true,
        "permissions": ["user:read"]
      }
    }
  ],
  "menus": [
    {
      "id": "user-management",
      "title": "用户管理",
      "icon": "user",
      "children": [
        {
          "id": "user-list",
          "title": "用户列表",
          "path": "/users",
          "meta": {
            "requiresAuth": true,
            "permissions": ["user:read"]
          }
        }
      ]
    }
  ],
  "permissions": ["user:read", "user:write", "user:delete"],
  "dependencies": []
}
```

## 5. 核心功能实现

### 5.1 插件管理器
```typescript
// composables/usePluginManager.ts
export class PluginManager {
  private plugins: Map<string, PluginConfig> = new Map()
  private loadedPlugins: Set<string> = new Set()

  async loadPlugin(pluginName: string): Promise<void> {
    // 加载插件配置
    // 注册路由
    // 注册菜单
    // 加载资源
  }

  async unloadPlugin(pluginName: string): Promise<void> {
    // 卸载插件
    // 清理路由
    // 清理菜单
    // 清理资源
  }

  getInstalledPlugins(): PluginConfig[] {
    // 返回已安装插件列表
  }
}
```

### 5.2 动态路由注册
```typescript
// composables/useDynamicRouter.ts
export const useDynamicRouter = () => {
  const router = useRouter()

  const addRoutes = (routes: RouteConfig[]) => {
    routes.forEach(route => {
      router.addRoute({
        path: route.path,
        component: () => import(`~/plugins/${route.component}`),
        name: route.name,
        meta: route.meta
      })
    })
  }

  const removeRoutes = (routeNames: string[]) => {
    routeNames.forEach(name => {
      if (router.hasRoute(name)) {
        router.removeRoute(name)
      }
    })
  }

  return {
    addRoutes,
    removeRoutes
  }
}
```

### 5.3 菜单状态管理
```typescript
// stores/menu.ts
export const useMenuStore = defineStore('menu', () => {
  const menuList = ref<MenuItem[]>([])
  const activeMenu = ref('')

  const fetchMenus = async () => {
    try {
      const { data } = await $fetch<MenuResponse>('/api/admin/menus')
      menuList.value = data
    } catch (error) {
      console.error('获取菜单失败:', error)
    }
  }

  const addPluginMenus = (pluginMenus: MenuItem[]) => {
    menuList.value.push(...pluginMenus)
  }

  const removePluginMenus = (pluginName: string) => {
    menuList.value = menuList.value.filter(
      menu => !menu.id.startsWith(pluginName)
    )
  }

  return {
    menuList,
    activeMenu,
    fetchMenus,
    addPluginMenus,
    removePluginMenus
  }
})
```

## 6. 权限控制

### 6.1 权限中间件
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { user, hasPermission } = useAuth()
  
  if (!user.value) {
    return navigateTo('/login')
  }

  const requiredPermissions = to.meta.permissions as string[]
  if (requiredPermissions && !hasPermission(requiredPermissions)) {
    throw createError({
      statusCode: 403,
      statusMessage: '权限不足'
    })
  }
})
```

### 6.2 权限组合函数
```typescript
// composables/useAuth.ts
export const useAuth = () => {
  const user = useState('auth.user')
  const permissions = useState('auth.permissions', () => [])

  const hasPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => 
      permissions.value.includes(permission)
    )
  }

  const hasRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.some(role => 
      user.value?.roles?.includes(role)
    )
  }

  return {
    user,
    permissions,
    hasPermission,
    hasRole
  }
}
```

## 7. 插件开发规范

### 7.1 插件开发流程
1. 创建插件目录结构
2. 编写plugin.json配置文件
3. 实现插件入口文件
4. 开发插件功能组件
5. 测试插件功能
6. 打包发布插件

### 7.2 插件API规范
```typescript
// 插件必须实现的接口
export interface PluginInterface {
  install(): Promise<void>
  uninstall(): Promise<void>
  getConfig(): PluginConfig
  getRoutes(): RouteConfig[]
  getMenus(): MenuItem[]
}
```

### 7.3 插件通信机制
```typescript
// 插件间通信事件总线
export const usePluginBus = () => {
  const eventBus = new EventTarget()

  const emit = (event: string, data?: any) => {
    eventBus.dispatchEvent(new CustomEvent(event, { detail: data }))
  }

  const on = (event: string, handler: (e: CustomEvent) => void) => {
    eventBus.addEventListener(event, handler)
  }

  const off = (event: string, handler: (e: CustomEvent) => void) => {
    eventBus.removeEventListener(event, handler)
  }

  return { emit, on, off }
}
```

## 8. 部署和维护

### 8.1 构建配置
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 插件自动发现
  plugins: [
    '~/plugins/plugin-manager.client.ts'
  ],
  
  // 构建优化
  build: {
    transpile: ['element-plus']
  },
  
  // 路由配置
  router: {
    middleware: ['auth']
  }
})
```

### 8.2 插件热更新
- 开发环境支持插件热重载
- 生产环境支持插件动态加载
- 插件版本管理和更新机制

## 9. 安全考虑

### 9.1 插件安全
- 插件代码审核机制
- 插件权限隔离
- 插件资源访问控制

### 9.2 数据安全
- API接口鉴权
- 数据传输加密
- XSS和CSRF防护

## 10. 性能优化

### 10.1 懒加载
- 插件按需加载
- 路由组件懒加载
- 菜单数据缓存

### 10.2 构建优化
- 代码分割
- 资源压缩
- CDN加速

这个设计文档提供了一个完整的插件化Admin系统架构，您可以根据具体需求进行调整和扩展。