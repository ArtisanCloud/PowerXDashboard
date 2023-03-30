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
            <template #cell="{ record }">
              <a-space>
                <a-button
                  type="text"
                  @click="
                    () => {
                      openPerms(record.roleCode);
                    }
                  "
                  >编辑</a-button
                >
                <a-button
                  type="text"
                  @click="
                    () => {
                      openEmployee(record.roleCode);
                    }
                  "
                  >员工</a-button
                >
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-modal
      :visible="view.permsVisible"
      :ok-loading="view.permsLoading"
      title="编辑角色"
      @cancel="view.permsVisible = false"
      @ok="
        () => {
          assignResForRoles();
        }
      "
    >
      <a-form>
        <a-form-item label="角色Code">
          <a-input v-model="statuses.currentRoleDetail.roleCode" disabled />
        </a-form-item>
        <a-form-item label="角色名">
          <a-input v-model="statuses.currentRoleDetail.name" />
        </a-form-item>
        <a-form-item label="角色描述">
          <a-textarea v-model="statuses.currentRoleDetail.desc" />
        </a-form-item>
        <a-form-item label="菜单">
          <a-scrollbar
            style="min-width: 300px; overflow-y: auto; max-height: 200px"
          >
            <a-tree
              v-model:checked-keys="statuses.currentRoleDetail.menuNames"
              :data="menus"
              checked-strategy="child"
              checkable
            >
            </a-tree>
          </a-scrollbar>
        </a-form-item>
        <a-form-item label="权限">
          <a-scrollbar
            style="min-width: 300px; overflow-y: auto; max-height: 200px"
          >
            <a-tree
              v-model:checked-keys="statuses.currentRoleDetail.actIds"
              :data="treeData"
              checked-strategy="child"
              checkable
            ></a-tree>
          </a-scrollbar>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="view.createVisible" title="创建角色">
      <a-form>
        <a-form-item label="角色Code">
          <a-input v-model="statuses.createRole.roleCode" />
        </a-form-item>
        <a-form-item label="角色名">
          <a-input v-model="statuses.createRole.name" />
        </a-form-item>
        <a-form-item label="角色描述">
          <a-textarea v-model="statuses.createRole.desc" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      :visible="view.employeeVisible"
      :ok-loading="view.employeeLoading"
      @ok="
        () => {
          assignRolesForEmployees();
        }
      "
      @cancel="
        () => {
          view.employeeVisible = false;
        }
      "
    >
      <EmployeeTransfer v-model="statuses.roleEmployeeIds" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import EmployeeTransfer from '@/views/admin/employee/components/employee-transfer.vue';
  import { Message } from '@arco-design/web-vue';
  import { isEmpty } from 'lodash';
  import { menuRoutes } from '@/router/routes';
  import { useI18n } from 'vue-i18n';
  import {
    assignAuth,
    AuthRes,
    AuthResAct,
    AuthRole,
    getRoleDetail,
    GetRoleDetailReply,
    GetRoleEmployeeIds,
    listRecourses,
    listRoles,
    ListRolesReply,
    putRoleDetail,
  } from '@/api/permission';

  const { t } = useI18n();

  const roleData = ref({} as ListRolesReply);

  function fetchRoles() {
    listRoles().then((res) => {
      roleData.value = res.data;
    });
  }

  const statuses = reactive({
    editRole: {} as AuthRole,
    createRole: {} as AuthRole,
    currentRoleCode: '',
    currentRoleDetail: {} as GetRoleDetailReply,
    roleEmployeeIds: [] as number[],
    resData: [] as Array<AuthRes>,
  });

  const view = reactive({
    createVisible: false,
    menuVisible: false,
    menuLoading: false,
    employeeVisible: false,
    employeeLoading: false,
    permsVisible: false,
    permsLoading: false,
  });

  function fetchRoleEmployeeIds(roleCode: string) {
    GetRoleEmployeeIds(roleCode).then((res) => {
      statuses.roleEmployeeIds = res.data.employeeIds;
    });
  }

  const openCreate = () => {
    statuses.createRole = {} as AuthRole;
    view.createVisible = true;
  };

  function openEmployee(roleCode: string) {
    statuses.currentRoleCode = roleCode;
    fetchRoleEmployeeIds(statuses.currentRoleCode);
    view.employeeVisible = true;
  }

  function assignRolesForEmployees() {
    if (view.employeeLoading) {
      return;
    }
    view.employeeLoading = true;
    assignAuth({
      roleAssignUsers: {
        roleCode: statuses.currentRoleCode,
        userIds: statuses.roleEmployeeIds,
        isReplace: true,
      },
    })
      .then(() => {
        Message.success('更新成功');
      })
      .finally(() => {
        view.employeeLoading = false;
      });
  }

  function fetchRes() {
    listRecourses().then((res) => {
      statuses.resData = res.data.list;
    });
  }

  const menus = computed(() => {
    const getTreeData = (elem: any) => {
      const data = {
        title: t(elem.meta.locale),
        key: elem.name,
        value: elem.name,
      } as any;
      if (elem.children?.length > 0) {
        data.children = [] as any[];
        elem.children.forEach((item: any) => {
          data.children.push(getTreeData(item));
        });
      }
      return data;
    };
    const menuData = [] as any[];
    menuRoutes.forEach((item) => {
      menuData.push(getTreeData(item));
    });
    return menuData;
  });

  function getPermTreeData(list?: Array<AuthRes>) {
    const data = [] as any[];
    if (list === undefined) {
      return data;
    }
    list.forEach((res: AuthRes) => {
      const v1 = {
        title: res.resName,
        key: res.resCode,
        value: res.resCode,
        children: [] as any[],
      };
      if (!isEmpty(res.acts)) {
        res.acts.forEach((act: AuthResAct) => {
          v1.children.push({
            title: act.desc,
            key: act.id,
            value: act.id,
            isLeaf: true,
          });
        });
      }
      data.push(v1);
    });
    return data;
  }

  const treeData = computed(() => {
    return getPermTreeData(statuses.resData);
  });

  function fetchCurrentRole() {
    getRoleDetail(statuses.currentRoleCode).then((res) => {
      statuses.currentRoleDetail = res.data;
    });
  }

  function openPerms(roleCode: string) {
    statuses.currentRoleCode = roleCode;
    fetchCurrentRole();
    view.permsVisible = true;
  }

  function assignResForRoles() {
    if (view.permsLoading) {
      return;
    }
    view.permsLoading = true;
    console.log(statuses);
    putRoleDetail(statuses.currentRoleCode, {
      name: statuses.currentRoleDetail.name,
      desc: statuses.currentRoleDetail.desc,
      actIds: statuses.currentRoleDetail.actIds,
      menuNames: statuses.currentRoleDetail.menuNames,
    })
      .then(() => {
        view.permsVisible = false;
        Message.success('更新成功');
      })
      .finally(() => {
        view.permsLoading = false;
      });
  }

  onMounted(() => {
    fetchRoles();
    fetchRes();
  });
</script>
