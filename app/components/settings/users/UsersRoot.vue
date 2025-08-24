<!-- /components/settings/users/UsersRoot.vue -->
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import UsersTenantAdmin from "./UsersTenantAdmin.vue";
import { useI18n } from "#imports";

const { t } = useI18n();

// 租户数据结构
interface Tenant {
  id: number;
  name: string;
  domain: string;
  status: "active" | "inactive" | "suspended";
  userCount: number;
  createdAt: string;
  plan: string;
}

// 状态管理
const tenants = ref<Tenant[]>([]);
const selectedTenant = ref<Tenant | null>(null);
const searchQuery = ref("");
const isLoading = ref(false);

// 分页和筛选
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
});

const filters = reactive({
  status: null as string | null,
  plan: null as string | null,
});

// 筛选选项
const statusOptions = [
  { label: "全部状态", value: null },
  { label: "活跃", value: "active" },
  { label: "停用", value: "inactive" },
  { label: "暂停", value: "suspended" },
];

const planOptions = [
  { label: "全部套餐", value: null },
  { label: "免费版", value: "free" },
  { label: "专业版", value: "pro" },
  { label: "企业版", value: "enterprise" },
];

// 计算属性
const filteredTenants = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return tenants.value.filter((tenant) => {
    const matchSearch =
      !q ||
      tenant.name.toLowerCase().includes(q) ||
      tenant.domain.toLowerCase().includes(q);
    const matchStatus = !filters.status || tenant.status === filters.status;
    const matchPlan = !filters.plan || tenant.plan === filters.plan;
    return matchSearch && matchStatus && matchPlan;
  });
});

const paginatedTenants = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize;
  const filtered = filteredTenants.value;
  pagination.total = filtered.length;
  pagination.totalPages = Math.ceil(filtered.length / pagination.pageSize);
  return filtered.slice(start, start + pagination.pageSize);
});

// 方法
async function loadTenants() {
  isLoading.value = true;
  try {
    // TODO: 替换为真实API调用
    // const response = await $fetch('/api/v1/admin/tenants', {
    //   params: { page: pagination.page, size: pagination.pageSize, ...filters }
    // });

    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 500));
    tenants.value = Array.from({ length: 150 }, (_, i) => ({
      id: i + 1,
      name: `租户公司 ${i + 1}`,
      domain: `tenant${i + 1}.example.com`,
      status: ["active", "inactive", "suspended"][
        Math.floor(Math.random() * 3)
      ] as any,
      userCount: Math.floor(Math.random() * 500) + 10,
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      plan: ["free", "pro", "enterprise"][Math.floor(Math.random() * 3)],
    }));
  } catch (error) {
    console.error("加载租户列表失败:", error);
  } finally {
    isLoading.value = false;
  }
}

function selectTenant(tenant: Tenant) {
  selectedTenant.value = tenant;
}

function backToTenantList() {
  selectedTenant.value = null;
}

function resetFilters() {
  searchQuery.value = "";
  filters.status = null;
  filters.plan = null;
  pagination.page = 1;
}

function changePage(page: number) {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.page = page;
  }
}

// 状态显示
function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "neutral";
    case "suspended":
      return "warning";
    default:
      return "neutral";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "active":
      return "活跃";
    case "inactive":
      return "停用";
    case "suspended":
      return "暂停";
    default:
      return status;
  }
}

function getPlanText(plan: string) {
  switch (plan) {
    case "free":
      return "免费版";
    case "pro":
      return "专业版";
    case "enterprise":
      return "企业版";
    default:
      return plan;
  }
}

// 监听搜索和筛选变化
watch([searchQuery, () => filters.status, () => filters.plan], () => {
  pagination.page = 1;
});

onMounted(() => {
  loadTenants();
});
</script>

<template>
  <div>
    <!-- 租户选择界面 -->
    <div v-if="!selectedTenant">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-semibold">
            {{ t("organization.user.title") }} · Root 管理
          </h2>
          <p class="text-sm text-gray-500">
            选择要管理的租户，查看和管理其用户信息
          </p>
        </div>
        <UButton
          icon="i-heroicons-arrow-path"
          variant="outline"
          @click="loadTenants"
          :loading="isLoading"
        >
          刷新
        </UButton>
      </div>

      <!-- 搜索和筛选 -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-grow min-w-[300px]">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="搜索租户名称或域名..."
            />
          </div>
          <UFormField label="状态筛选">
            <USelect
              v-model="filters.status"
              :options="statusOptions"
              class="w-32"
            />
          </UFormField>
          <UFormField label="套餐筛选">
            <USelect
              v-model="filters.plan"
              :options="planOptions"
              class="w-32"
            />
          </UFormField>
          <UButton
            icon="i-heroicons-arrow-path"
            variant="ghost"
            @click="resetFilters"
          >
            重置
          </UButton>
        </div>
      </div>

      <!-- 租户列表 -->
      <div class="bg-white rounded-lg shadow-sm">
        <div v-if="isLoading" class="p-8 text-center">
          <UIcon
            name="i-heroicons-arrow-path"
            class="animate-spin h-6 w-6 mx-auto mb-2"
          />
          <p class="text-gray-500">加载租户列表中...</p>
        </div>

        <div
          v-else-if="paginatedTenants.length === 0"
          class="p-8 text-center text-gray-500"
        >
          <UIcon
            name="i-heroicons-building-office"
            class="h-12 w-12 mx-auto mb-4 text-gray-300"
          />
          <p>没有找到匹配的租户</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="tenant in paginatedTenants"
            :key="tenant.id"
            class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            @click="selectTenant(tenant)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-building-office"
                      class="h-5 w-5 text-blue-600"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ tenant.name }}</h3>
                    <p class="text-sm text-gray-500">{{ tenant.domain }}</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-4 text-sm">
                <div class="text-center">
                  <p class="font-medium text-gray-900">
                    {{ tenant.userCount }}
                  </p>
                  <p class="text-gray-500">用户数</p>
                </div>

                <div class="text-center">
                  <UBadge
                    :color="getStatusColor(tenant.status)"
                    variant="subtle"
                  >
                    {{ getStatusText(tenant.status) }}
                  </UBadge>
                  <p class="text-gray-500 mt-1">
                    {{ getPlanText(tenant.plan) }}
                  </p>
                </div>

                <div class="text-center">
                  <p class="text-gray-500">{{ tenant.createdAt }}</p>
                  <p class="text-gray-400 text-xs">创建时间</p>
                </div>

                <UIcon
                  name="i-heroicons-chevron-right"
                  class="h-5 w-5 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div
          v-if="pagination.totalPages > 1"
          class="px-6 py-4 border-t border-gray-200"
        >
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600">
              显示第 {{ (pagination.page - 1) * pagination.pageSize + 1 }} -
              {{
                Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total
                )
              }}
              条， 共 {{ pagination.total }} 个租户
            </div>
            <div class="flex gap-2">
              <UButton
                :disabled="pagination.page <= 1"
                variant="outline"
                size="sm"
                icon="i-heroicons-chevron-left"
                @click="changePage(pagination.page - 1)"
              >
                上一页
              </UButton>
              <UButton
                :disabled="pagination.page >= pagination.totalPages"
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
    </div>

    <!-- 选中租户后的用户管理界面 -->
    <div v-else>
      <div class="flex items-center gap-3 mb-6">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          @click="backToTenantList"
        >
          返回租户列表
        </UButton>
        <div class="h-6 w-px bg-gray-300"></div>
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
            <h2 class="text-xl font-semibold">{{ selectedTenant.name }}</h2>
            <p class="text-sm text-gray-500">
              {{ selectedTenant.domain }} ·
              {{ selectedTenant.userCount }} 个用户
            </p>
          </div>
        </div>
      </div>

      <UsersTenantAdmin :tenant-id="selectedTenant.id" />
    </div>
  </div>
</template>
