<script setup lang="ts">
import { ref, reactive, computed, h, resolveComponent } from "vue";
import { useI18n } from "#imports";

const { t, locale } = useI18n();

type Role = {
  id: number;
  name: string;
  code: string;
  description: string;
  userCount: number;
  isSystem: boolean;
};

type Permission = {
  id: number;
  name: string;
  code: string;
  module: string;
  description: string;
  type: "menu" | "action" | "data" | "api";
  apiEndpoint?: string;
  httpMethod?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  dataScope?: "own" | "department" | "company" | "all";
};

// 模拟角色数据
const roles = ref<Role[]>([
  {
    id: 1,
    name: "超级管理员",
    code: "super_admin",
    description: "拥有系统所有权限",
    userCount: 2,
    isSystem: true,
  },
  {
    id: 2,
    name: "管理员",
    code: "admin",
    description: "拥有大部分系统管理权限",
    userCount: 5,
    isSystem: true,
  },
  {
    id: 3,
    name: "编辑",
    code: "editor",
    description: "可以管理内容和部分用户",
    userCount: 8,
    isSystem: true,
  },
  {
    id: 4,
    name: "用户",
    code: "user",
    description: "基本系统访问权限",
    userCount: 15,
    isSystem: true,
  },
  {
    id: 5,
    name: "市场专员",
    code: "marketing",
    description: "市场部门专用角色",
    userCount: 6,
    isSystem: false,
  },
]);

// 模拟权限数据
const permissions = ref<Permission[]>([
  // 用户管理权限
  {
    id: 1,
    name: "查看用户",
    code: "user:view",
    module: "用户管理",
    description: "查看用户列表和详情",
    type: "menu",
  },
  {
    id: 2,
    name: "创建用户",
    code: "user:create",
    module: "用户管理",
    description: "创建新用户",
    type: "action",
  },
  {
    id: 3,
    name: "编辑用户",
    code: "user:edit",
    module: "用户管理",
    description: "编辑现有用户信息",
    type: "action",
  },
  {
    id: 4,
    name: "删除用户",
    code: "user:delete",
    module: "用户管理",
    description: "删除用户",
    type: "action",
  },
  // 用户API权限
  {
    id: 101,
    name: "用户列表API",
    code: "api:user:list",
    module: "用户管理",
    description: "获取用户列表的API访问权限",
    type: "api",
    apiEndpoint: "/api/users",
    httpMethod: "GET",
  },
  {
    id: 102,
    name: "创建用户API",
    code: "api:user:create",
    module: "用户管理",
    description: "创建用户的API访问权限",
    type: "api",
    apiEndpoint: "/api/users",
    httpMethod: "POST",
  },
  // 用户数据权限
  {
    id: 201,
    name: "用户敏感数据",
    code: "data:user:sensitive",
    module: "用户管理",
    description: "访问用户敏感信息（如手机号、邮箱）",
    type: "data",
    dataScope: "department",
  },

  // 部门管理权限
  {
    id: 5,
    name: "查看部门",
    code: "department:view",
    module: "部门管理",
    description: "查看部门列表和详情",
    type: "menu",
  },
  {
    id: 6,
    name: "创建部门",
    code: "department:create",
    module: "部门管理",
    description: "创建新部门",
    type: "action",
  },
  {
    id: 7,
    name: "编辑部门",
    code: "department:edit",
    module: "部门管理",
    description: "编辑现有部门信息",
    type: "action",
  },
  {
    id: 8,
    name: "删除部门",
    code: "department:delete",
    module: "部门管理",
    description: "删除部门",
    type: "action",
  },

  // 角色权限管理
  {
    id: 9,
    name: "查看角色",
    code: "role:view",
    module: "权限管理",
    description: "查看角色列表和详情",
    type: "menu",
  },
  {
    id: 10,
    name: "创建角色",
    code: "role:create",
    module: "权限管理",
    description: "创建新角色",
    type: "action",
  },
  {
    id: 11,
    name: "编辑角色",
    code: "role:edit",
    module: "权限管理",
    description: "编辑现有角色信息",
    type: "action",
  },
  {
    id: 12,
    name: "删除角色",
    code: "role:delete",
    module: "权限管理",
    description: "删除角色",
    type: "action",
  },

  // 系统设置权限
  {
    id: 13,
    name: "查看设置",
    code: "setting:view",
    module: "系统设置",
    description: "查看系统设置",
    type: "menu",
  },
  {
    id: 14,
    name: "修改设置",
    code: "setting:edit",
    module: "系统设置",
    description: "修改系统设置",
    type: "action",
  },

  // 内容管理权限
  {
    id: 15,
    name: "查看内容",
    code: "content:view",
    module: "内容管理",
    description: "查看内容列表和详情",
    type: "menu",
  },
  {
    id: 16,
    name: "创建内容",
    code: "content:create",
    module: "内容管理",
    description: "创建新内容",
    type: "action",
  },
  {
    id: 17,
    name: "编辑内容",
    code: "content:edit",
    module: "内容管理",
    description: "编辑现有内容",
    type: "action",
  },
  {
    id: 18,
    name: "删除内容",
    code: "content:delete",
    module: "内容管理",
    description: "删除内容",
    type: "action",
  },

  // 产品管理权限
  {
    id: 19,
    name: "查看产品",
    code: "product:view",
    module: "产品管理",
    description: "查看产品列表和详情",
    type: "menu",
  },
  {
    id: 20,
    name: "创建产品",
    code: "product:create",
    module: "产品管理",
    description: "创建新产品",
    type: "action",
  },
  {
    id: 21,
    name: "编辑产品",
    code: "product:edit",
    module: "产品管理",
    description: "编辑现有产品信息",
    type: "action",
  },
  {
    id: 22,
    name: "删除产品",
    code: "product:delete",
    module: "产品管理",
    description: "删除产品",
    type: "action",
  },
]);

// 角色权限映射
const rolePermissions = ref<Record<number, number[]>>({
  1: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 101, 102, 201,
  ],
  2: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 15, 16, 17, 19, 20, 21, 101],
  3: [1, 5, 9, 13, 15, 16, 17, 19],
  4: [1, 5, 9, 15, 19],
  5: [1, 5, 15, 16, 17, 19, 20, 21],
});

// 当前选中的角色
const selectedRole = ref<Role>(roles.value[0]);

// 搜索关键词
const searchQuery = ref("");

// 角色表单
const showRoleForm = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const roleForm = reactive({
  name: "",
  code: "",
  description: "",
  permissions: [] as number[],
});

// 权限分组 - 按模块和类型分组
const permissionGroups = computed(() => {
  const groups: Record<string, Record<string, Permission[]>> = {};

  permissions.value.forEach((permission) => {
    const module = permission.module;
    const type = permission.type;

    if (!groups[module]) {
      groups[module] = {};
    }
    if (!groups[module][type]) {
      groups[module][type] = [];
    }
    groups[module][type].push(permission);
  });

  return groups;
});

// 重置表单
const resetRoleForm = () => {
  roleForm.name = "";
  roleForm.code = "";
  roleForm.description = "";
  roleForm.permissions = [];
  isEditing.value = false;
  editingId.value = null;
};

// 打开新增表单
const openAddRoleForm = () => {
  resetRoleForm();
  showRoleForm.value = true;
};

// 打开编辑表单
const openEditRoleForm = (role: Role) => {
  roleForm.name = role.name;
  roleForm.code = role.code;
  roleForm.description = role.description;
  roleForm.permissions = rolePermissions.value[role.id] || [];
  isEditing.value = true;
  editingId.value = role.id;
  showRoleForm.value = true;
};

// 保存角色
const saveRole = () => {
  if (!roleForm.name || !roleForm.code) {
    alert("请填写必填字段");
    return;
  }

  if (isEditing.value && editingId.value !== null) {
    // 编辑现有角色
    const index = roles.value.findIndex((r) => r.id === editingId.value);
    if (index !== -1) {
      roles.value[index] = {
        ...roles.value[index],
        name: roleForm.name,
        code: roleForm.code,
        description: roleForm.description,
      };
      // 更新角色权限
      rolePermissions.value[editingId.value] = [...roleForm.permissions];
    }
  } else {
    // 添加新角色
    const newId = Math.max(0, ...roles.value.map((r) => r.id)) + 1;
    roles.value.push({
      id: newId,
      name: roleForm.name,
      code: roleForm.code,
      description: roleForm.description,
      userCount: 0,
      isSystem: false,
    });
    // 添加角色权限
    rolePermissions.value[newId] = [...roleForm.permissions];
  }

  showRoleForm.value = false;
  resetRoleForm();
};

// 删除角色
const deleteRole = (id: number) => {
  const role = roles.value.find((r) => r.id === id);
  if (role && role.isSystem) {
    alert("系统角色不能删除");
    return;
  }

  if (confirm("确定要删除此角色吗？")) {
    roles.value = roles.value.filter((r) => r.id !== id);
    // 删除角色权限
    delete rolePermissions.value[id];
  }
};

// 过滤后的角色列表
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value;

  const query = searchQuery.value.toLowerCase();
  return roles.value.filter(
    (role) =>
      role.name.toLowerCase().includes(query) ||
      role.code.toLowerCase().includes(query) ||
      role.description.toLowerCase().includes(query)
  );
});

// 选择角色
const selectRole = (role: Role) => {
  selectedRole.value = role;
};

// 检查权限是否已分配给当前角色
const hasPermission = (permissionId: number) => {
  return (
    rolePermissions.value[selectedRole.value.id]?.includes(permissionId) ||
    false
  );
};

// 切换权限
const togglePermission = (permissionId: number) => {
  const roleId = selectedRole.value.id;
  if (!rolePermissions.value[roleId]) {
    rolePermissions.value[roleId] = [];
  }

  const index = rolePermissions.value[roleId].indexOf(permissionId);
  if (index === -1) {
    rolePermissions.value[roleId].push(permissionId);
  } else {
    rolePermissions.value[roleId].splice(index, 1);
  }
};

// 全选/取消全选模块权限
const toggleModulePermissions = (module: string, checked: boolean) => {
  const modulePermissionIds = permissions.value
    .filter((p) => p.module === module)
    .map((p) => p.id);

  const roleId = selectedRole.value.id;
  if (!rolePermissions.value[roleId]) {
    rolePermissions.value[roleId] = [];
  }

  if (checked) {
    // 添加所有模块权限
    modulePermissionIds.forEach((id) => {
      if (!rolePermissions.value[roleId].includes(id)) {
        rolePermissions.value[roleId].push(id);
      }
    });
  } else {
    // 移除所有模块权限
    rolePermissions.value[roleId] = rolePermissions.value[roleId].filter(
      (id) => !modulePermissionIds.includes(id)
    );
  }
};

// 检查模块是否全选
const isModuleFullySelected = (module: string) => {
  const modulePermissionIds = permissions.value
    .filter((p) => p.module === module)
    .map((p) => p.id);

  const roleId = selectedRole.value.id;
  if (!rolePermissions.value[roleId]) return false;

  return modulePermissionIds.every((id) =>
    rolePermissions.value[roleId].includes(id)
  );
};

// 检查模块是否部分选中
const isModulePartiallySelected = (module: string) => {
  const modulePermissionIds = permissions.value
    .filter((p) => p.module === module)
    .map((p) => p.id);

  const roleId = selectedRole.value.id;
  if (!rolePermissions.value[roleId]) return false;

  const selectedCount = modulePermissionIds.filter((id) =>
    rolePermissions.value[roleId].includes(id)
  ).length;

  return selectedCount > 0 && selectedCount < modulePermissionIds.length;
};

// 权限类型相关辅助函数
const getPermissionTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    menu: "菜单",
    action: "操作",
    data: "数据",
    api: "API",
  };
  return labels[type] || type;
};

const getPermissionTypeColor = (type: string) => {
  const colors: Record<
    string,
    "primary" | "success" | "error" | "warning" | "neutral"
  > = {
    menu: "primary",
    action: "success",
    data: "error",
    api: "warning",
  };
  return colors[type] || "neutral";
};

// 获取权限名称的文字颜色类
const getPermissionTextColor = (type: string) => {
  const colors: Record<string, string> = {
    menu: "text-primary-700",
    action: "text-green-700",
    data: "text-red-700",
    api: "text-amber-700",
  };
  return colors[type] || "text-gray-700";
};

const getHttpMethodColor = (method?: string) => {
  const colors: Record<
    string,
    "primary" | "success" | "error" | "warning" | "neutral"
  > = {
    GET: "success",
    POST: "primary",
    PUT: "warning",
    DELETE: "error",
    PATCH: "warning",
  };
  return colors[method || ""] || "neutral";
};

const getDataScopeLabel = (scope?: string) => {
  const labels: Record<string, string> = {
    own: "仅自己",
    department: "本部门",
    company: "本公司",
    all: "全部",
  };
  return labels[scope || ""] || scope || "";
};

// 权限类型排序
const getTypeOrder = (type: string) => {
  const order: Record<string, number> = {
    menu: 1,
    action: 2,
    api: 3,
    data: 4,
  };
  return order[type] || 999;
};

// 获取排序后的权限类型
const getSortedTypes = (types: string[]) => {
  return types.sort((a, b) => getTypeOrder(a) - getTypeOrder(b));
};

// ====== ✅ Nuxt UI 3.3+：TanStack 列定义 ======
const UButton = resolveComponent("UButton");

const roleColumns = computed(() => {
  const _ = locale.value; // 显式依赖，切换语言时重算
  return [
    {
      id: "name",
      accessorKey: "name",
      header: "角色名称",
    },
    {
      id: "code",
      accessorKey: "code",
      header: "角色代码",
    },
    {
      id: "description",
      accessorKey: "description",
      header: "描述",
    },
    {
      id: "userCount",
      accessorKey: "userCount",
      header: "用户数量",
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }: any) => {
        const role: Role = row.original;
        return h(
          "div",
          { class: "flex gap-2" },
          [
            h(
              UButton,
              {
                size: "xs",
                variant: "ghost",
                icon: "i-heroicons-pencil-square",
                onClick: () => openEditRoleForm(role),
              },
              { default: () => "编辑" }
            ),
            !role.isSystem &&
              h(
                UButton,
                {
                  size: "xs",
                  color: "error",
                  variant: "ghost",
                  icon: "i-heroicons-trash",
                  onClick: () => deleteRole(role.id),
                },
                { default: () => "删除" }
              ),
          ].filter(Boolean)
        );
      },
    },
  ];
});
</script>

<template>
  <div>
    <!-- 权限管理头部 -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">
          {{ $t("organization.permission.title") }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          {{ $t("organization.permission.description") }}
        </p>
      </div>
      <UButton color="primary" icon="i-heroicons-plus" @click="openAddRoleForm">
        {{ $t("organization.permission.add") }}
      </UButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 角色列表 -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow">
          <div class="p-4 border-b">
            <h3 class="text-lg font-medium text-gray-900">
              {{ $t("organization.permission.roleList") }}
            </h3>
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              :placeholder="$t('organization.permission.search')"
              class="mt-2"
            />
          </div>

          <div class="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            <div
              v-for="role in filteredRoles"
              :key="role.id"
              @click="selectRole(role)"
              :class="[
                'p-4 cursor-pointer hover:bg-gray-50',
                selectedRole.id === role.id ? 'bg-primary-50' : '',
              ]"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center">
                    <h4 class="font-medium text-gray-900">{{ role.name }}</h4>
                    <UBadge
                      v-if="role.isSystem"
                      color="primary"
                      variant="subtle"
                      size="sm"
                      class="ml-2"
                    >
                      {{ $t("organization.permission.systemRole") }}
                    </UBadge>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{ role.code }}</p>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ role.description }}
                  </p>
                  <p class="text-xs text-gray-500 mt-2">
                    <UIcon
                      name="i-heroicons-users"
                      class="w-4 h-4 inline-block mr-1"
                    />
                    {{ role.userCount }}
                    {{ $t("organization.permission.userCount") }}
                  </p>
                </div>
                <div class="flex space-x-1">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    @click.stop="openEditRoleForm(role)"
                  />
                  <UButton
                    v-if="!role.isSystem"
                    color="error"
                    variant="ghost"
                    icon="i-heroicons-trash"
                    size="xs"
                    @click.stop="deleteRole(role.id)"
                  />
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="filteredRoles.length === 0" class="p-8 text-center">
              <UIcon
                name="i-heroicons-user-group"
                class="w-12 h-12 text-gray-400 mx-auto mb-4"
              />
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                {{ $t("organization.permission.empty.title") }}
              </h3>
              <p class="text-gray-500 mb-4">
                {{
                  searchQuery
                    ? $t("organization.permission.empty.noResults")
                    : $t("organization.permission.empty.create")
                }}
              </p>
              <UButton
                v-if="!searchQuery"
                color="primary"
                @click="openAddRoleForm"
              >
                {{ $t("organization.permission.add") }}
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- 权限配置 -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow">
          <div class="p-4 border-b">
            <h3 class="text-lg font-medium text-gray-900">
              {{ selectedRole.name }}
              {{ $t("organization.permission.roleConfig") }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ $t("organization.permission.configDesc") }}
            </p>
          </div>

          <div class="p-4 max-h-[600px] overflow-y-auto">
            <div
              v-for="(typeGroups, module) in permissionGroups"
              :key="module"
              class="mb-6 border-t border-gray-200 pt-4 first:border-t-0 first:pt-0"
            >
              <div class="flex items-center mb-3">
                <UCheckbox
                  :model-value="isModuleFullySelected(module)"
                  :indeterminate="isModulePartiallySelected(module)"
                  @update:model-value="toggleModulePermissions(module, $event)"
                />
                <h4 class="ml-2 font-bold text-gray-900 text-lg">
                  {{ module }}
                </h4>
              </div>

              <div class="ml-6 space-y-4">
                <div
                  v-for="type in getSortedTypes(Object.keys(typeGroups))"
                  :key="type"
                  class="space-y-2"
                >
                  <h5
                    class="text-sm font-medium text-gray-600 border-b border-gray-100 pb-1"
                  >
                    {{ getPermissionTypeLabel(type) }}权限
                  </h5>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                    <div
                      v-for="perm in typeGroups[type]"
                      :key="perm.id"
                      class="flex items-start"
                    >
                      <UCheckbox
                        :model-value="hasPermission(perm.id)"
                        @update:model-value="togglePermission(perm.id)"
                      />
                      <div class="ml-2 flex-1">
                        <div class="flex items-center gap-2">
                          <span
                            class="text-sm font-medium"
                            :class="getPermissionTextColor(perm.type)"
                          >
                            {{ perm.name }}
                          </span>
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ perm.description }}
                        </div>
                        <!-- API权限显示端点信息 -->
                        <div
                          v-if="perm.type === 'api'"
                          class="text-xs text-blue-600 mt-1"
                        >
                          <UBadge
                            size="xs"
                            :color="getHttpMethodColor(perm.httpMethod)"
                            class="mr-1"
                          >
                            {{ perm.httpMethod }}
                          </UBadge>
                          <code class="text-xs">{{ perm.apiEndpoint }}</code>
                        </div>
                        <!-- 数据权限显示范围信息 -->
                        <div
                          v-if="perm.type === 'data'"
                          class="text-xs text-green-600 mt-1"
                        >
                          数据范围: {{ getDataScopeLabel(perm.dataScope) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 角色表单对话框 -->
    <UModal v-model:open="showRoleForm" :ui="{ content: 'sm:max-w-lg' }">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{
              isEditing
                ? $t("organization.permission.edit")
                : $t("organization.permission.add")
            }}
          </h3>

          <form @submit.prevent="saveRole">
            <div class="space-y-4">
              <UFormField
                :label="$t('organization.permission.form.name')"
                required
              >
                <UInput
                  v-model="roleForm.name"
                  :placeholder="
                    $t('organization.permission.form.namePlaceholder')
                  "
                />
              </UFormField>

              <UFormField
                :label="$t('organization.permission.form.code')"
                required
              >
                <UInput
                  v-model="roleForm.code"
                  :placeholder="
                    $t('organization.permission.form.codePlaceholder')
                  "
                />
              </UFormField>

              <UFormField
                :label="$t('organization.permission.form.description')"
              >
                <UTextarea
                  v-model="roleForm.description"
                  :placeholder="
                    $t('organization.permission.form.descriptionPlaceholder')
                  "
                />
              </UFormField>

              <UFormField
                :label="$t('organization.permission.form.permissions')"
              >
                <div
                  class="border rounded-md p-4 max-h-[300px] overflow-y-auto"
                >
                  <div
                    v-for="(typeGroups, module) in permissionGroups"
                    :key="module"
                    class="mb-4 border-t border-gray-200 pt-4 first:border-t-0 first:pt-0"
                  >
                    <div class="flex items-center mb-2">
                      <UCheckbox
                        :model-value="isFormModuleFullySelected(module)"
                        :indeterminate="isFormModulePartiallySelected(module)"
                        @update:model-value="
                          toggleFormModulePermissions(module, $event as boolean)
                        "
                      />
                      <h4 class="ml-2 font-semibold text-gray-900">
                        {{ module }}
                      </h4>
                    </div>

                    <div class="ml-6 space-y-3">
                      <div
                        v-for="type in Object.keys(typeGroups).sort(
                          (a, b) => getTypeOrder(a) - getTypeOrder(b)
                        )"
                        :key="type"
                        class="space-y-2"
                      >
                        <h5 class="text-xs font-medium text-gray-600">
                          {{ getPermissionTypeLabel(type) }}
                        </h5>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div
                            v-for="perm in typeGroups[type]"
                            :key="perm.id"
                            class="flex items-start"
                          >
                            <UCheckbox
                              :model-value="hasFormPermission(perm.id)"
                              @update:model-value="
                                toggleFormPermission(perm.id)
                              "
                            />
                            <div class="ml-2 flex-1">
                              <div class="flex items-center gap-2">
                                <span
                                  class="text-sm font-medium"
                                  :class="getPermissionTextColor(perm.type)"
                                >
                                  {{ perm.name }}
                                </span>
                                <UBadge
                                  v-if="perm.type === 'api'"
                                  size="xs"
                                  :color="getHttpMethodColor(perm.httpMethod)"
                                >
                                  {{ perm.httpMethod }}
                                </UBadge>
                              </div>
                              <div class="text-xs text-gray-500">
                                {{ perm.description }}
                                <template
                                  v-if="perm.type === 'api' && perm.apiEndpoint"
                                >
                                  · <code>{{ perm.apiEndpoint }}</code>
                                </template>
                                <template
                                  v-if="perm.type === 'data' && perm.dataScope"
                                >
                                  · {{ getDataScopeLabel(perm.dataScope) }}
                                </template>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- /type -->
                    </div>
                  </div>
                  <!-- /module -->
                </div>
              </UFormField>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <UButton
                color="neutral"
                variant="outline"
                @click="showRoleForm = false"
              >
                {{ $t("organization.common.cancel") }}
              </UButton>
              <UButton type="submit" color="primary">
                {{ $t("organization.common.save") }}
              </UButton>
            </div>
          </form>
        </div>
      </template>
    </UModal>
  </div>
  <!-- 最外层 <div> -->
</template>
