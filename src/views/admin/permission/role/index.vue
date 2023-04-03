<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="state.createRole.visible = true">
          新增角色
        </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <a-table>
        <a-table-column title="角色名称" data-index="name" />
        <a-table-column title="角色描述" data-index="desc" />
        <a-table-column title="操作" data-index="id">
          <template #cell="{ record }">
            <a-space>
              <a-button type="primary" @click="editRoleOnClick(record.id)">
                编辑角色
              </a-button>
              <a-button
                type="primary"
                @click="editPermissionOnClick(record.id)"
              >
                编辑权限
              </a-button>
              <a-button type="primary" @click="editMenuOnClick(record.id)">
                编辑菜单
              </a-button>
              <a-button type="primary" @click="editEmployeeOnClick(record.id)">
                编辑员工
              </a-button>
            </a-space>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <a-drawer v-model:visible="state.createRole.visible" width="500px">
      <CreateRole v-if="state.createRole.visible" />
    </a-drawer>
    <a-drawer v-model:visible="state.editRole.visible" width="500px">
      <EditRole v-if="state.editRole.visible" :id="state.editRole.id" />
    </a-drawer>
    <a-drawer v-model:visible="state.editPermission.visible" width="500px">
      <role-api
        v-if="state.editPermission.visible"
        :id="state.editPermission.id"
      />
    </a-drawer>
    <a-drawer v-model:visible="state.editMenu.visible" width="500px">
      <role-menu v-if="state.editMenu.visible" :id="state.editMenu.id" />
    </a-drawer>
    <a-drawer v-model:visible="state.editEmployee.visible" width="500px">
      <role-employee
        v-if="state.editEmployee.visible"
        :id="state.editEmployee.id"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import CreateRole from '@/views/admin/permission/role/components/create-role.vue';
  import EditRole from '@/views/admin/permission/role/components/edit-role.vue';
  import RoleApi from '@/views/admin/permission/role/components/role-api.vue';
  import { reactive } from 'vue';

  const state = reactive({
    createRole: {
      visible: false,
    },
    editRole: {
      visible: false,
      id: 0,
    },
    editPermission: {
      visible: false,
      id: 0,
    },
    editMenu: {
      visible: false,
      id: 0,
    },
    editEmployee: {
      visible: false,
      id: 0,
    },
  });

  function editPermissionOnClick(id: number) {
    state.editPermission.visible = true;
    state.editPermission.id = id;
  }

  function editMenuOnClick(id: number) {
    state.editMenu.visible = true;
    state.editMenu.id = id;
  }

  function editEmployeeOnClick(id: number) {
    state.editEmployee.visible = true;
    state.editEmployee.id = id;
  }

  function editRoleOnClick(id: number) {
    state.editRole.visible = true;
    state.editRole.id = id;
  }
</script>

<script lang="ts">
  export default {
    name: 'RoleList',
  };
</script>
