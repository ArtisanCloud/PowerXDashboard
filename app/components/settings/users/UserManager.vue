<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { useI18n } from "vue-i18n";

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

/** ========= i18n ========= */
const { t } = useI18n();

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

const departments = ref<string[]>([
  "技术部",
  "市场部",
  "销售部",
  "人力资源部",
  "财务部",
]);

const roles = ref<RoleType[]>(["管理员", "编辑", "用户"]);

/** ========= 搜索与筛选 ========= */
const searchQuery = ref("");
const filters = reactive({
  department: "",
  role: "",
  status: "",
});

/** ========= 表格列 ========= */
const columns = computed(() => [
  { key: "avatar", id: "avatar", label: " " },
  { key: "name", id: "name", label: t("organization.user.table.name") },
  {
    key: "username",
    id: "username",
    label: t("organization.user.table.username"),
  },
  { key: "email", id: "email", label: t("organization.user.table.email") },
  {
    key: "department",
    id: "department",
    label: t("organization.user.table.department"),
  },
  { key: "role", id: "role", label: t("organization.user.table.role") },
  { key: "status", id: "status", label: t("organization.user.table.status") },
  {
    key: "actions",
    id: "actions",
    label: t("organization.user.table.actions"),
  },
]);

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
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".csv,.json";

  fileInput.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onerror = () => alert(t("organization.user.import.failed"));
    reader.onload = (event) => {
      try {
        const text = String(event.target?.result ?? "");
        if (file.name.toLowerCase().endsWith(".csv")) {
          Papa.parse<ImportUserShape>(text, {
            header: true,
            skipEmptyLines: "greedy",
            transformHeader: (h) => h.trim(),
            complete: (results) => {
              processImportedUsers(results.data);
            },
            error: (err) => {
              alert(t("organization.user.import.failed") + ": " + err.message);
            },
          });
        } else if (file.name.toLowerCase().endsWith(".json")) {
          const imported = JSON.parse(text) as ImportUserShape[];
          processImportedUsers(imported);
        } else {
          alert(t("organization.user.import.invalidFormat"));
        }
      } catch (error: any) {
        alert(t("organization.user.import.failed") + ": " + error?.message);
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
    alert(t("organization.user.import.invalidEmail"));
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
    alert(t("organization.user.import.noNew"));
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
    alert(t("organization.user.form.required"));
    return;
  }
  if (!isValidEmail(userForm.email)) {
    alert(t("organization.user.form.invalidEmail"));
    return;
  }
  if (!isEditing.value && userForm.password !== userForm.confirmPassword) {
    alert(t("organization.user.form.passwordMismatch"));
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
  if (confirm(t("organization.user.deleteConfirm"))) {
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
              :options="departments"
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
              :options="roles"
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
              :options="[
                { label: $t('organization.user.filter.allStatus'), value: '' },
                {
                  label: $t('organization.user.filter.active'),
                  value: 'active',
                },
                {
                  label: $t('organization.user.filter.inactive'),
                  value: 'inactive',
                },
              ]"
              option-attribute="value"
              :placeholder="$t('organization.user.filter.allStatus')"
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

    <!-- 用户列表 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <UTable :columns="columns" :rows="filteredUsers">
        <!-- 头像列 -->
        <template #avatar-data="{ row }">
          <UAvatar :src="row.avatar" :alt="row.name" size="sm" />
        </template>

        <!-- 状态列 -->
        <template #status-data="{ row }">
          <UBadge
            :color="row.status === 'active' ? 'success' : 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{
              row.status === "active"
                ? $t("organization.user.form.active")
                : $t("organization.user.form.inactive")
            }}
          </UBadge>
        </template>

        <!-- 操作列 -->
        <template #actions-data="{ row }">
          <div class="flex space-x-2">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              size="xs"
              @click="openEditForm(row)"
            >
              {{ $t("organization.common.edit") }}
            </UButton>
            <UButton
              :color="row.status === 'active' ? 'warning' : 'success'"
              variant="ghost"
              :icon="
                row.status === 'active'
                  ? 'i-heroicons-lock-closed'
                  : 'i-heroicons-lock-open'
              "
              size="xs"
              @click="toggleUserStatus(row)"
            >
              {{
                row.status === "active"
                  ? $t("organization.user.disable")
                  : $t("organization.user.enable")
              }}
            </UButton>
            <UButton
              color="error"
              variant="ghost"
              icon="i-heroicons-trash"
              size="xs"
              @click="deleteUser(row.id)"
            >
              {{ $t("organization.common.delete") }}
            </UButton>
          </div>
        </template>
      </UTable>

      <!-- 空状态 -->
      <div
        v-if="filteredUsers.length === 0"
        class="text-center py-12 bg-gray-50"
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
              searchQuery ||
              filters.department ||
              filters.role ||
              filters.status
            "
            color="neutral"
            variant="outline"
            @click="resetFilters"
          >
            {{ $t("organization.common.reset") }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- 用户表单对话框 -->
    <UModal v-model:open="showForm" :ui="{ width: 'sm:max-w-lg' }">
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
                  :options="departments"
                  :placeholder="$t('organization.user.form.selectDepartment')"
                />
              </UFormField>

              <UFormField :label="$t('organization.user.form.role')">
                <USelect
                  v-model="userForm.role"
                  :options="roles"
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
        </div></template
      >
    </UModal>
  </div>
</template>
