<!-- /components/settings/users/UsersTenantAdmin.vue -->
<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  h,
  resolveComponent,
  onMounted,
  watch,
} from "vue";
import { useI18n } from "#imports";

// ==== 输入属性（Root 复用时传入 tenantId） ====
const props = defineProps<{ tenantId: number }>();
const { t, locale } = useI18n();

// ===== 类型与数据（沿用你现有的定义，略微规范字段） =====
type StatusType = "active" | "inactive";
type RoleType = "管理员" | "编辑" | "用户";

interface RowUser {
  id: number;
  name: string;
  username: string;
  email: string;
  department?: string;
  roles?: RoleType[] | null;
  status: StatusType | string;
  avatar: string;
  // 你也可以加 memberId/userId 等后端需要的标识
}

// 表格数据（TODO: 替换为接口加载）
const users = ref<RowUser[]>([]);

// ====== 过滤/分页（与你现有一致） ======
const searchQuery = ref("");
const filters = reactive({
  department: null as string | null,
  role: null as string | null,
  status: null as string | null,
});

const pagination = reactive({ page: 1, pageSize: 10, total: 0, totalPages: 0 });

const departments = ref<{ label: string; value: string | null }[]>([
  { label: t("organization.user.form.selectDepartment"), value: null },
  { label: "技术部", value: "技术部" },
  { label: "市场部", value: "市场部" },
]);
const roles = ref([
  { label: t("organization.user.form.selectRole"), value: null },
  { label: "管理员", value: "管理员" },
  { label: "编辑", value: "编辑" },
  { label: "用户", value: "用户" },
]);

// ====== 导入导出 ======
type ExportFormat = "csv" | "json";

async function exportUsers(format: ExportFormat) {
  try {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === "csv") {
      const { default: Papa } = await import("papaparse");
      content = Papa.unparse(
        users.value.map((u) => ({
          姓名: u.name,
          用户名: u.username,
          邮箱: u.email,
          部门: u.department || "",
          状态: u.status === "active" ? "激活" : "停用",
        }))
      );
      filename = `users_${new Date().toISOString().split("T")[0]}.csv`;
      mimeType = "text/csv;charset=utf-8;";
    } else {
      content = JSON.stringify(users.value, null, 2);
      filename = `users_${new Date().toISOString().split("T")[0]}.json`;
      mimeType = "application/json;charset=utf-8;";
    }

    const { saveAs } = await import("file-saver");
    const blob = new Blob([content], { type: mimeType });
    saveAs(blob, filename);
  } catch (error) {
    console.error("导出失败:", error);
    alert("导出失败，请重试");
  }
}

function importUsers() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".csv,.json";
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let importedData: any[];

      if (file.name.endsWith(".csv")) {
        const { default: Papa } = await import("papaparse");
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        importedData = result.data;
      } else {
        importedData = JSON.parse(text);
      }

      // 这里可以添加数据验证和转换逻辑
      console.log("导入的数据:", importedData);
      alert(`成功导入 ${importedData.length} 条记录`);
    } catch (error) {
      console.error("导入失败:", error);
      alert("导入失败，请检查文件格式");
    }
  };
  input.click();
}

const importExportItems = computed(() => [
  [
    {
      label: t("organization.user.export.csv"),
      icon: "i-heroicons-arrow-down-tray",
      click: () => exportUsers("csv"),
    },
    {
      label: t("organization.user.export.json"),
      icon: "i-heroicons-arrow-down-tray",
      click: () => exportUsers("json"),
    },
  ],
  [
    {
      label: t("organization.user.import.button"),
      icon: "i-heroicons-arrow-up-tray",
      click: () => importUsers(),
    },
  ],
]);

// ====== 新增/编辑 ======
const showForm = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

// 统一"扁平表单" -> 后端映射 User+Member（我们之前对齐的）
const userForm = reactive({
  name: "",
  username: "",
  email: "",
  phone: "",
  departmentId: null as number | null,
  roleIds: [] as number[],
  avatarUrl: "",
  password: "",
  confirmPassword: "",
  status: "active" as "active" | "disabled" | "locked",
  meta: {} as Record<string, any>,
});

function resetForm() {
  userForm.name = "";
  userForm.username = "";
  userForm.email = "";
  userForm.phone = "";
  userForm.departmentId = null;
  userForm.roleIds = [];
  userForm.avatarUrl = "";
  userForm.password = "";
  userForm.confirmPassword = "";
  userForm.status = "active";
  userForm.meta = {};
  isEditing.value = false;
  editingId.value = null;
}

function openAddForm() {
  resetForm();
  showForm.value = true;
}

function openEditForm(row: RowUser) {
  resetForm();
  isEditing.value = true;
  editingId.value = row.id;

  // 将行数据映射回表单（如果你后端返回 departmentId/roleIds，按需填充）
  userForm.name = row.name;
  userForm.username = row.username;
  userForm.email = row.email;
  userForm.avatarUrl = row.avatar;
  userForm.status = (row.status as any) === "active" ? "active" : "disabled";
  showForm.value = true;
}

async function saveUser() {
  // 基础校验
  if (!userForm.name || !userForm.username || !userForm.email) {
    return alert(t("organization.user.validation.requiredFields"));
  }
  if (!isEditing.value && userForm.password !== userForm.confirmPassword) {
    return alert(t("organization.user.validation.passwordMismatch"));
  }

  const payload = {
    // 与后端统一的扁平创建结构（我们已在 handler 里支持）
    name: userForm.name,
    username: userForm.username,
    email: userForm.email,
    phone: userForm.phone,
    avatar_url: userForm.avatarUrl,
    status: userForm.status,
    department_id: userForm.departmentId ?? undefined,
    department_ids: undefined, // 如需多部门，改成数组
    role_ids: userForm.roleIds ?? [],
    password: userForm.password || undefined,
    confirm_password: userForm.confirmPassword || undefined,
    meta: userForm.meta ?? {},
  };

  try {
    if (isEditing.value) {
      // PATCH /api/v1/admin/iam/members/:id
      // await $fetch(`/api/v1/admin/iam/members/${editingId.value}`, { method:"PATCH", body: payload })
      // Demo：本地更新
      const idx = users.value.findIndex((u) => u.id === editingId.value);
      if (idx >= 0)
        users.value[idx] = {
          ...users.value[idx],
          name: userForm.name,
          email: userForm.email,
          username: userForm.username,
        };
    } else {
      // POST /api/v1/admin/iam/members
      // await $fetch(`/api/v1/admin/iam/members`, { method:"POST", body: payload })
      // Demo：本地插入
      const id = Math.max(0, ...users.value.map((u) => u.id)) + 1;
      users.value.unshift({
        id,
        name: userForm.name,
        username: userForm.username,
        email: userForm.email.toLowerCase(),
        department: "",
        roles: ["用户"],
        status: "active",
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(userForm.email)}`,
      } as RowUser);
    }
    showForm.value = false;
  } catch (e: any) {
    alert(e?.message || "保存失败");
  }
}

function deleteUser(id: number) {
  if (!confirm(t("organization.user.confirmDelete"))) return;
  // await $fetch(`/api/v1/admin/iam/members/${id}`, { method:"DELETE" })
  users.value = users.value.filter((u) => u.id !== id);
}

function toggleUserStatus(row: RowUser) {
  const idx = users.value.findIndex((u) => u.id === row.id);
  if (idx < 0) return;
  users.value[idx].status =
    users.value[idx].status === "active" ? "inactive" : "active";
  // 你也可以调用 PUT /status
}

// ===== 过滤/分页与你现有一致（略写） =====
const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const filtered = users.value.filter((u) => {
    const hit =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const dep = !filters.department || u.department === filters.department;
    const role = !filters.role || (u.roles || []).includes(filters.role as any);
    const st = !filters.status || u.status === filters.status;
    return hit && dep && role && st;
  });
  pagination.total = filtered.length;
  pagination.totalPages = Math.ceil(filtered.length / pagination.pageSize);
  return filtered;
});
const paginatedUsers = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize;
  return filteredUsers.value.slice(start, start + pagination.pageSize);
});
const hasNextPage = computed(() => pagination.page < pagination.totalPages);
const hasPrevPage = computed(() => pagination.page > 1);
function changePage(p: number) {
  if (p >= 1 && p <= pagination.totalPages) pagination.page = p;
}
function changePageSize(size: number) {
  pagination.pageSize = size;
  pagination.page = 1;
}
function resetFilters() {
  filters.department = filters.role = filters.status = null;
  searchQuery.value = "";
  pagination.page = 1;
}

watch(
  [
    searchQuery,
    () => filters.department,
    () => filters.role,
    () => filters.status,
  ],
  () => (pagination.page = 1)
);

// ===== 列定义：含"编辑/禁用/删除"操作 =====
const UButton = resolveComponent("UButton");
const UAvatar = resolveComponent("UAvatar");
const UBadge = resolveComponent("UBadge");

const columns = computed(() => {
  const _ = locale.value;
  return [
    {
      id: "avatar",
      accessorKey: "avatar",
      header: "",
      cell: ({ row }: any) => {
        const u = row.original as RowUser;
        return h(UAvatar, { src: u.avatar, alt: u.name, size: "sm" });
      },
    },
    {
      id: "name",
      accessorKey: "name",
      header: t("organization.user.table.name").toString(),
    },
    {
      id: "username",
      accessorKey: "username",
      header: t("organization.user.table.username").toString(),
    },
    {
      id: "email",
      accessorKey: "email",
      header: t("organization.user.table.email").toString(),
    },
    {
      id: "department",
      accessorKey: "department",
      header: t("organization.user.table.department").toString(),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("organization.user.table.status").toString(),
      cell: ({ row }: any) => {
        const u = row.original as RowUser;
        return h(
          UBadge,
          {
            color: u.status === "active" ? "success" : "neutral",
            variant: "subtle",
            size: "sm",
          },
          () =>
            u.status === "active"
              ? t("organization.user.form.active")
              : t("organization.user.form.inactive")
        );
      },
    },
    {
      id: "actions",
      header: t("organization.user.table.actions").toString(),
      cell: ({ row }: any) => {
        const u = row.original as RowUser;
        return h("div", { class: "flex gap-2" }, [
          h(
            UButton,
            {
              size: "xs",
              variant: "ghost",
              icon: "i-heroicons-pencil-square",
              onClick: () => openEditForm(u),
            },
            () => t("organization.common.edit")
          ),
          h(
            UButton,
            {
              size: "xs",
              color: u.status === "active" ? "warning" : "success",
              variant: "ghost",
              icon:
                u.status === "active"
                  ? "i-heroicons-lock-closed"
                  : "i-heroicons-lock-open",
              onClick: () => toggleUserStatus(u),
            },
            () =>
              u.status === "active"
                ? t("organization.user.disable")
                : t("organization.user.enable")
          ),
          h(
            UButton,
            {
              size: "xs",
              color: "error",
              variant: "ghost",
              icon: "i-heroicons-trash",
              onClick: () => deleteUser(u.id),
            },
            () => t("organization.common.delete")
          ),
        ]);
      },
    },
  ];
});

// ===== 模拟加载（替换为实际接口） =====
onMounted(async () => {
  // 例：const res = await $fetch(`/api/v1/admin/iam/members`, { params: {...} })
  users.value = [
    {
      id: 1,
      name: "张三",
      username: "zhangsan",
      email: "zhangsan@example.com",
      department: "技术部",
      roles: ["管理员"],
      status: "active",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "李四",
      username: "lisi",
      email: "lisi@example.com",
      department: "市场部",
      roles: ["编辑"],
      status: "active",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  ];
});
</script>

<template>
  <div>
    <!-- 顶部：导入导出 + 新增 -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">
          {{ $t("organization.user.title") }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          {{ $t("organization.user.description") }}
        </p>
      </div>
      <div class="flex space-x-2">
        <UDropdown :items="importExportItems">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-heroicons-arrow-up-tray"
          >
            {{ $t("organization.user.importExport") }}
          </UButton>
        </UDropdown>
        <UButton color="primary" icon="i-heroicons-plus" @click="openAddForm">
          {{ $t("organization.user.add") }}
        </UButton>
      </div>
    </div>

    <!-- 搜索与筛选（与你现有一致） -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex-grow min-w-[200px]">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            :placeholder="$t('organization.user.search')"
          />
        </div>
        <UFormField :label="$t('organization.user.form.department')">
          <USelect
            v-model="filters.department"
            :options="departments"
            class="w-full sm:min-w-[12rem]"
            option-attribute="label"
          />
        </UFormField>
        <UFormField :label="$t('organization.user.form.role')">
          <USelect
            v-model="filters.role"
            :options="roles"
            class="w-full sm:min-w-[12rem]"
            option-attribute="label"
          />
        </UFormField>
        <UFormField :label="$t('organization.user.form.status')" class="mb-0">
          <USelect
            v-model="filters.status"
            :options="[
              { label: $t('organization.user.filter.allStatus'), value: null },
              { label: $t('organization.user.filter.active'), value: 'active' },
              {
                label: $t('organization.user.filter.inactive'),
                value: 'inactive',
              },
            ]"
            class="w-full sm:w-40"
          />
        </UFormField>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-path"
          @click="resetFilters"
        >
          {{ $t("organization.user.filter.reset") }}
        </UButton>
      </div>
    </div>

    <!-- 表格 + 分页 -->
    <div class="bg-white rounded-lg shadow-sm">
      <UTable :data="paginatedUsers" :columns="columns" />
      <div
        v-if="pagination.totalPages > 1"
        class="px-6 py-4 border-t border-gray-200 flex justify-between items-center"
      >
        <div class="text-sm text-gray-600">
          第 {{ pagination.page }} / {{ pagination.totalPages }} 页， 共
          {{ pagination.total }} 条
        </div>
        <div class="flex gap-2">
          <UButton
            :disabled="!hasPrevPage"
            variant="outline"
            size="sm"
            icon="i-heroicons-chevron-left"
            @click="changePage(pagination.page - 1)"
            >上一页</UButton
          >
          <UButton
            :disabled="!hasNextPage"
            variant="outline"
            size="sm"
            icon="i-heroicons-chevron-right"
            @click="changePage(pagination.page + 1)"
            >下一页</UButton
          >
        </div>
      </div>
    </div>

    <!-- 表单弹窗（新增/编辑） -->
    <UModal
      v-model:open="showForm"
      :title="isEditing ? '编辑用户' : '添加用户'"
      :description="isEditing ? '修改用户信息' : '创建新用户'"
    >
      <template #content>
        <div class="py-8 px-8">
          <form
            @submit.prevent="saveUser"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <UFormField :label="$t('organization.user.form.name')" required
              ><UInput v-model="userForm.name"
            /></UFormField>
            <UFormField :label="$t('organization.user.form.username')" required
              ><UInput v-model="userForm.username"
            /></UFormField>
            <UFormField
              :label="$t('organization.user.form.email')"
              required
              class="md:col-span-2"
              ><UInput v-model="userForm.email" type="email"
            /></UFormField>
            <UFormField
              :label="$t('organization.user.form.password')"
              :required="!isEditing"
              ><UInput v-model="userForm.password" type="password"
            /></UFormField>
            <UFormField
              :label="$t('organization.user.form.confirmPassword')"
              :required="!isEditing"
              ><UInput v-model="userForm.confirmPassword" type="password"
            /></UFormField>
            <div class="md:col-span-2 flex justify-end gap-3 mt-2">
              <UButton
                color="neutral"
                variant="outline"
                @click="showForm = false"
                >{{ $t("organization.common.cancel") }}</UButton
              >
              <UButton type="submit" color="primary">{{
                $t("organization.common.save")
              }}</UButton>
            </div>
          </form>
        </div>
      </template>
    </UModal>
  </div>
</template>
