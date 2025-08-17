<script setup lang="ts">
import { ref, reactive, computed, h, resolveComponent, onMounted } from "vue";
import { useI18n } from "#imports";

// 类型声明
declare module "file-saver" {
  export function saveAs(blob: Blob, filename: string): void;
}

declare module "papaparse" {
  export function unparse(data: any[]): string;
  export function parse<T>(
    input: string,
    config: {
      header: boolean;
      skipEmptyLines: string;
      transformHeader: (header: string) => string;
      complete: (results: { data: T[] }) => void;
      error: (error: { message: string }) => void;
    }
  ): void;
}

// 动态导入
const saveAs = (await import("file-saver")).saveAs;
const Papa = await import("papaparse");

const { t, locale } = useI18n();

/** ========= 类型定义 ========= */
type StatusType = "active" | "inactive";
type RoleType = "管理员" | "编辑" | "用户";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  department: string;
  role: RoleType | string;
  status: StatusType | string;
  avatar: string;
}

interface ImportUserShape {
  name?: string;
  username?: string;
  email?: string;
  department?: string;
  role?: string;
  status?: string;
}

/** ========= 数据源 ========= */
const users = ref<User[]>([
  {
    id: 1,
    name: "张三",
    username: "zhangsan",
    email: "zhangsan@example.com",
    department: "技术部",
    role: "管理员",
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "李四",
    username: "lisi",
    email: "lisi@example.com",
    department: "市场部",
    role: "编辑",
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "王五",
    username: "wangwu",
    email: "wangwu@example.com",
    department: "销售部",
    role: "用户",
    status: "inactive",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "赵六",
    username: "zhaoliu",
    email: "zhaoliu@example.com",
    department: "人力资源部",
    role: "用户",
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 5,
    name: "钱七",
    username: "qianqi",
    email: "qianqi@example.com",
    department: "财务部",
    role: "编辑",
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
]);

const departments = ref([
  { label: $t("organization.user.filter.allDepartments"), value: null },
  { label: "技术部", value: "技术部" },
  { label: "市场部", value: "市场部" },
  { label: "销售部", value: "销售部" },
  { label: "人力资源部", value: "人力资源部" },
  { label: "财务部", value: "财务部" },
]);

const roles = ref([
  { label: $t("organization.user.filter.allRoles"), value: null },
  { label: "管理员", value: "管理员" },
  { label: "编辑", value: "编辑" },
  { label: "用户", value: "用户" },
]);

/** ========= 搜索与筛选 ========= */
const searchQuery = ref("");
const filters = reactive({
  department: null as string | null,
  role: null as string | null,
  status: null as string | null, // ⬅️ 改为 null，表示“未选择”
});

/** ========= 导入 / 导出 ========= */
type ExportFormat = "csv" | "json";

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

function exportUsers(format: ExportFormat) {
  if (!saveAs || !Papa) {
    alert("导出功能正在加载中，请稍后再试");
    return;
  }

  const exportData = users.value.map((u) => ({
    name: u.name,
    username: u.username,
    email: u.email,
    department: u.department,
    role: u.role,
    status: u.status,
  }));

  const date = new Date().toISOString().slice(0, 10);
  let blob: Blob;
  let filename: string;

  if (format === "csv") {
    // CSV + UTF-8 BOM，避免 Excel 下中文乱码
    const csv = Papa.unparse(exportData);
    const BOM = "\uFEFF";
    blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8" });
    filename = `users_export_${date}.csv`;
  } else {
    const json = JSON.stringify(exportData, null, 2);
    blob = new Blob([json], { type: "application/json;charset=utf-8" });
    filename = `users_export_${date}.json`;
  }

  saveAs(blob, filename);
}

function importUsers() {
  if (typeof window === "undefined") return; // SSR 安全
  if (!Papa) {
    alert("导入功能正在加载中，请稍后再试");
    return;
  }

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".csv,.json";

  fileInput.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onerror = () => alert("导入失败");
    reader.onload = (event) => {
      try {
        const text = String(event.target?.result ?? "");
        if (file.name.toLowerCase().endsWith(".csv")) {
          Papa.parse<ImportUserShape>(text, {
            header: true,
            skipEmptyLines: "greedy",
            transformHeader: (h: string) => h.trim(),
            complete: (results: { data: ImportUserShape[] }) => {
              processImportedUsers(results.data);
            },
            error: (err: { message: string }) => {
              alert("导入失败: " + err.message);
            },
          });
        } else if (file.name.toLowerCase().endsWith(".json")) {
          const imported = JSON.parse(text) as ImportUserShape[];
          processImportedUsers(imported);
        } else {
          alert(t("organization.user.import.invalidFormat"));
        }
      } catch (error: any) {
        alert("导入失败: " + error?.message);
      }
    };
    reader.readAsText(file, "utf-8");
  };

  fileInput.click();
}

/** ========= 导入数据处理 ========= */
function normalizeUser(u: ImportUserShape): ImportUserShape {
  const trim = (s?: string) => (typeof s === "string" ? s.trim() : s);
  return {
    name: trim(u.name),
    username: trim(u.username),
    email: trim(u.email?.toLowerCase()),
    department: trim(u.department),
    role: trim(u.role),
    status: trim(u.status),
  };
}

function isValidEmail(email?: string) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function nextUserId(): number {
  return Math.max(0, ...users.value.map((u) => u.id)) + 1;
}

function avatarFromEmail(email: string) {
  // 使用 pravatar 基于 email 生成稳定头像
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;
}

function processImportedUsers(raw: ImportUserShape[]) {
  if (!Array.isArray(raw) || raw.length === 0) {
    alert(t("organization.user.import.invalidFormat"));
    return;
  }

  // 规范化、过滤掉空对象
  const imported = raw
    .map(normalizeUser)
    .filter((u) => u && (u.name || u.username || u.email));

  // 验证必须字段
  const required = ["name", "username", "email"] as const;
  const missing = imported.some((u) => required.some((k) => !(u as any)[k]));
  if (missing) {
    alert(t("organization.user.import.missingFields"));
    return;
  }

  // 验证邮箱格式
  const invalidEmail = imported.find((u) => !isValidEmail(u.email));
  if (invalidEmail) {
    alert("邮箱格式无效");
    return;
  }

  // 去重（与现有 users 及导入列表内部去重）
  const existEmails = new Set(users.value.map((u) => u.email.toLowerCase()));
  const existUsernames = new Set(users.value.map((u) => u.username));
  const seenEmails = new Set<string>();
  const seenUsernames = new Set<string>();

  const cleaned: User[] = [];
  for (const u of imported) {
    const email = u.email!;
    const username = u.username!;
    if (existEmails.has(email) || existUsernames.has(username)) continue;
    if (seenEmails.has(email) || seenUsernames.has(username)) continue;

    seenEmails.add(email);
    seenUsernames.add(username);

    cleaned.push({
      id: nextUserId(),
      name: u.name!,
      username,
      email,
      department: u.department || t("organization.user.filter.allDepartments"),
      role: (u.role as RoleType) || "用户",
      status: (u.status as StatusType) || "active",
      avatar: avatarFromEmail(email),
    });
  }

  if (cleaned.length === 0) {
    alert("没有新用户需要导入");
    return;
  }

  users.value = [...users.value, ...cleaned];
  alert(t("organization.user.import.success", { count: cleaned.length }));
}

/** ========= 新增 / 编辑 / 删除 ========= */
const showForm = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const userForm = reactive({
  name: "",
  username: "",
  email: "",
  department: "",
  role: "" as RoleType | "",
  password: "",
  confirmPassword: "",
  status: "active" as StatusType,
});

function resetForm() {
  userForm.name = "";
  userForm.username = "";
  userForm.email = "";
  userForm.department = "";
  userForm.role = "" as any;
  userForm.password = "";
  userForm.confirmPassword = "";
  userForm.status = "active";
  isEditing.value = false;
  editingId.value = null;
}

function openAddForm() {
  resetForm();
  showForm.value = true;
}

function openEditForm(user: User) {
  userForm.name = user.name;
  userForm.username = user.username;
  userForm.email = user.email;
  userForm.department = user.department;
  userForm.role = user.role as RoleType;
  userForm.status = (user.status as StatusType) ?? "active";
  userForm.password = "";
  userForm.confirmPassword = "";
  isEditing.value = true;
  editingId.value = user.id;
  showForm.value = true;
}

function saveUser() {
  if (!userForm.name || !userForm.username || !userForm.email) {
    alert(t("organization.user.validation.requiredFields"));
    return;
  }
  if (!isValidEmail(userForm.email)) {
    alert("邮箱格式无效");
    return;
  }
  if (!isEditing.value && userForm.password !== userForm.confirmPassword) {
    alert(t("organization.user.validation.passwordMismatch"));
    return;
  }

  if (isEditing.value) {
    const index = users.value.findIndex((u) => u.id === editingId.value);
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        name: userForm.name,
        username: userForm.username,
        email: userForm.email.toLowerCase(),
        department: userForm.department,
        role: userForm.role || "用户",
        status: userForm.status,
      };
    }
  } else {
    const id = nextUserId();
    users.value.push({
      id,
      name: userForm.name,
      username: userForm.username,
      email: userForm.email.toLowerCase(),
      department: userForm.department,
      role: userForm.role || "用户",
      status: userForm.status,
      avatar: avatarFromEmail(userForm.email),
    });
  }

  showForm.value = false;
  resetForm();
}

function deleteUser(id: number) {
  if (confirm(t("organization.user.confirmDelete"))) {
    users.value = users.value.filter((u) => u.id !== id);
  }
}

function toggleUserStatus(user: User) {
  const index = users.value.findIndex((u) => u.id === user.id);
  if (index !== -1) {
    users.value[index].status =
      users.value[index].status === "active" ? "inactive" : "active";
  }
}

/** ========= 过滤 ========= */
const filteredUsers = computed<User[]>(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return users.value.filter((u) => {
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);

    const matchesDepartment =
      !filters.department || u.department === filters.department;
    const matchesRole = !filters.role || u.role === filters.role;
    const matchesStatus = !filters.status || u.status === filters.status;

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });
});

function resetFilters() {
  filters.department = "";
  filters.role = "";
  filters.status = "";
  searchQuery.value = "";
}

// ====== ✅ Nuxt UI 3.3+：TanStack 列定义 ======
const UButton = resolveComponent("UButton");
const UAvatar = resolveComponent("UAvatar");
const UBadge = resolveComponent("UBadge");

const columns = computed(() => {
  const _ = locale.value; // 显式依赖，切换语言时重算
  return [
    {
      id: "avatar",
      accessorKey: "avatar",
      header: "",
      cell: ({ row }: any) => {
        const user = row.original as User;
        return h(UAvatar, {
          src: user.avatar,
          alt: user.name,
          size: "sm",
        });
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
      id: "role",
      accessorKey: "role",
      header: t("organization.user.table.role").toString(),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("organization.user.table.status").toString(),
      cell: ({ row }: any) => {
        const user: User = row.original;
        return h(
          UBadge,
          {
            color: user.status === "active" ? "success" : "neutral",
            variant: "subtle",
            size: "sm",
          },
          {
            default: () =>
              user.status === "active"
                ? t("organization.user.form.active")
                : t("organization.user.form.inactive"),
          }
        );
      },
    },
    {
      id: "actions",
      header: t("organization.user.table.actions").toString(),
      cell: ({ row }: any) => {
        const user = row.original as User;
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
                onClick: () => openEditForm(user),
              },
              { default: () => t("organization.common.edit") }
            ),
            h(
              UButton,
              {
                size: "xs",
                color: user.status === "active" ? "warning" : "success",
                variant: "ghost",
                icon:
                  user.status === "active"
                    ? "i-heroicons-lock-closed"
                    : "i-heroicons-lock-open",
                onClick: () => toggleUserStatus(user),
              },
              {
                default: () =>
                  user.status === "active"
                    ? t("organization.user.disable")
                    : t("organization.user.enable"),
              }
            ),
            h(
              UButton,
              {
                size: "xs",
                color: "error",
                variant: "ghost",
                icon: "i-heroicons-trash",
                onClick: () => deleteUser(user.id),
              },
              { default: () => t("organization.common.delete") }
            ),
          ].filter(Boolean)
        );
      },
    },
  ];
});

/** ========= SSR 安全的小处理 ========= */
onMounted(() => {
  // 可放置与浏览器相关的初始化逻辑
});
</script>

<template>
  <div>
    <!-- 用户管理头部 -->
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
        <UDropdownMenu :items="importExportItems">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-heroicons-arrow-up-tray"
          >
            {{ $t("organization.user.importExport") }}
          </UButton>
        </UDropdownMenu>
        <UButton color="primary" icon="i-heroicons-plus" @click="openAddForm">
          {{ $t("organization.user.add") }}
        </UButton>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex flex-wrap gap-4 items-end">
        <!-- 搜索框 -->
        <div class="flex-grow min-w-[200px]">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            :placeholder="$t('organization.user.search')"
          />
        </div>

        <!-- 部门筛选 -->
        <div class="w-full sm:w-auto">
          <UFormField
            :label="$t('organization.user.form.department')"
            class="mb-0"
          >
            <USelect
              v-model="filters.department"
              :items="departments"
              :placeholder="$t('organization.user.filter.allDepartments')"
              class="w-full sm:w-40"
            />
          </UFormField>
        </div>

        <!-- 角色筛选 -->
        <div class="w-full sm:w-auto">
          <UFormField :label="$t('organization.user.form.role')" class="mb-0">
            <USelect
              v-model="filters.role"
              :items="roles"
              :placeholder="$t('organization.user.filter.allRoles')"
              class="w-full sm:w-40"
            />
          </UFormField>
        </div>

        <!-- 状态筛选 -->
        <div class="w-full sm:w-auto">
          <UFormField :label="$t('organization.user.form.status')" class="mb-0">
            <USelect
              v-model="filters.status"
              :items="[
                {
                  label: $t('organization.user.filter.allStatus'),
                  value: 0,
                },
                {
                  label: $t('organization.user.filter.active'),
                  value: 'active',
                },
                {
                  label: $t('organization.user.filter.inactive'),
                  value: 'inactive',
                },
              ]"
              :placeholder="$t('organization.user.filter.allStatus')"
              clearable
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
            @click="resetFilters"
          >
            {{ $t("organization.user.filter.reset") }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- ✅ Nuxt UI 3.3+ 用 :data 和 TanStack columns -->
    <UTable :data="filteredUsers" :columns="columns" />

    <!-- 空状态 -->
    <div
      v-if="filteredUsers.length === 0"
      class="text-center py-12 bg-gray-50 rounded-lg mt-4"
    >
      <UIcon
        name="i-heroicons-user-slash"
        class="w-12 h-12 text-gray-400 mx-auto mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ $t("organization.user.empty.title") }}
      </h3>
      <p class="text-gray-500 mb-4">
        {{
          searchQuery || filters.department || filters.role || filters.status
            ? $t("organization.user.empty.noResults")
            : $t("organization.user.empty.create")
        }}
      </p>
      <div class="flex justify-center gap-3">
        <UButton v-if="!searchQuery" color="primary" @click="openAddForm">
          {{ $t("organization.user.add") }}
        </UButton>
        <UButton
          v-if="
            searchQuery || filters.department || filters.role || filters.status
          "
          color="neutral"
          variant="outline"
          @click="resetFilters"
        >
          {{ $t("organization.common.reset") }}
        </UButton>
      </div>
    </div>

    <!-- 用户表单对话框 -->
    <UModal v-model:open="showForm">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{
              isEditing
                ? $t("organization.user.edit")
                : $t("organization.user.add")
            }}
          </h3>

          <form @submit.prevent="saveUser">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField :label="$t('organization.user.form.name')" required>
                <UInput
                  v-model="userForm.name"
                  :placeholder="$t('organization.user.form.namePlaceholder')"
                />
              </UFormField>

              <UFormField
                :label="$t('organization.user.form.username')"
                required
              >
                <UInput
                  v-model="userForm.username"
                  :placeholder="
                    $t('organization.user.form.usernamePlaceholder')
                  "
                />
              </UFormField>

              <UFormField
                :label="$t('organization.user.form.email')"
                required
                class="md:col-span-2"
              >
                <UInput
                  v-model="userForm.email"
                  type="email"
                  :placeholder="$t('organization.user.form.emailPlaceholder')"
                />
              </UFormField>

              <UFormField :label="$t('organization.user.form.department')">
                <USelect
                  v-model="userForm.department"
                  :items="departments"
                  :placeholder="$t('organization.user.form.selectDepartment')"
                />
              </UFormField>

              <UFormField :label="$t('organization.user.form.role')">
                <USelect
                  v-model="userForm.role"
                  :items="roles"
                  :placeholder="$t('organization.user.form.selectRole')"
                />
              </UFormField>

              <UFormField
                :label="
                  isEditing
                    ? $t('organization.user.form.newPassword')
                    : $t('organization.user.form.password')
                "
                :required="!isEditing"
              >
                <UInput
                  v-model="userForm.password"
                  type="password"
                  :placeholder="
                    $t('organization.user.form.passwordPlaceholder')
                  "
                />
              </UFormField>

              <UFormField
                :label="
                  isEditing
                    ? $t('organization.user.form.confirmNewPassword')
                    : $t('organization.user.form.confirmPassword')
                "
                :required="!isEditing"
              >
                <UInput
                  v-model="userForm.confirmPassword"
                  type="password"
                  :placeholder="
                    $t('organization.user.form.passwordPlaceholder')
                  "
                />
              </UFormField>

              <UFormField
                :label="$t('organization.user.form.status')"
                class="md:col-span-2"
              >
                <URadioGroup
                  v-model="userForm.status"
                  :items="[
                    {
                      value: 'active',
                      label: $t('organization.user.form.active'),
                    },
                    {
                      value: 'inactive',
                      label: $t('organization.user.form.inactive'),
                    },
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
</template>
