# RBAC API层和数据层权限控制设计

## 概述

基于当前的RBAC角色管理系统，我们可以扩展权限控制到API层和数据层面，实现细粒度的访问控制。

## 1. API层权限控制

### 1.1 权限定义扩展

在现有权限基础上，增加API级别的权限定义：

```typescript
type Permission = {
  id: number;
  name: string;
  code: string;
  module: string;
  description: string;
  type: "menu" | "action" | "data" | "api"; // 新增 api 类型
  apiEndpoint?: string; // API端点
  httpMethod?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  parentId?: number;
  children?: Permission[];
};
```

### 1.2 API权限示例

```javascript
// 用户管理API权限
{
  id: 101,
  name: "用户列表API",
  code: "api:user:list",
  module: "用户管理",
  description: "获取用户列表的API访问权限",
  type: "api",
  apiEndpoint: "/api/users",
  httpMethod: "GET"
},
{
  id: 102,
  name: "创建用户API",
  code: "api:user:create",
  module: "用户管理",
  description: "创建用户的API访问权限",
  type: "api",
  apiEndpoint: "/api/users",
  httpMethod: "POST"
}
```

### 1.3 API中间件实现

```typescript
// middleware/rbac.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $api } = useNuxtApp();
  const user = await getCurrentUser();

  // 检查API权限
  const requiredPermission = getRequiredPermission(to.path, to.method);
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Insufficient permissions",
    });
  }
});

// 权限检查函数
function hasPermission(user: User, permission: string): boolean {
  // 检查用户角色是否包含所需权限
  return user.roles.some(
    (role) =>
      role.permissions.includes("*") ||
      role.permissions.includes(permission) ||
      role.permissions.some(
        (p) => p.endsWith(":*") && permission.startsWith(p.replace(":*", ":"))
      )
  );
}
```

## 2. 数据层权限控制

### 2.1 数据权限类型

```typescript
type DataPermission = {
  type: "own" | "department" | "company" | "all"; // 数据范围
  conditions?: Record<string, any>; // 额外条件
};

type Role = {
  // ... 现有字段
  dataPermissions: {
    [resource: string]: DataPermission;
  };
};
```

### 2.2 数据权限示例

```javascript
// 角色的数据权限配置
{
  id: 4,
  name: "销售经理",
  code: "sales_manager",
  dataPermissions: {
    "customer": {
      type: "department", // 只能看本部门的客户
      conditions: { status: "active" } // 只能看激活状态的客户
    },
    "order": {
      type: "department", // 只能看本部门的订单
      conditions: {
        created_at: { gte: "2024-01-01" } // 只能看2024年后的订单
      }
    },
    "user": {
      type: "own" // 只能看自己的信息
    }
  }
}
```

### 2.3 数据查询过滤

```typescript
// composables/api/services/dataService.ts
export class DataService {
  async getFilteredData(resource: string, user: User, baseQuery: any = {}) {
    const dataPermission = this.getUserDataPermission(user, resource);

    // 根据数据权限类型添加过滤条件
    const filteredQuery = this.applyDataPermissionFilter(
      baseQuery,
      dataPermission,
      user
    );

    return await this.query(resource, filteredQuery);
  }

  private applyDataPermissionFilter(
    query: any,
    permission: DataPermission,
    user: User
  ) {
    switch (permission.type) {
      case "own":
        return { ...query, user_id: user.id };

      case "department":
        return {
          ...query,
          department_id: user.department_id,
          ...permission.conditions,
        };

      case "company":
        return {
          ...query,
          company_id: user.company_id,
          ...permission.conditions,
        };

      case "all":
        return { ...query, ...permission.conditions };

      default:
        return { ...query, id: -1 }; // 无权限时返回空结果
    }
  }
}
```

## 3. 前端权限控制

### 3.1 权限指令

```typescript
// plugins/permissions.ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      can: (permission: string) => {
        const user = getCurrentUser();
        return hasPermission(user, permission);
      },
      canAccess: (resource: string, action: string) => {
        return $can(`${resource}:${action}`);
      },
    },
  };
});
```

### 3.2 组件中使用

```vue
<template>
  <div>
    <!-- 基于权限显示按钮 -->
    <UButton v-if="$can('user:create')" @click="createUser"> 创建用户 </UButton>

    <!-- 基于数据权限显示内容 -->
    <div v-if="canViewUserData">用户敏感信息</div>
  </div>
</template>

<script setup>
const { $can } = useNuxtApp();
const user = getCurrentUser();

// 检查数据权限
const canViewUserData = computed(() => {
  return $can("user:data") && hasDataAccess("user", user.id);
});
</script>
```

## 4. 后端API实现

### 4.1 权限中间件

```typescript
// server/middleware/rbac.ts
export default defineEventHandler(async (event) => {
  if (event.node.req.url?.startsWith("/api/")) {
    const user = await getUserFromToken(event);
    const permission = getRequiredPermission(
      event.node.req.url,
      event.node.req.method
    );

    if (permission && !hasPermission(user, permission)) {
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied",
      });
    }

    // 将用户信息和权限信息添加到上下文
    event.context.user = user;
    event.context.permissions = user.roles.flatMap((r) => r.permissions);
  }
});
```

### 4.2 数据查询API

```typescript
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const dataService = new DataService();

  // 根据用户的数据权限过滤查询结果
  const users = await dataService.getFilteredData("user", user, {
    // 基础查询条件
    status: "active",
  });

  return users;
});
```

## 5. 权限配置界面扩展

### 5.1 API权限配置

```vue
<!-- 在 RoleManager.vue 中添加API权限配置 -->
<div class="mt-4">
  <h5 class="font-medium text-gray-900 mb-2">API权限</h5>
  <div class="space-y-2">
    <div v-for="apiPerm in apiPermissions" :key="apiPerm.id">
      <UCheckbox
        :model-value="hasPermission(apiPerm.code)"
        @update:model-value="togglePermission(apiPerm.code)"
      />
      <span class="ml-2">{{ apiPerm.name }}</span>
      <UBadge size="xs" class="ml-2">{{ apiPerm.httpMethod }}</UBadge>
      <code class="text-xs text-gray-400 ml-2">{{ apiPerm.apiEndpoint }}</code>
    </div>
  </div>
</div>
```

### 5.2 数据权限配置

```vue
<!-- 数据权限配置 -->
<div class="mt-4">
  <h5 class="font-medium text-gray-900 mb-2">数据权限</h5>
  <div class="space-y-3">
    <div v-for="resource in dataResources" :key="resource">
      <label class="text-sm font-medium">{{ resource }}数据范围</label>
      <USelect
        v-model="roleForm.dataPermissions[resource].type"
        :items="[
          { label: '仅自己', value: 'own' },
          { label: '本部门', value: 'department' },
          { label: '本公司', value: 'company' },
          { label: '全部', value: 'all' }
        ]"
      />
    </div>
  </div>
</div>
```

## 6. 实施建议

### 6.1 渐进式实施

1. **第一阶段**：实现基础的API权限控制
2. **第二阶段**：添加数据层权限过滤
3. **第三阶段**：完善前端权限指令和组件
4. **第四阶段**：优化性能和缓存机制

### 6.2 性能优化

```typescript
// 权限缓存
const permissionCache = new Map();

function getCachedPermissions(userId: number) {
  const cacheKey = `user_permissions_${userId}`;
  if (permissionCache.has(cacheKey)) {
    return permissionCache.get(cacheKey);
  }

  const permissions = getUserPermissions(userId);
  permissionCache.set(cacheKey, permissions);

  // 设置缓存过期时间
  setTimeout(
    () => {
      permissionCache.delete(cacheKey);
    },
    5 * 60 * 1000
  ); // 5分钟过期

  return permissions;
}
```

### 6.3 安全考虑

1. **最小权限原则**：默认拒绝，明确授权
2. **权限继承**：子权限不能超越父权限
3. **审计日志**：记录所有权限相关操作
4. **定期审查**：定期检查和清理无用权限

## 7. 总结

通过扩展现有的RBAC系统，我们可以实现：

- ✅ **API层权限控制**：精确控制每个API端点的访问权限
- ✅ **数据层权限过滤**：根据用户角色自动过滤查询结果
- ✅ **前端权限指令**：在UI层面控制组件显示和功能访问
- ✅ **细粒度控制**：支持资源级、操作级、数据级的权限控制
- ✅ **性能优化**：通过缓存和索引提升权限检查效率

这样的设计既保持了RBAC的简洁性，又提供了企业级应用所需的细粒度权限控制能力。
