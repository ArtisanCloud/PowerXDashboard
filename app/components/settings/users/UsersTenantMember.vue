<!-- /components/settings/users/UsersTenantMember.vue -->
<script setup lang="ts">
import { ref, computed, h, resolveComponent, onMounted } from "vue";
import { useI18n } from "#imports";

const props = defineProps<{ tenantId: number }>();
const { t, locale } = useI18n();

type StatusType = "active" | "inactive";
interface RowUser {
  id: number;
  name: string;
  username: string;
  email: string;
  department?: string;
  status: StatusType | string;
  avatar: string;
}

const users = ref<RowUser[]>([]);
const searchQuery = ref("");

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return users.value.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
  );
});

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

onMounted(async () => {
  // 只读：展示"可见范围"的成员，后端按 DataScope 过滤
  // const res = await $fetch('/api/v1/admin/iam/members', { params: {...} })
  users.value = [
    {
      id: 3,
      name: "王五",
      username: "wangwu",
      email: "wangwu@example.com",
      department: "销售部",
      status: "inactive",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: 4,
      name: "赵六",
      username: "zhaoliu",
      email: "zhaoliu@example.com",
      department: "人力资源部",
      status: "active",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
  ];
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">
          {{ $t("organization.user.title") }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          {{ $t("organization.user.description") }}（只读）
        </p>
      </div>
      <div class="w-64">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          :placeholder="$t('organization.user.search')"
        />
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm">
      <UTable :data="filtered" :columns="columns" />
    </div>
  </div>
</template>
