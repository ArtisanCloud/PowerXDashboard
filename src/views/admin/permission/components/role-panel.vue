<template>
  <div>
    <a-card>
      <a-space>
        <a-button type="primary" @click="openCreate">创建新角色</a-button>
      </a-space>
    </a-card>
    <div style="height: 8px"></div>
    <a-card>
      <a-table :data="roleData.list">
        <template #columns>
          <a-table-column title="Code" data-index="roleCode"></a-table-column>
          <a-table-column title="角色名" data-index="name"></a-table-column>
          <a-table-column title="角色描述" data-index="desc"></a-table-column>
          <a-table-column
            title="是否内置角色"
            data-index="isReserved"
          ></a-table-column>
          <a-table-column title="操作" align="center">
            <template #cell="{ rowIndex }">
              <a-button
                type="text"
                @click="
                  () => {
                    openEdit(rowIndex);
                  }
                "
                >编辑</a-button
              >
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="view.editVisible" title="编辑角色">
      <a-form>
        <a-form-item label="角色Code">
          <a-input v-model="iModel.editRole.roleCode" disabled />
        </a-form-item>
        <a-form-item label="角色名">
          <a-input v-model="iModel.editRole.name" />
        </a-form-item>
        <a-form-item label="角色描述">
          <a-textarea v-model="iModel.editRole.desc" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="view.createVisible" title="创建角色">
      <a-form>
        <a-form-item label="角色Code">
          <a-input v-model="iModel.createRole.roleCode" />
        </a-form-item>
        <a-form-item label="角色名">
          <a-input v-model="iModel.createRole.name" />
        </a-form-item>
        <a-form-item label="角色描述">
          <a-textarea v-model="iModel.createRole.desc" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { AuthRole, listRoles, ListRolesReply } from '@/api/permission';
  import { onMounted, reactive, ref } from 'vue';

  const roleData = ref({} as ListRolesReply);

  function fetchRoles() {
    listRoles().then((res) => {
      roleData.value = res.data;
    });
  }

  const iModel = reactive({
    editRole: {} as AuthRole,
    createRole: {} as AuthRole,
  });

  const view = reactive({
    editVisible: false,
    createVisible: false,
  });

  function openEdit(current: number) {
    iModel.editRole = { ...roleData.value.list[current] };
    view.editVisible = true;
  }

  const openCreate = () => {
    iModel.createRole = {} as AuthRole;
    view.createVisible = true;
  };

  onMounted(() => {
    fetchRoles();
  });
</script>
