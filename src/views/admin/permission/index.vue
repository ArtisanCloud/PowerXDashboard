<template>
  <div class="container">
    <a-card>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" title="资源管理">
          <ResourcePanel />
        </a-tab-pane>
        <a-tab-pane key="2" title="角色管理">
          <RolePanel />
        </a-tab-pane>
        <a-tab-pane key="3" title="菜单管理"></a-tab-pane>
        <a-tab-pane key="4" title="授权">
          <AssignPanel />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import RolePanel from '@/views/admin/permission/components/role-panel.vue';
  import ResourcePanel from '@/views/admin/permission/components/resource-panel.vue';
  import AssignPanel from '@/views/admin/permission/components/assign-panel.vue';
</script>

<script lang="ts">
  export default {
    name: 'Permission',
  };
</script>

<style scoped></style>
