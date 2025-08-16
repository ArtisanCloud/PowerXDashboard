<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useHead({
  title: t("dashboard.title"),
  meta: [{ name: "description", content: t("dashboard.description") }],
});

// 统计数据
const stats = ref([
  {
    title: t("dashboard.stats.totalUsers"),
    value: "12,345",
    change: "+12%",
    changeType: "positive",
    icon: "i-heroicons-users",
  },
  {
    title: t("dashboard.stats.todayVisits"),
    value: "2,847",
    change: "+5.2%",
    changeType: "positive",
    icon: "i-heroicons-eye",
  },
  {
    title: t("dashboard.stats.totalRevenue"),
    value: "¥89,432",
    change: "-2.1%",
    changeType: "negative",
    icon: "i-heroicons-currency-yen",
  },
  {
    title: t("dashboard.stats.activeUsers"),
    value: "8,921",
    change: "+8.7%",
    changeType: "positive",
    icon: "i-heroicons-chart-bar-square",
  },
]);

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    user: t("dashboard.activities.users.zhangsan"),
    action: t("dashboard.activities.actions.createArticle"),
    target: t("dashboard.activities.targets.vueBestPractices"),
    time: t("dashboard.activities.times.minutesAgo", { minutes: 2 }),
    type: "create",
  },
  {
    id: 2,
    user: t("dashboard.activities.users.lisi"),
    action: t("dashboard.activities.actions.updateProfile"),
    target: "",
    time: t("dashboard.activities.times.minutesAgo", { minutes: 5 }),
    type: "update",
  },
  {
    id: 3,
    user: t("dashboard.activities.users.wangwu"),
    action: t("dashboard.activities.actions.deleteComment"),
    target: t("dashboard.activities.targets.onTechShare"),
    time: t("dashboard.activities.times.minutesAgo", { minutes: 10 }),
    type: "delete",
  },
]);
</script>

<template>
  <div class="space-y-6 p-4">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard v-for="stat in stats" :key="stat.title" class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">
              {{ stat.value }}
            </p>
            <div class="flex items-center mt-2">
              <span
                class="text-sm font-medium"
                :class="{
                  'text-green-600': stat.changeType === 'positive',
                  'text-red-600': stat.changeType === 'negative',
                }"
              >
                {{ stat.change }}
              </span>
              <span class="text-sm text-gray-500 ml-1">{{
                $t("dashboard.stats.vsLastMonth")
              }}</span>
            </div>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg">
                        <span class="w-6 h-6 text-blue-600 inline-block">
              <UIcon :name="stat.icon" />
            </span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 图表和活动 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 图表区域 -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t("dashboard.charts.visitTrend") }}
              </h3>
              <UButton variant="ghost" size="sm">
                {{ $t("dashboard.common.viewDetails") }}
              </UButton>
            </div>
          </template>

          <div
            class="h-64 bg-gray-50 rounded-lg flex items-center justify-center"
          >
            <div class="text-center">
                            <span class="w-12 h-12 text-gray-400 mx-auto mb-2 inline-block">
                <UIcon
                                name="i-heroicons-chart-bar" />
              </span>
              <p class="text-gray-500">
                {{ $t("dashboard.charts.chartArea") }}
              </p>
              <p class="text-sm text-gray-400">
                {{ $t("dashboard.charts.integration") }}
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 最近活动 -->
      <div>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ $t("dashboard.activities.title") }}
            </h3>
          </template>

          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start space-x-3"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                :class="{
                  'bg-green-500': activity.type === 'create',
                  'bg-blue-500': activity.type === 'update',
                  'bg-red-500': activity.type === 'delete',
                }"
              >
                {{ activity.user.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">
                  <span class="font-medium">{{ activity.user }}</span>
                  {{ activity.action }}
                  <span v-if="activity.target" class="font-medium">{{
                    activity.target
                  }}</span>
                </p>
                <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>

          <template #footer>
            <UButton variant="ghost" block>
              {{ $t("dashboard.activities.viewAll") }}
            </UButton>
          </template>
        </UCard>
      </div>
    </div>

    <!-- 快速操作 -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ $t("dashboard.quickActions.title") }}
        </h3>
      </template>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UButton
          variant="outline"
          class="h-20 flex flex-col items-center justify-center space-y-2"
          :to="$localePath('/settings/users')"
        >
                    <span class="w-6 h-6 inline-block">
            <UIcon name="i-heroicons-user-plus" />
          </span>
          <span class="text-sm">{{
            $t("dashboard.quickActions.addUser")
          }}</span>
        </UButton>

        <UButton
          variant="outline"
          class="h-20 flex flex-col items-center justify-center space-y-2"
          :to="$localePath('/content/articles/create')"
        >
          <span class="w-6 h-6 inline-block">
            <UIcon name="i-heroicons-document-plus" />
          </span>
          <span class="text-sm">{{
            $t("dashboard.quickActions.createArticle")
          }}</span>
        </UButton>

        <UButton
          variant="outline"
          class="h-20 flex flex-col items-center justify-center space-y-2"
          :to="$localePath('/analytics')"
        >
                    <span class="w-6 h-6 inline-block">
            <UIcon name="i-heroicons-chart-bar" />
          </span>
          <span class="text-sm">{{
            $t("dashboard.quickActions.viewAnalytics")
          }}</span>
        </UButton>

        <UButton
          variant="outline"
          class="h-20 flex flex-col items-center justify-center space-y-2"
          :to="$localePath('/settings')"
        >
                    <span class="w-6 h-6 inline-block">
            <UIcon name="i-heroicons-cog-6-tooth" />
          </span>
          <span class="text-sm">{{
            $t("dashboard.quickActions.systemSettings")
          }}</span>
        </UButton>
      </div>
    </UCard>
  </div>
</template>
