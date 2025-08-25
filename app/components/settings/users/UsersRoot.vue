<!-- /components/settings/users/UsersRoot.vue -->
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import UsersTenantAdmin from "./UsersTenantAdmin.vue";
import { useI18n } from "#imports";
import {
  tenantService,
  type Tenant,
} from "~/composables/api/services/tenantService";

const { t } = useI18n();

// 租户状态映射
const statusMap = {
  1: "active",
  0: "inactive",
  2: "suspended",
} as const;

// 转换后的租户数据结构
interface DisplayTenant {
  id: number;
  name: string;
  domain: string;
  status: "active" | "inactive" | "suspended";
  userCount: number;
  createdAt: string;
  plan: string;
}

// 状态管理
const tenants = ref<DisplayTenant[]>([]);
const selectedTenant = ref<DisplayTenant | null>(null);
const searchQuery = ref("");

// 分页和筛选
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
});

const filters = reactive({
  status: null as number | null,
  plan: null as string | null,
});

// 筛选选项
const statusOptions = [
  { label: "全部状态", value: null },
  { label: "活跃", value: 1 },
  { label: "停用", value: 0 },
  { label: "暂停", value: 2 },
];

const planOptions = [
  { label: "全部套餐", value: null },
  { label: "免费版", value: "free" },
  { label: "专业版", value: "pro" },
  { label: "企业版", value: "enterprise" },
];

// 计算属性 - 使用服务端分页，不需要客户端过滤
const paginatedTenants = computed(() => tenants.value);

// 方法
async function loadTenants() {
  try {
    const response = await tenantService.getTenants({
      page: pagination.page,
      page_size: pagination.pageSize,
      status: filters.status ?? undefined,
      plan: filters.plan ?? undefined,
      search: searchQuery.value.trim() || undefined,
    });

    if (response.code === 200) {
      // 转换API数据为显示格式
      tenants.value = response.data.items.map(
        (tenant: Tenant): DisplayTenant => ({
          id: tenant.id,
          name: tenant.name,
          domain: tenant.domain,
          status:
            statusMap[tenant.status as keyof typeof statusMap] || "inactive",
          userCount: tenant.user_count,
          createdAt: new Date(tenant.createdAt).toLocaleDateString("zh-CN"),
          plan: tenant.plan,
        })
      );

      // 更新分页信息
      pagination.total = response.data.pagination.total;
      pagination.totalPages = response.data.pagination.pages;
    }
  } catch (error) {
    console.error("加载租户列表失败:", error);
    // 错误提示已在tenantService中处理
  }
}

function selectTenant(tenant: DisplayTenant) {
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
  loadTenants();
}

function changePage(page: number) {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.page = page;
    loadTenants();
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

// 防抖定时器
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

// 监听筛选变化，立即触发重新加载
watch([() => filters.status, () => filters.plan], () => {
  pagination.page = 1;
  loadTenants();
});

// 监听搜索变化，使用防抖延迟触发
watch(searchQuery, () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    pagination.page = 1;
    loadTenants();
  }, 800);
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
              :items="statusOptions"
              class="w-32"
            />
          </UFormField>
          <UFormField label="套餐筛选">
            <USelect v-model="filters.plan" :items="planOptions" class="w-32" />
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
        <div
          v-if="paginatedTenants.length === 0"
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
                    <p class="text-sm text-gray-500">
                      {{ tenant.domain || "无域名" }}
                    </p>
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
              {{ selectedTenant.domain || "无域名" }} ·
              {{ selectedTenant.userCount }} 个用户
            </p>
          </div>
        </div>
      </div>

      <UsersTenantAdmin :tenant-id="selectedTenant.id" />
    </div>
  </div>
</template>
