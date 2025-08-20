<script setup lang="ts">
import { ref, reactive, computed, h, resolveComponent, watch } from "vue";
import { useI18n } from "#imports";

const { t, locale } = useI18n();

// RBAC 角色模型类型定义
type Role = {
  id: number;
  name: string;
  code: string;
  description: string;
  level: number; // 角色层级，数字越小权限越高
  isSystem: boolean; // 是否为系统内置角色
  userCount: number;
  permissions: string[]; // 权限代码数组
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive";
};

type Permission = {
  id: number;
  name: string;
  code: string;
  module: string;
  description: string;
  type: "menu" | "action" | "data"; // 权限类型：菜单、操作、数据
  parentId?: number;
  children?: Permission[];
};

// 模拟角色数据
const roles = ref<Role[]>([
  {
    id: 1,
    name: "超级管理员",
    code: "super_admin",
    description: "系统最高权限，拥有所有功能访问权限",
    level: 1,
    isSystem: true,
    userCount: 2,
    permissions: ["*"], // 通配符表示所有权限
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "active",
  },
  {
    id: 2,
    name: "系统管理员",
    code: "system_admin",
    description: "系统管理权限，可管理用户、角色和系统配置",
    level: 2,
    isSystem: true,
    userCount: 5,
    permissions: [
      "user:*",
      "role:*",
      "department:*",
      "system:config",
      "system:monitor",
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "active",
  },
  {
    id: 3,
    name: "业务管理员",
    code: "business_admin",
    description: "业务管理权限，可管理客户、订单、产品等业务数据",
    level: 3,
    isSystem: false,
    userCount: 8,
    permissions: [
      "customer:*",
      "order:*",
      "product:*",
      "content:*",
      "dashboard:view",
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "active",
  },
  {
    id: 4,
    name: "销售经理",
    code: "sales_manager",
    description: "销售管理权限，可管理客户和订单",
    level: 4,
    isSystem: false,
    userCount: 12,
    permissions: [
      "customer:view",
      "customer:create",
      "customer:edit",
      "order:view",
      "order:create",
      "order:edit",
      "product:view",
      "dashboard:view",
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "active",
  },
  {
    id: 5,
    name: "销售员",
    code: "sales_staff",
    description: "销售人员权限，可查看和创建订单",
    level: 5,
    isSystem: false,
    userCount: 25,
    permissions: [
      "customer:view",
      "customer:create",
      "order:view",
      "order:create",
      "product:view",
      "dashboard:view",
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "active",
  },
]);

// 权限树结构
const permissions = ref<Permission[]>([
  {
    id: 1,
    name: "用户管理",
    code: "user",
    module: "用户管理",
    description: "用户相关功能",
    type: "menu",
    children: [
      {
        id: 11,
        name: "查看用户",
        code: "user:view",
        module: "用户管理",
        description: "查看用户列表",
        type: "action",
        parentId: 1,
      },
      {
        id: 12,
        name: "创建用户",
        code: "user:create",
        module: "用户管理",
        description: "创建新用户",
        type: "action",
        parentId: 1,
      },
      {
        id: 13,
        name: "编辑用户",
        code: "user:edit",
        module: "用户管理",
        description: "编辑用户信息",
        type: "action",
        parentId: 1,
      },
      {
        id: 14,
        name: "删除用户",
        code: "user:delete",
        module: "用户管理",
        description: "删除用户",
        type: "action",
        parentId: 1,
      },
    ],
  },
  {
    id: 2,
    name: "角色管理",
    code: "role",
    module: "权限管理",
    description: "角色相关功能",
    type: "menu",
    children: [
      {
        id: 21,
        name: "查看角色",
        code: "role:view",
        module: "权限管理",
        description: "查看角色列表",
        type: "action",
        parentId: 2,
      },
      {
        id: 22,
        name: "创建角色",
        code: "role:create",
        module: "权限管理",
        description: "创建新角色",
        type: "action",
        parentId: 2,
      },
      {
        id: 23,
        name: "编辑角色",
        code: "role:edit",
        module: "权限管理",
        description: "编辑角色信息",
        type: "action",
        parentId: 2,
      },
      {
        id: 24,
        name: "删除角色",
        code: "role:delete",
        module: "权限管理",
        description: "删除角色",
        type: "action",
        parentId: 2,
      },
    ],
  },
]);

// 搜索和筛选
const searchQuery = ref("");

/** ========= 分页状态 ========= */
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
});

// 分页大小选项
const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

// 表单状态
const showForm = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const roleForm = reactive({
  name: "",
  code: "",
  description: "",
  level: 5,
  permissions: [] as string[],
  status: "active" as "active" | "inactive",
});

// 重置表单
const resetForm = () => {
  roleForm.name = "";
  roleForm.code = "";
  roleForm.description = "";
  roleForm.level = 5;
  roleForm.permissions = [];
  roleForm.status = "active";
  isEditing.value = false;
  editingId.value = null;
};

// 打开新增表单
const openAddForm = () => {
  resetForm();
  showForm.value = true;
};

// 打开编辑表单
const openEditForm = (role: Role) => {
  roleForm.name = role.name;
  roleForm.code = role.code;
  roleForm.description = role.description;
  roleForm.level = role.level;
  roleForm.permissions = [...role.permissions];
  roleForm.status = role.status;
  isEditing.value = true;
  editingId.value = role.id;
  showForm.value = true;
};

// 保存角色
const saveRole = () => {
  if (!roleForm.name || !roleForm.code) {
    alert("请填写必填字段");
    return;
  }

  const now = new Date().toISOString();

  if (isEditing.value && editingId.value !== null) {
    // 编辑现有角色
    const index = roles.value.findIndex((r) => r.id === editingId.value);
    if (index !== -1) {
      roles.value[index] = {
        id: roles.value[index].id,
        name: roleForm.name,
        code: roleForm.code,
        description: roleForm.description,
        level: roleForm.level,
        isSystem: roles.value[index].isSystem,
        userCount: roles.value[index].userCount,
        permissions: [...roleForm.permissions],
        status: roleForm.status,
        createdAt: roles.value[index].createdAt,
        updatedAt: now,
      };
    }
  } else {
    // 添加新角色
    const newId = Math.max(0, ...roles.value.map((r) => r.id)) + 1;
    roles.value.push({
      id: newId,
      name: roleForm.name,
      code: roleForm.code,
      description: roleForm.description,
      level: roleForm.level,
      isSystem: false,
      userCount: 0,
      permissions: [...roleForm.permissions],
      status: roleForm.status,
      createdAt: now,
      updatedAt: now,
    });
  }

  showForm.value = false;
  resetForm();
};

// 删除角色
const deleteRole = (id: number) => {
  const role = roles.value.find((r) => r.id === id);
  if (role && role.isSystem) {
    alert("系统角色不能删除");
    return;
  }

  if (role && role.userCount > 0) {
    alert(`该角色下还有 ${role.userCount} 个用户，请先移除用户后再删除角色`);
    return;
  }

  if (confirm("确定要删除此角色吗？")) {
    roles.value = roles.value.filter((r) => r.id !== id);
  }
};

/** ========= 过滤和分页 ========= */
const filteredRoles = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const filtered = q
    ? roles.value.filter(
        (role) =>
          role.name.toLowerCase().includes(q) ||
          role.code.toLowerCase().includes(q) ||
          role.description.toLowerCase().includes(q)
      )
    : roles.value;

  // 更新分页信息
  pagination.total = filtered.length;
  pagination.totalPages = Math.ceil(filtered.length / pagination.pageSize);

  return filtered.sort((a, b) => a.level - b.level);
});

// 当前页显示的角色
const paginatedRoles = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredRoles.value.slice(start, end);
});

// 分页信息
const paginationInfo = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize + 1;
  const end = Math.min(pagination.page * pagination.pageSize, pagination.total);
  return {
    start: pagination.total > 0 ? start : 0,
    end,
    total: pagination.total,
    page: pagination.page,
    totalPages: pagination.totalPages,
  };
});

// 分页控制
const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.page = page;
  }
};

const changePageSize = (pageSize: number) => {
  pagination.pageSize = pageSize;
  pagination.page = 1; // 重置到第一页
};

const hasNextPage = computed(() => pagination.page < pagination.totalPages);
const hasPrevPage = computed(() => pagination.page > 1);

// 监听搜索条件变化，重置到第一页
watch(searchQuery, () => {
  pagination.page = 1;
});

// ====== ✅ Nuxt UI 3.3+：TanStack 列定义 ======
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

const columns = computed(() => {
  const _ = locale.value; // 显式依赖，切换语言时重算
  return [
    {
      id: "name",
      accessorKey: "name",
      header: "角色名称",
      cell: ({ row }: any) => {
        const role = row.original as Role;
        return h("div", { class: "flex items-center gap-2" }, [
          h("span", { class: "font-medium" }, role.name),
          role.isSystem &&
            h(
              UBadge,
              { color: "blue", variant: "subtle", size: "xs" },
              { default: () => "系统" }
            ),
        ]);
      },
    },
    {
      id: "code",
      accessorKey: "code",
      header: "角色代码",
      cell: ({ row }: any) => {
        const role = row.original as Role;
        return h(
          "code",
          { class: "text-sm bg-gray-100 px-2 py-1 rounded" },
          role.code
        );
      },
    },
    {
      id: "level",
      accessorKey: "level",
      header: "权限层级",
      cell: ({ row }: any) => {
        const role = row.original as Role;
        return h(
          UBadge,
          {
            color:
              role.level <= 2 ? "red" : role.level <= 4 ? "yellow" : "gray",
            variant: "subtle",
            size: "sm",
          },
          { default: () => `级别 ${role.level}` }
        );
      },
    },
    {
      id: "userCount",
      accessorKey: "userCount",
      header: "用户数量",
      cell: ({ row }: any) => {
        const role = row.original as Role;
        return h("span", { class: "text-center" }, role.userCount.toString());
      },
    },
    {
      id: "permissions",
      accessorKey: "permissions",
      header: "权限数量",
      cell: ({ row }: any) => {
        const role = row.original as Role;
        const count = role.permissions.includes("*")
          ? "全部"
          : role.permissions.length.toString();
        return h(
          UBadge,
          { color: "green", variant: "subtle", size: "sm" },
          { default: () => count }
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "状态",
      cell: ({ row }: any) => {
        const role = row.original as Role;
        return h(
          UBadge,
          {
            color: role.status === "active" ? "success" : "neutral",
            variant: "subtle",
            size: "sm",
          },
          {
            default: () => (role.status === "active" ? "启用" : "禁用"),
          }
        );
      },
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }: any) => {
        const role = row.original as Role;
        return h(
          "div",
          { class: "flex gap-1" },
          [
            h(
              UButton,
              {
                size: "xs",
                variant: "ghost",
                icon: "i-heroicons-pencil-square",
                onClick: () => openEditForm(role),
              },
              { default: () => "编辑" }
            ),
            !role.isSystem &&
              role.userCount === 0 &&
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
    <!-- 角色管理头部 -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">角色管理</h2>
        <p class="text-sm text-gray-500 mt-1">
          基于RBAC模型的角色权限管理，支持层级权限控制
        </p>
      </div>
      <UButton color="primary" icon="i-heroicons-plus" @click="openAddForm">
        新建角色
      </UButton>
    </div>

    <!-- 搜索 -->
    <UInput
      v-model="searchQuery"
      icon="i-heroicons-magnifying-glass"
      placeholder="搜索角色名称、代码或描述..."
      class="w-full md:w-80 mb-6"
    />

    <!-- 数据统计和分页大小选择 -->
    <div class="mb-4 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-600">
          显示第 {{ paginationInfo.start }} - {{ paginationInfo.end }} 条， 共
          {{ paginationInfo.total }} 条记录
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">每页显示：</span>
          <USelect
            :model-value="pagination.pageSize"
            :options="pageSizeOptions"
            @update:model-value="changePageSize"
            class="w-20"
          />
        </div>
      </div>
    </div>

    <!-- ✅ Nuxt UI 3.3+ 用 :data 和 TanStack columns -->
    <div class="bg-white rounded-lg shadow-sm">
      <UTable :data="paginatedRoles" :columns="columns" />

      <!-- 分页控件 -->
      <div
        v-if="pagination.totalPages > 1"
        class="px-6 py-4 border-t border-gray-200"
      >
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-600">
            第 {{ pagination.page }} 页，共 {{ pagination.totalPages }} 页
          </div>
          <div class="flex gap-2">
            <UButton
              :disabled="!hasPrevPage"
              variant="outline"
              size="sm"
              icon="i-heroicons-chevron-left"
              @click="changePage(pagination.page - 1)"
            >
              上一页
            </UButton>

            <!-- 页码按钮 -->
            <template
              v-for="page in Math.min(5, pagination.totalPages)"
              :key="page"
            >
              <UButton
                v-if="
                  Math.abs(page - pagination.page) <= 2 ||
                  page === 1 ||
                  page === pagination.totalPages
                "
                :variant="page === pagination.page ? 'solid' : 'outline'"
                size="sm"
                @click="changePage(page)"
              >
                {{ page }}
              </UButton>
            </template>

            <UButton
              :disabled="!hasNextPage"
              variant="outline"
              size="sm"
              icon="i-heroicons-chevron-right"
              @click="changePage(pagination.page + 1)"
            >
              下一页
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-if="filteredRoles.length === 0"
      class="text-center py-12 bg-gray-50 rounded-lg mt-4"
    >
      <UIcon
        name="i-heroicons-shield-check"
        class="w-12 h-12 text-gray-400 mx-auto mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 mb-2">暂无角色数据</h3>
      <p class="text-gray-500 mb-4">
        {{
          searchQuery
            ? "没有找到匹配的角色，请尝试调整筛选条件"
            : "点击「新建角色」按钮创建第一个角色"
        }}
      </p>
      <div class="flex justify-center gap-3">
        <UButton v-if="!searchQuery" color="primary" @click="openAddForm">
          新建角色
        </UButton>
        <UButton
          v-if="searchQuery"
          color="neutral"
          variant="outline"
          @click="searchQuery = ''"
        >
          重置筛选
        </UButton>
      </div>
    </div>

    <!-- 角色表单对话框 -->
    <UModal
      v-model:open="showForm"
      title="role-manager-title"
      description="role-manager-desc"
      :ui="{ content: 'sm:max-w-md' }"
    >
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditing ? "编辑角色" : "新建角色" }}
            </h3>
          </template>

          <form @submit.prevent="saveRole">
            <div class="space-y-4">
              <UFormField label="角色名称" required>
                <UInput v-model="roleForm.name" placeholder="输入角色名称" />
              </UFormField>

              <UFormField label="角色代码" required>
                <UInput
                  v-model="roleForm.code"
                  placeholder="输入角色代码（英文，如：sales_manager）"
                />
              </UFormField>

              <UFormField label="角色描述">
                <UTextarea
                  v-model="roleForm.description"
                  placeholder="输入角色描述"
                  :rows="3"
                />
              </UFormField>

              <UFormField label="权限层级">
                <USelect
                  v-model="roleForm.level"
                  :options="[
                    { label: '1 - 最高级（系统管理员）', value: 1 },
                    { label: '2 - 高级（部门管理员）', value: 2 },
                    { label: '3 - 中级（业务管理员）', value: 3 },
                    { label: '4 - 普通（团队负责人）', value: 4 },
                    { label: '5 - 基础（普通员工）', value: 5 },
                    { label: '6 - 受限（实习生/临时工）', value: 6 },
                    { label: '10 - 访客（只读权限）', value: 10 },
                  ]"
                />
              </UFormField>

              <UFormField label="状态">
                <URadioGroup
                  v-model="roleForm.status"
                  :options="[
                    { value: 'active', label: '启用' },
                    { value: 'inactive', label: '禁用' },
                  ]"
                  class="flex space-x-4"
                />
              </UFormField>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <UButton
                color="neutral"
                variant="outline"
                @click="showForm = false"
              >
                取消
              </UButton>
              <UButton type="submit" color="primary">
                {{ isEditing ? "更新角色" : "创建角色" }}
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
