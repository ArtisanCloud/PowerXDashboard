<template>
  <div>
    <a-form>
      <a-form-item label="授权类型">
        <a-radio-group v-model="model.type">
          <a-radio value="employee">员工</a-radio>
          <a-radio value="role">角色</a-radio>
        </a-radio-group>
      </a-form-item>
      <template v-if="model.type === 'role'">
        <a-form-item label="选择角色">
          <a-select
            v-model="model.role.roleCodes"
            :options="options.roles"
            :field-names="{ label: 'name', value: 'roleCode' }"
            multiple
          />
        </a-form-item>
        <a-form-item label="授权资源">
          <a-scrollbar style="min-width: 300px; overflow-y: auto">
            <a-tree
              v-model:checked-keys="model.role.actIds"
              :data="treeData"
              checked-strategy="child"
              checkable
            ></a-tree>
          </a-scrollbar>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click="
              () => {
                assignResForRoles();
              }
            "
            >确认授权</a-button
          >
        </a-form-item>
      </template>
      <template v-if="model.type === 'employee'">
        <a-form-item label="选择员工">
          <a-select
            v-model="model.employee.ids"
            :options="options.employees"
            :field-names="{ label: 'name', value: 'id' }"
            multiple
          />
        </a-form-item>
        <a-form-item label="授权角色">
          <a-select
            v-model="model.employee.roleCodes"
            :options="options.roles"
            :field-names="{ label: 'name', value: 'roleCode' }"
            multiple
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click="
              () => {
                assignRolesForEmployees();
              }
            "
            >确认授权</a-button
          >
        </a-form-item>
      </template>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive } from 'vue';
  import {
    Employee,
    listEmployees,
    ListEmployeesRequest,
  } from '@/api/employee';
  import { Message } from '@arco-design/web-vue';
  import {
    assignAuth,
    AuthRes,
    AuthResAct,
    AuthRole,
    listRecourses,
    ListRecoursesReply,
    listRoles,
  } from '@/api/permission';

  const model = reactive({
    resData: {} as ListRecoursesReply,
    type: 'employee' as 'role' | 'employee',
    employee: {
      ids: [] as number[],
      roleCodes: [] as string[],
    },
    role: {
      roleCodes: [] as string[],
      actIds: [] as number[],
    },
  });

  const options = reactive({
    employees: [],
    roles: [],
  } as {
    employees: Array<Employee>;
    roles: Array<AuthRole>;
  });

  function fetchRes() {
    listRecourses().then((res) => {
      model.resData = res.data;
    });
  }

  function getTreeData(list?: Array<AuthRes>) {
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
      res.acts.forEach((act: AuthResAct) => {
        v1.children.push({
          title: act.desc,
          key: act.id,
          value: act.id,
          isLeaf: true,
        });
      });
      data.push(v1);
    });
    return data;
  }

  const treeData = computed(() => {
    return getTreeData(model.resData.list);
  });

  function fetchEmployees(req = {} as ListEmployeesRequest) {
    listEmployees(req).then((res) => {
      options.employees = res.data.list;
    });
  }

  function assignRolesForEmployees() {
    assignAuth({
      userAssignRole: {
        userIds: model.employee.ids,
        roleCodes: model.employee.roleCodes,
        isReplace: false,
      },
    }).then(() => {
      Message.success('更新成功');
    });
  }

  function assignResForRoles() {
    assignAuth({
      roleAssignRes: {
        roleCodes: model.role.roleCodes,
        actIds: model.role.actIds,
        isReplace: false,
      },
    }).then(() => {
      Message.success('更新成功');
    });
  }

  onMounted(() => {
    fetchRes();
    fetchEmployees();
    listRoles().then((res) => {
      options.roles = res.data.list;
    });
  });
</script>

<script lang="ts">
  export default {
    name: 'AssignPanel',
  };
</script>

<style scoped></style>
