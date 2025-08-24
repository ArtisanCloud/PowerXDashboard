<!-- /components/settings/users/UsersTenantMember.vue -->
<script setup lang="ts">
import { ref, computed, h, resolveComponent, onMounted, watch } from "vue";
import { useI18n } from "#imports";

// Member不需要传入tenantId，而是自己选择所属的租户
const { t, locale } = useI18n();

// 租户相关
interface UserTenant {
  id: number;
  name: string;
  domain: string;
}

// 用户数据结构
interface RowUser {
  id: number;
  name: string;
  username: string;
  email: string;
  department?: string;
  phone?: string;
  status: "active" | "inactive";
  avatar: string;
  joinedAt: string;
}

// 状态管理
const myTenants = ref<UserTenant[]>([]);
const selectedTenantId = ref<number | null>(null);
const users = ref<RowUser[]>([]);
const searchQuery = ref("");
const isLoading = ref(false);

// 计算属性
const selectedTenant = computed(() =>
  myTenants.value.find((t) => t.id === selectedTenantId.value)
);

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return users.value.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.department && u.department.toLowerCase().includes(q))
  );
});

// 表格列定义（只读，无操作列）
const UAvatar = resolveComponent("UAvatar");
const UBadge = resolveComponent("UBadge");
const columns = computed(() => {
  const _ = locale.value;
  return [
    {
      id: "avatar",
      accessorKey: "avatar",
      header: "",
      cell: ({ row }: any) =>
        h(UAvatar, { src: row.original.avatar, size: "sm" }),
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
      id: "phone",
      accessorKey: "phone",
      header: "联系电话",
    },
    {
      id: "joinedAt",
      accessorKey: "joinedAt",
      header: "加入时间",
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("organization.user.table.status").toString(),
      cell: ({ row }: any) =>
        h(
          UBadge,
          {
            color: row.original.status === "active" ? "success" : "neutral",
            variant: "subtle",
            size: "sm",
          },
          () =>
            row.original.status === "active"
              ? t("organization.user.form.active")
              : t("organization.user.form.inactive")
        ),
    },
  ];
});

// 方法
async function loadMyTenants() {
  try {
    // TODO: 替换为真实API调用
    // const response = await $fetch('/api/v1/user/my-tenants');

    // 模拟数据：Member通常只属于少数几个租户
    myTenants.value = [
      { id: 101, name: "科技有限公司", domain: "tech.example.com" },
      { id: 102, name: "营销部门", domain: "marketing.example.com" },
      { id: 103, name: "研发中心", domain: "rd.example.com" },
    ];

    // 默认选择第一个租户
    if (myTenants.value.length > 0) {
      selectedTenantId.value = myTenants.value[0].id;
    }
  } catch (error) {
    console.error("加载我的租户列表失败:", error);
  }
}

async function loadTenantUsers() {
  if (!selectedTenantId.value) return;

  isLoading.value = true;
  try {
    // TODO: 替换为真实API调用
    // const response = await $fetch(`/api/v1/user/tenants/${selectedTenantId.value}/members`);

    // 模拟数据：根据数据权限范围，Member只能看到有权限看到的用户
    await new Promise((resolve) => setTimeout(resolve, 300));

    const mockUsers = [
      {
        id: 1,
        name: "张三",
        username: "zhangsan",
        email: "zhangsan@example.com",
        department: "技术部",
        phone: "138****1234",
        status: "active" as const,
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        joinedAt: "2024-01-15",
      },
      {
        id: 2,
        name: "李四",
        username: "lisi",
        email: "lisi@example.com",
        department: "产品部",
        phone: "139****5678",
        status: "active" as const,
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        joinedAt: "2024-02-20",
      },
      {
        id: 3,
        name: "王五",
        username: "wangwu",
        email: "wangwu@example.com",
        department: "设计部",
        phone: "136****9012",
        status: "inactive" as const,
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        joinedAt: "2024-03-10",
      },
    ];

    // 根据不同租户返回不同的用户列表（模拟数据权限）
    users.value = mockUsers.filter(
      (_, index) =>
        (selectedTenantId.value === 101 && index < 3) ||
        (selectedTenantId.value === 102 && index < 2) ||
        (selectedTenantId.value === 103 && index === 0)
    );
  } catch (error) {
    console.error("加载租户用户失败:", error);
    users.value = [];
  } finally {
    isLoading.value = false;
  }
}

// 监听租户切换
watch(selectedTenantId, () => {
  if (selectedTenantId.value) {
    loadTenantUsers();
  }
});

onMounted(async () => {
  await loadMyTenants();
});
</script>

<template>
  <div>
    <!-- 顶部：租户选择 + 说明 -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">
          {{ $t("organization.user.title") }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          查看我所在租户的同事信息（只读权限）
        </p>
      </div>

      <!-- 租户选择器 -->
      <div class="flex items-center gap-3">
        <UFormField label="选择租户" class="mb-0">
          <USelect
            v-model="selectedTenantId"
            :options="myTenants.map((t) => ({ label: t.name, value: t.id }))"
            class="w-48"
            :disabled="myTenants.length === 0"
          />
        </UFormField>
      </div>
    </div>

    <!-- 当前租户信息 -->
    <div
      v-if="selectedTenant"
      class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
        >
          <UIcon
            name="i-heroicons-building-office"
            class="h-4 w-4 text-blue-600"
          />
        </div>
        <div>
          <h3 class="font-medium text-blue-900">{{ selectedTenant.name }}</h3>
          <p class="text-sm text-blue-600">{{ selectedTenant.domain }}</p>
        </div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="mb-4">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="搜索同事姓名、用户名、邮箱或部门..."
        class="max-w-md"
      />
    </div>

    <!-- 用户列表 -->
    <div class="bg-white rounded-lg shadow-sm">
      <div v-if="isLoading" class="p-8 text-center">
        <UIcon
          name="i-heroicons-arrow-path"
          class="animate-spin h-6 w-6 mx-auto mb-2"
        />
        <p class="text-gray-500">加载用户列表中...</p>
      </div>

      <div v-else-if="!selectedTenantId" class="p-8 text-center text-gray-500">
        <UIcon
          name="i-heroicons-building-office"
          class="h-12 w-12 mx-auto mb-4 text-gray-300"
        />
        <p>请选择一个租户查看用户信息</p>
      </div>

      <div
        v-else-if="filteredUsers.length === 0"
        class="p-8 text-center text-gray-500"
      >
        <UIcon
          name="i-heroicons-users"
          class="h-12 w-12 mx-auto mb-4 text-gray-300"
        />
        <p>没有找到匹配的用户</p>
      </div>

      <div v-else>
        <UTable :data="filteredUsers" :columns="columns" />

        <!-- 统计信息 -->
        <div class="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p class="text-sm text-gray-600">
            共 {{ filteredUsers.length }} 位同事
            <span v-if="searchQuery.trim()" class="ml-2">
              （搜索："{{ searchQuery.trim() }}"）
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- 权限说明 -->
    <div class="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
      <div class="flex items-start gap-2">
        <UIcon
          name="i-heroicons-information-circle"
          class="h-5 w-5 text-amber-600 mt-0.5"
        />
        <div class="text-sm text-amber-800">
          <p class="font-medium">权限说明</p>
          <p class="mt-1">
            您只能查看有权限访问的同事信息，无法进行编辑、添加或删除操作。如需更多权限，请联系管理员。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
