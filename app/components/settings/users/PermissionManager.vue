<script setup lang="ts">
import { ref, reactive, computed } from "vue";

// 模拟角色数据
const roles = ref([
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
const permissions = ref([
  // 用户管理权限
  {
    id: 1,
    name: "查看用户",
    code: "user:view",
    module: "用户管理",
    description: "查看用户列表和详情",
  },
  {
    id: 2,
    name: "创建用户",
    code: "user:create",
    module: "用户管理",
    description: "创建新用户",
  },
  {
    id: 3,
    name: "编辑用户",
    code: "user:edit",
    module: "用户管理",
    description: "编辑现有用户信息",
  },
  {
    id: 4,
    name: "删除用户",
    code: "user:delete",
    module: "用户管理",
    description: "删除用户",
  },

  // 部门管理权限
  {
    id: 5,
    name: "查看部门",
    code: "department:view",
    module: "部门管理",
    description: "查看部门列表和详情",
  },
  {
    id: 6,
    name: "创建部门",
    code: "department:create",
    module: "部门管理",
    description: "创建新部门",
  },
  {
    id: 7,
    name: "编辑部门",
    code: "department:edit",
    module: "部门管理",
    description: "编辑现有部门信息",
  },
  {
    id: 8,
    name: "删除部门",
    code: "department:delete",
    module: "部门管理",
    description: "删除部门",
  },

  // 角色权限管理
  {
    id: 9,
    name: "查看角色",
    code: "role:view",
    module: "权限管理",
    description: "查看角色列表和详情",
  },
  {
    id: 10,
    name: "创建角色",
    code: "role:create",
    module: "权限管理",
    description: "创建新角色",
  },
  {
    id: 11,
    name: "编辑角色",
    code: "role:edit",
    module: "权限管理",
    description: "编辑现有角色信息",
  },
  {
    id: 12,
    name: "删除角色",
    code: "role:delete",
    module: "权限管理",
    description: "删除角色",
  },

  // 系统设置权限
  {
    id: 13,
    name: "查看设置",
    code: "setting:view",
    module: "系统设置",
    description: "查看系统设置",
  },
  {
    id: 14,
    name: "修改设置",
    code: "setting:edit",
    module: "系统设置",
    description: "修改系统设置",
  },

  // 内容管理权限
  {
    id: 15,
    name: "查看内容",
    code: "content:view",
    module: "内容管理",
    description: "查看内容列表和详情",
  },
  {
    id: 16,
    name: "创建内容",
    code: "content:create",
    module: "内容管理",
    description: "创建新内容",
  },
  {
    id: 17,
    name: "编辑内容",
    code: "content:edit",
    module: "内容管理",
    description: "编辑现有内容",
  },
  {
    id: 18,
    name: "删除内容",
    code: "content:delete",
    module: "内容管理",
    description: "删除内容",
  },

  // 产品管理权限
  {
    id: 19,
    name: "查看产品",
    code: "product:view",
    module: "产品管理",
    description: "查看产品列表和详情",
  },
  {
    id: 20,
    name: "创建产品",
    code: "product:create",
    module: "产品管理",
    description: "创建新产品",
  },
  {
    id: 21,
    name: "编辑产品",
    code: "product:edit",
    module: "产品管理",
    description: "编辑现有产品信息",
  },
  {
    id: 22,
    name: "删除产品",
    code: "product:delete",
    module: "产品管理",
    description: "删除产品",
  },
]);

// 角色权限映射
const rolePermissions = ref({
  1: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22,
  ], // 超级管理员拥有所有权限
  2: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 15, 16, 17, 19, 20, 21], // 管理员
  3: [1, 5, 9, 13, 15, 16, 17, 19], // 编辑
  4: [1, 5, 9, 15, 19], // 用户
  5: [1, 5, 15, 16, 17, 19, 20, 21], // 市场专员
});

// 当前选中的角色
const selectedRole = ref(roles.value[0]);

// 搜索关键词
const searchQuery = ref("");

// 角色表单
const showRoleForm = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const roleForm = reactive({
  name: "",
  code: "",
  description: "",
  permissions: [],
});

// 权限分组
const permissionGroups = computed(() => {
  const groups = {};
  permissions.value.forEach((permission) => {
    if (!groups[permission.module]) {
      groups[permission.module] = [];
    }
    groups[permission.module].push(permission);
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
const openEditRoleForm = (role) => {
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

  if (isEditing.value) {
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
const deleteRole = (id) => {
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
const selectRole = (role) => {
  selectedRole.value = role;
};

// 检查权限是否已分配给当前角色
const hasPermission = (permissionId) => {
  return rolePermissions.value[selectedRole.value.id]?.includes(permissionId);
};

// 切换权限
const togglePermission = (permissionId) => {
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
const toggleModulePermissions = (module, checked) => {
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
const isModuleFullySelected = (module) => {
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
const isModulePartiallySelected = (module) => {
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
              v-for="(perms, module) in permissionGroups"
              :key="module"
              class="mb-6"
            >
              <div class="flex items-center mb-2">
                <UCheckbox
                  :model-value="isModuleFullySelected(module)"
                  :indeterminate="isModulePartiallySelected(module)"
                  @update:model-value="toggleModulePermissions(module, $event)"
                />
                <h4 class="ml-2 font-medium text-gray-900">{{ module }}</h4>
              </div>

              <div class="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div
                  v-for="perm in perms"
                  :key="perm.id"
                  class="flex items-start"
                >
                  <UCheckbox
                    :model-value="hasPermission(perm.id)"
                    @update:model-value="togglePermission(perm.id)"
                  />
                  <div class="ml-2">
                    <div class="text-sm font-medium text-gray-700">
                      {{ perm.name }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ perm.description }}
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
    <UModal v-model="showRoleForm" :ui="{ width: 'sm:max-w-lg' }">
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

            <UFormField :label="$t('organization.permission.form.description')">
              <UTextarea
                v-model="roleForm.description"
                :placeholder="
                  $t('organization.permission.form.descriptionPlaceholder')
                "
              />
            </UFormField>

            <UFormField :label="$t('organization.permission.form.permissions')">
              <div class="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                <div
                  v-for="(perms, module) in permissionGroups"
                  :key="module"
                  class="mb-4"
                >
                  <div class="flex items-center mb-2">
                    <UCheckbox
                      :model-value="
                        perms.every((p) => roleForm.permissions.includes(p.id))
                      "
                      :indeterminate="
                        perms.some((p) =>
                          roleForm.permissions.includes(p.id)
                        ) &&
                        !perms.every((p) => roleForm.permissions.includes(p.id))
                      "
                      @update:model-value="
                        (checked) => {
                          if (checked) {
                            perms.forEach((p) => {
                              if (!roleForm.permissions.includes(p.id)) {
                                roleForm.permissions.push(p.id);
                              }
                            });
                          } else {
                            roleForm.permissions = roleForm.permissions.filter(
                              (id) => !perms.map((p) => p.id).includes(id)
                            );
                          }
                        }
                      "
                    />
                    <h4 class="ml-2 font-medium text-gray-900">{{ module }}</h4>
                  </div>

                  <div class="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div
                      v-for="perm in perms"
                      :key="perm.id"
                      class="flex items-start"
                    >
                      <UCheckbox
                        :model-value="roleForm.permissions.includes(perm.id)"
                        @update:model-value="
                          (checked) => {
                            if (checked) {
                              roleForm.permissions.push(perm.id);
                            } else {
                              roleForm.permissions =
                                roleForm.permissions.filter(
                                  (id) => id !== perm.id
                                );
                            }
                          }
                        "
                      />
                      <div class="ml-2">
                        <div class="text-sm font-medium text-gray-700">
                          {{ perm.name }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ perm.description }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </UFormField>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <UButton
              color="neutral"
              variant="outline"
              @click="showRoleForm = false"
            >
              {{ $t("organization.common.cancel") }}
            </UButton>
            <UButton type="submit" color="primary">{{
              $t("organization.common.save")
            }}</UButton>
          </div>
        </form>
      </div>
    </UModal>
  </div>
</template>
