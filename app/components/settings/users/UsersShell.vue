<!-- /components/settings/users/UsersShell.vue -->
<script setup lang="ts">
import { computed } from "vue";
import UsersRoot from "./UsersRoot.vue";
import UsersTenantAdmin from "./UsersTenantAdmin.vue";
import UsersTenantMember from "./UsersTenantMember.vue";

/** 你可以从 pinia/auth 或 composable 注入这些上下文 */
const props = defineProps<{
  isRoot: boolean;
  isTenantAdmin: boolean;
  // 当前上下文租户（非 root 时必有）
  tenantId?: number;
}>();

const view = computed(() =>
  props.isRoot ? "root" : props.isTenantAdmin ? "admin" : "member"
);
</script>

<template>
  <UsersRoot v-if="view==='root'" />
  <UsersTenantAdmin v-else-if="view==='admin'" :tenant-id="tenantId!" />
  <UsersTenantMember v-else :tenant-id="tenantId!" />
</template>