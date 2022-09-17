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
      <a-table :data="data.list">
        <template #columns>
          <a-table-column title="角色编码" data-index="roleCode" />
          <a-table-column title="角色名称" data-index="name" />
          <a-table-column title="角色描述" data-index="desc" />
          <a-table-column title="操作" data-index="id">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" @click="editRoleOnClick(record.roleCode)">
                  编辑角色
                </a-button>
                <a-button
                  type="text"
                  @click="editEmployeeOnClick(record.roleCode)"
                >
                  编辑员工
                </a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-drawer
      v-model:visible="state.createRole.visible"
      width="500px"
      :footer="false"
    >
      <CreateRole v-if="state.createRole.visible" />
    </a-drawer>
    <a-drawer
      v-model:visible="state.editRole.visible"
      width="500px"
      :footer="false"
    >
      <EditRole
        v-if="state.editRole.visible"
        :role-code="state.editRole.roleCode"
      />
    </a-drawer>
    <a-drawer
      v-model:visible="state.editEmployee.visible"
      width="500px"
      :footer="false"
    >
      <RoleEmployee
        v-if="state.editEmployee.visible"
        :role-code="state.editEmployee.roleCode"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import CreateRole from '@/views/admin/permission/role/components/create-role.vue';
  import EditRole from '@/views/admin/permission/role/components/edit-role.vue';
  import { onMounted, reactive, ref } from 'vue';
  import RoleEmployee from '@/views/admin/permission/role/components/role-employee.vue';
  import { listRoles, ListRolesReply } from '@/api/permission';

  const state = reactive({
    createRole: {
      visible: false,
    },
    editRole: {
      visible: false,
      roleCode: '',
    },
    editEmployee: {
      visible: false,
      roleCode: '',
    },
  });

  const data = ref({} as ListRolesReply);

  function fetch() {
    listRoles().then((res) => {
      data.value = res.data;
    });
  }

  function editEmployeeOnClick(roleCode: string) {
    state.editEmployee.visible = true;
    state.editEmployee.roleCode = roleCode;
  }

  function editRoleOnClick(roleCode: string) {
    state.editRole.visible = true;
    state.editRole.roleCode = roleCode;
  }

  onMounted(() => {
    fetch();
  });
</script>

<script lang="ts">
  export default {
    name: 'RoleList',
  };
</script>
