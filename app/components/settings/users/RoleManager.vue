<script setup lang="ts">
import { ref, reactive, computed, h, resolveComponent } from "vue";
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
  {
    id: 6,
    name: "客服专员",
    code: "customer_service",
    description: "客服权限，可查看客户信息和订单状态",
    level: 6,
    isSystem: false,
    userCount: 15,
    permissions: ["customer:view", "order:view", "product:view"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "active",
  },
  {
    id: 7,
    name: "访客",
    code: "guest",
    description: "访客权限，只能查看基本信息",
    level: 10,
    isSystem: true,
    userCount: 0,
    permissions: ["dashboard:view"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "inactive",
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
      {
        id: 15,
        name: "用户数据",
        code: "user:data",
        module: "用户管理",
        description: "访问用户敏感数据",
        type: "data",
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
  {
    id: 3,
    name: "部门管理",
    code: "department",
    module: "组织架构",
    description: "部门相关功能",
    type: "menu",
    children: [
      {
        id: 31,
        name: "查看部门",
        code: "department:view",
        module: "组织架构",
        description: "查看部门列表",
        type: "action",
        parentId: 3,
      },
      {
        id: 32,
        name: "创建部门",
        code: "department:create",
        module: "组织架构",
        description: "创建新部门",
        type: "action",
        parentId: 3,
      },
      {
        id: 33,
        name: "编辑部门",
        code: "department:edit",
        module: "组织架构",
        description: "编辑部门信息",
        type: "action",
        parentId: 3,
      },
      {
        id: 34,
        name: "删除部门",
        code: "department:delete",
        module: "组织架构",
        description: "删除部门",
        type: "action",
        parentId: 3,
      },
    ],
  },
  {
    id: 4,
    name: "客户管理",
    code: "customer",
    module: "业务管理",
    description: "客户相关功能",
    type: "menu",
    children: [
      {
        id: 41,
        name: "查看客户",
        code: "customer:view",
        module: "业务管理",
        description: "查看客户列表",
        type: "action",
        parentId: 4,
      },
      {
        id: 42,
        name: "创建客户",
        code: "customer:create",
        module: "业务管理",
        description: "创建新客户",
        type: "action",
        parentId: 4,
      },
      {
        id: 43,
        name: "编辑客户",
        code: "customer:edit",
        module: "业务管理",
        description: "编辑客户信息",
        type: "action",
        parentId: 4,
      },
      {
        id: 44,
        name: "删除客户",
        code: "customer:delete",
        module: "业务管理",
        description: "删除客户",
        type: "action",
        parentId: 4,
      },
      {
        id: 45,
        name: "客户数据",
        code: "customer:data",
        module: "业务管理",
        description: "访问客户敏感数据",
        type: "data",
        parentId: 4,
      },
    ],
  },
  {
    id: 5,
    name: "订单管理",
    code: "order",
    module: "业务管理",
    description: "订单相关功能",
    type: "menu",
    children: [
      {
        id: 51,
        name: "查看订单",
        code: "order:view",
        module: "业务管理",
        description: "查看订单列表",
        type: "action",
        parentId: 5,
      },
      {
        id: 52,
        name: "创建订单",
        code: "order:create",
        module: "业务管理",
        description: "创建新订单",
        type: "action",
        parentId: 5,
      },
      {
        id: 53,
        name: "编辑订单",
        code: "order:edit",
        module: "业务管理",
        description: "编辑订单信息",
        type: "action",
        parentId: 5,
      },
      {
        id: 54,
        name: "删除订单",
        code: "order:delete",
        module: "业务管理",
        description: "删除订单",
        type: "action",
        parentId: 5,
      },
    ],
  },
  {
    id: 6,
    name: "产品管理",
    code: "product",
    module: "业务管理",
    description: "产品相关功能",
    type: "menu",
    children: [
      {
        id: 61,
        name: "查看产品",
        code: "product:view",
        module: "业务管理",
        description: "查看产品列表",
        type: "action",
        parentId: 6,
      },
      {
        id: 62,
        name: "创建产品",
        code: "product:create",
        module: "业务管理",
        description: "创建新产品",
        type: "action",
        parentId: 6,
      },
      {
        id: 63,
        name: "编辑产品",
        code: "product:edit",
        module: "业务管理",
        description: "编辑产品信息",
        type: "action",
        parentId: 6,
      },
      {
        id: 64,
        name: "删除产品",
        code: "product:delete",
        module: "业务管理",
        description: "删除产品",
        type: "action",
        parentId: 6,
      },
    ],
  },
  {
    id: 7,
    name: "内容管理",
    code: "content",
    module: "内容管理",
    description: "内容相关功能",
    type: "menu",
    children: [
      {
        id: 71,
        name: "查看内容",
        code: "content:view",
        module: "内容管理",
        description: "查看内容列表",
        type: "action",
        parentId: 7,
      },
      {
        id: 72,
        name: "创建内容",
        code: "content:create",
        module: "内容管理",
        description: "创建新内容",
        type: "action",
        parentId: 7,
      },
      {
        id: 73,
        name: "编辑内容",
        code: "content:edit",
        module: "内容管理",
        description: "编辑内容",
        type: "action",
        parentId: 7,
      },
      {
        id: 74,
        name: "删除内容",
        code: "content:delete",
        module: "内容管理",
        description: "删除内容",
        type: "action",
        parentId: 7,
      },
    ],
  },
  {
    id: 8,
    name: "系统设置",
    code: "system",
    module: "系统管理",
    description: "系统相关功能",
    type: "menu",
    children: [
      {
        id: 81,
        name: "系统配置",
        code: "system:config",
        module: "系统管理",
        description: "修改系统配置",
        type: "action",
        parentId: 8,
      },
      {
        id: 82,
        name: "系统监控",
        code: "system:monitor",
        module: "系统管理",
        description: "查看系统监控",
        type: "action",
        parentId: 8,
      },
      {
        id: 83,
        name: "系统日志",
        code: "system:log",
        module: "系统管理",
        description: "查看系统日志",
        type: "action",
        parentId: 8,
      },
    ],
  },
  {
    id: 9,
    name: "仪表板",
    code: "dashboard",
    module: "仪表板",
    description: "仪表板功能",
    type: "menu",
    children: [
      {
        id: 91,
        name: "查看仪表板",
        code: "dashboard:view",
        module: "仪表板",
        description: "查看仪表板",
        type: "action",
        parentId: 9,
      },
    ],
  },
]);

// 搜索和筛选
const searchQuery = ref("");
const statusFilter = ref<string | null>(null);
const levelFilter = ref<string | null>(null);

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

// 权限选择状态
const expandedPermissions = ref<Set<number>>(new Set());

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

  // 检查角色代码是否重复
  const existingRole = roles.value.find(
    (r) => r.code === roleForm.code && r.id !== editingId.value
  );
  if (existingRole) {
    alert("角色代码已存在");
    return;
  }

  const now = new Date().toISOString();

  if (isEditing.value && editingId.value !== null) {
    // 编辑现有角色
    const index = roles.value.findIndex((r) => r.id === editingId.value);
    if (index !== -1) {
      roles.value[index] = {
        ...roles.value[index],
        name: roleForm.name,
        code: roleForm.code,
        description: roleForm.description,
        level: roleForm.level,
        permissions: [...roleForm.permissions],
        status: roleForm.status,
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

// 切换角色状态
const toggleRoleStatus = (role: Role) => {
  if (role.isSystem) {
    alert("系统角色状态不能修改");
    return;
  }

  const index = roles.value.findIndex((r) => r.id === role.id);
  if (index !== -1) {
    roles.value[index].status =
      roles.value[index].status === "active" ? "inactive" : "active";
    roles.value[index].updatedAt = new Date().toISOString();
  }
};

// 复制角色
const copyRole = (role: Role) => {
  const newId = Math.max(0, ...roles.value.map((r) => r.id)) + 1;
  const now = new Date().toISOString();

  roles.value.push({
    ...role,
    id: newId,
    name: `${role.name} (副本)`,
    code: `${role.code}_copy_${newId}`,
    isSystem: false,
    userCount: 0,
    createdAt: now,
    updatedAt: now,
  });
};

// 过滤后的角色列表
const filteredRoles = computed(() => {
  let filtered = roles.value;

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        role.code.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
    );
  }

  // 状态过滤
  if (statusFilter.value) {
    filtered = filtered.filter((role) => role.status === statusFilter.value);
  }

  // 层级过滤
  if (levelFilter.value) {
    const level = parseInt(levelFilter.value);
    filtered = filtered.filter((role) => role.level === level);
  }

  return filtered.sort((a, b) => a.level - b.level);
});

// 权限选择相关函数
const togglePermissionExpand = (permissionId: number) => {
  if (expandedPermissions.value.has(permissionId)) {
    expandedPermissions.value.delete(permissionId);
  } else {
    expandedPermissions.value.add(permissionId);
  }
};

const hasPermission = (permissionCode: string) => {
  return (
    roleForm.permissions.includes(permissionCode) ||
    roleForm.permissions.includes("*") ||
    roleForm.permissions.some(
      (p) => p.endsWith(":*") && permissionCode.startsWith(p.replace(":*", ":"))
    )
  );
};

const togglePermission = (permissionCode: string) => {
  const index = roleForm.permissions.indexOf(permissionCode);
  if (index === -1) {
    roleForm.permissions.push(permissionCode);
  } else {
    roleForm.permissions.splice(index, 1);
  }
};

const toggleModulePermissions = (moduleCode: string, checked: boolean) => {
  const modulePermissions =
    permissions.value.find((p) => p.code === moduleCode)?.children || [];

  if (checked) {
    // 添加模块通配符权限
    const wildcardPermission = `${moduleCode}:*`;
    if (!roleForm.permissions.includes(wildcardPermission)) {
      roleForm.permissions.push(wildcardPermission);
    }
    // 移除具体权限，避免冗余
    modulePermissions.forEach((p) => {
      const index = roleForm.permissions.indexOf(p.code);
      if (index !== -1) {
        roleForm.permissions.splice(index, 1);
      }
    });
  } else {
    // 移除模块通配符权限
    const wildcardIndex = roleForm.permissions.indexOf(`${moduleCode}:*`);
    if (wildcardIndex !== -1) {
      roleForm.permissions.splice(wildcardIndex, 1);
    }
    // 移除所有相关权限
    modulePermissions.forEach((p) => {
      const index = roleForm.permissions.indexOf(p.code);
      if (index !== -1) {
        roleForm.permissions.splice(index, 1);
      }
    });
  }
};

const isModuleFullySelected = (moduleCode: string) => {
  return (
    roleForm.permissions.includes("*") ||
    roleForm.permissions.includes(`${moduleCode}:*`)
  );
};

const isModulePartiallySelected = (moduleCode: string) => {
  if (isModuleFullySelected(moduleCode)) return false;

  const modulePermissions =
    permissions.value.find((p) => p.code === moduleCode)?.children || [];

  return modulePermissions.some((p) => hasPermission(p.code));
};

// 获取角色层级标签
const getRoleLevelLabel = (level: number) => {
  const labels: Record<number, string> = {
    1: "最高级",
    2: "高级",
    3: "中级",
    4: "普通",
    5: "基础",
    6: "受限",
    10: "访客",
  };
  return labels[level] || `级别 ${level}`;
};

// 获取权限类型标签
const getPermissionTypeLabel = (type: string) => {
  const labels: Record<string, { label: string; color: string }> = {
    menu: { label: "菜单", color: "blue" },
    action: { label: "操作", color: "green" },
    data: { label: "数据", color: "red" },
  };
  return labels[type] || { label: type, color: "gray" };
};

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
          { default: () => `${role.level} - ${getRoleLevelLabel(role.level)}` }
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
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: "更新时间",
      cell: ({ row }: any) => {
        const role = row.original as Role;
        return h(
          "span",
          { class: "text-sm text-gray-500" },
          new Date(role.updatedAt).toLocaleDateString()
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
                icon: "i-heroicons-eye",
                onClick: () => viewRoleDetails(role),
              },
              { default: () => "详情" }
            ),
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
            h(
              UButton,
              {
                size: "xs",
                variant: "ghost",
                icon: "i-heroicons-document-duplicate",
                onClick: () => copyRole(role),
              },
              { default: () => "复制" }
            ),
            !role.isSystem &&
              h(
                UButton,
                {
                  size: "xs",
                  color: role.status === "active" ? "warning" : "success",
                  variant: "ghost",
                  icon:
                    role.status === "active"
                      ? "i-heroicons-pause"
                      : "i-heroicons-play",
                  onClick: () => toggleRoleStatus(role),
                },
                { default: () => (role.status === "active" ? "禁用" : "启用") }
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

// 查看角色详情
const showRoleDetails = ref(false);
const selectedRole = ref<Role | null>(null);

const viewRoleDetails = (role: Role) => {
  selectedRole.value = role;
  showRoleDetails.value = true;
};

// 获取角色的具体权限列表
const getRolePermissionDetails = (role: Role) => {
  if (role.permissions.includes("*")) {
    return "拥有所有权限";
  }

  const details: string[] = [];
  role.permissions.forEach((perm) => {
    if (perm.endsWith(":*")) {
      const moduleCode = perm.replace(":*", "");
      const module = permissions.value.find((p) => p.code === moduleCode);
      if (module) {
        details.push(`${module.name}（全部操作）`);
      }
    } else {
      // 查找具体权限
      for (const module of permissions.value) {
        const permission = module.children?.find((p) => p.code === perm);
        if (permission) {
          details.push(`${module.name} - ${permission.name}`);
          break;
        }
      }
    }
  });

  return details.join("、") || "无权限";
};
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

    <!-- 搜索和筛选 -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex flex-wrap gap-4 items-end">
        <!-- 搜索框 -->
        <div class="flex-grow min-w-[200px]">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="搜索角色名称、代码或描述..."
          />
        </div>

        <!-- 状态筛选 -->
        <div class="w-full sm:w-auto">
          <UFormField label="状态" class="mb-0">
            <USelect
              v-model="statusFilter"
              :items="[
                { label: '全部状态', value: null },
                { label: '启用', value: 'active' },
                { label: '禁用', value: 'inactive' },
              ]"
              option-attribute="value"
              placeholder="全部状态"
              class="w-full sm:w-32"
            />
          </UFormField>
        </div>

        <!-- 层级筛选 -->
        <div class="w-full sm:w-auto">
          <UFormField label="权限层级" class="mb-0">
            <USelect
              v-model="levelFilter"
              :items="[
                { label: '全部层级', value: null },
                { label: '1 - 最高级', value: '1' },
                { label: '2 - 高级', value: '2' },
                { label: '3 - 中级', value: '3' },
                { label: '4 - 普通', value: '4' },
                { label: '5 - 基础', value: '5' },
                { label: '6 - 受限', value: '6' },
                { label: '10 - 访客', value: '10' },
              ]"
              option-attribute="value"
              placeholder="全部层级"
              class="w-full sm:w-40"
            />
          </UFormField>
        </div>

        <!-- 重置按钮 -->
        <div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-path"
            @click="
              () => {
                searchQuery = '';
                statusFilter = '';
                levelFilter = '';
              }
            "
          >
            重置
          </UButton>
        </div>
      </div>
    </div>

    <!-- ✅ Nuxt UI 3.3+ 用 :data 和 TanStack columns -->
    <UTable :data="filteredRoles" :columns="columns" />

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
          searchQuery || statusFilter || levelFilter
            ? "没有找到匹配的角色，请尝试调整筛选条件"
            : "点击「新建角色」按钮创建第一个角色"
        }}
      </p>
      <div class="flex justify-center gap-3">
        <UButton v-if="!searchQuery" color="primary" @click="openAddForm">
          新建角色
        </UButton>
        <UButton
          v-if="searchQuery || statusFilter || levelFilter"
          color="neutral"
          variant="outline"
          @click="
            () => {
              searchQuery = '';
              statusFilter = '';
              levelFilter = '';
            }
          "
        >
          重置筛选
        </UButton>
      </div>
    </div>

    <!-- 角色表单对话框 -->
    <UModal
      v-model:open="showForm"
      :ui="{
        width: 'w-full max-w-6xl', // 改这里就能控制宽度
        content: 'sm:max-w-6xl w-full', // 确保内部 DialogContent 撑开
      }"
      :title="isEditing ? '编辑角色' : '添加角色'"
      :description="
        isEditing ? '修改角色信息和权限配置' : '创建新角色并配置权限'
      "
    >
      <template #content>
        <div class="px-32 py-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? "编辑角色" : "新建角色" }}
          </h3>

          <form @submit.prevent="saveRole">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- 基本信息 -->
              <div class="space-y-4">
                <h4 class="font-medium text-gray-900 border-b pb-2">
                  基本信息
                </h4>

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
                    :items="[
                      { label: '无', value: 0 },
                      { label: '1 - 最高级（系统管理员）', value: 1 },
                      { label: '2 - 高级（部门管理员）', value: 2 },
                      { label: '3 - 中级（业务管理员）', value: 3 },
                      { label: '4 - 普通（团队负责人）', value: 4 },
                      { label: '5 - 基础（普通员工）', value: 5 },
                      { label: '6 - 受限（实习生/临时工）', value: 6 },
                      { label: '10 - 访客（只读权限）', value: 10 },
                    ]"
                    option-attribute="value"
                  />
                </UFormField>

                <UFormField label="状态">
                  <URadioGroup
                    v-model="roleForm.status"
                    :items="[
                      { value: 'active', label: '启用' },
                      { value: 'inactive', label: '禁用' },
                    ]"
                    class="flex space-x-4"
                  />
                </UFormField>
              </div>

              <!-- 权限配置 -->
              <div class="space-y-4">
                <h4 class="font-medium text-gray-900 border-b pb-2">
                  权限配置
                </h4>

                <div
                  class="border rounded-md p-4 max-h-[500px] overflow-y-auto"
                >
                  <!-- 超级权限 -->
                  <div class="mb-4 p-3 bg-red-50 rounded-lg">
                    <UCheckbox
                      :model-value="roleForm.permissions.includes('*')"
                      @update:model-value="
                        (checked) => {
                          if (checked) {
                            roleForm.permissions = ['*'];
                          } else {
                            roleForm.permissions = roleForm.permissions.filter(
                              (p) => p !== '*'
                            );
                          }
                        }
                      "
                    />
                    <span class="ml-2 font-medium text-red-700">
                      超级权限（拥有所有功能的完全访问权限）
                    </span>
                  </div>

                  <!-- 模块权限 -->
                  <div
                    v-for="module in permissions"
                    :key="module.id"
                    class="mb-4"
                  >
                    <div class="flex items-center mb-2">
                      <UCheckbox
                        :model-value="isModuleFullySelected(module.code)"
                        :indeterminate="isModulePartiallySelected(module.code)"
                        :disabled="roleForm.permissions.includes('*')"
                        @update:model-value="
                          toggleModulePermissions(module.code, $event)
                        "
                      />
                      <UButton
                        variant="ghost"
                        size="xs"
                        :icon="
                          expandedPermissions.has(module.id)
                            ? 'i-heroicons-chevron-down'
                            : 'i-heroicons-chevron-right'
                        "
                        @click="togglePermissionExpand(module.id)"
                        class="ml-2"
                      />
                      <span class="ml-1 font-medium text-gray-900">{{
                        module.name
                      }}</span>
                      <UBadge
                        :color="getPermissionTypeLabel(module.type).color"
                        variant="subtle"
                        size="xs"
                        class="ml-2"
                      >
                        {{ getPermissionTypeLabel(module.type).label }}
                      </UBadge>
                    </div>

                    <!-- 子权限 -->
                    <div
                      v-if="expandedPermissions.has(module.id)"
                      class="ml-6 grid grid-cols-1 gap-2"
                    >
                      <div
                        v-for="perm in module.children"
                        :key="perm.id"
                        class="flex items-start"
                      >
                        <UCheckbox
                          :model-value="hasPermission(perm.code)"
                          :disabled="
                            roleForm.permissions.includes('*') ||
                            isModuleFullySelected(module.code)
                          "
                          @update:model-value="togglePermission(perm.code)"
                        />
                        <div class="ml-2">
                          <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">
                              {{ perm.name }}
                            </span>
                            <UBadge
                              :color="getPermissionTypeLabel(perm.type).color"
                              variant="subtle"
                              size="xs"
                            >
                              {{ getPermissionTypeLabel(perm.type).label }}
                            </UBadge>
                          </div>
                          <div class="text-xs text-gray-500">
                            {{ perm.description }}
                          </div>
                          <code class="text-xs text-gray-400">{{
                            perm.code
                          }}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        </div>
      </template>
    </UModal>

    <!-- 角色详情对话框 -->
    <UModal v-model:open="showRoleDetails">
      <template #content>
        <div class="p-6" v-if="selectedRole">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">角色详情</h3>
            <UBadge
              :color="selectedRole.status === 'active' ? 'success' : 'neutral'"
              variant="subtle"
            >
              {{ selectedRole.status === "active" ? "启用" : "禁用" }}
            </UBadge>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500"
                  >角色名称</label
                >
                <p class="text-gray-900">{{ selectedRole.name }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500"
                  >角色代码</label
                >
                <p class="text-gray-900">
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm">{{
                    selectedRole.code
                  }}</code>
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500"
                  >权限层级</label
                >
                <p class="text-gray-900">
                  {{ selectedRole.level }} -
                  {{ getRoleLevelLabel(selectedRole.level) }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500"
                  >用户数量</label
                >
                <p class="text-gray-900">{{ selectedRole.userCount }} 个用户</p>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-500">角色描述</label>
              <p class="text-gray-900">{{ selectedRole.description }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-500">权限详情</label>
              <div class="mt-2 p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-700">
                  {{ getRolePermissionDetails(selectedRole) }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <label class="font-medium">创建时间</label>
                <p>{{ new Date(selectedRole.createdAt).toLocaleString() }}</p>
              </div>
              <div>
                <label class="font-medium">更新时间</label>
                <p>{{ new Date(selectedRole.updatedAt).toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <UButton @click="showRoleDetails = false">关闭</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
