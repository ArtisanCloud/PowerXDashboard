<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button
          type="primary"
          @click="
            () => {
              view.createVisible = true;
            }
          "
          >新增部门</a-button
        >
      </a-space>
    </a-card>
    <br />
    <a-card>
      <a-table
        v-if="depData.length > 0"
        :data="depData"
        row-key="id"
        :loading="view.tableLoading"
        hide-expand-button-on-empty
        default-expand-all-rows
      >
        <template #columns>
          <a-table-column title="部门名称">
            <template #cell="{ record }">
              <a-link
                @click="
                  () => {
                    $router.push(
                      `/admin/organization/department/${record.id}/detail`
                    );
                  }
                "
                >{{ record.depName }}</a-link
              >
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="300">
            <template #cell="{ record }">
              <a-space size="large">
                <a-link
                  @click="
                    () => {
                      createForm.pId = record.id;
                      view.createVisible = true;
                    }
                  "
                  >添加子部门</a-link
                >
                <a-link
                  @click="
                    () => {
                      depDetailModel = record;
                      view.detailVisible = true;
                    }
                  "
                  >详情</a-link
                >
                <a-link
                  status="danger"
                  @click="
                    () => {
                      deleteDep(record.id);
                    }
                  "
                  >删除</a-link
                >
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="view.createVisible"
      title="新建部门"
      :on-before-ok="createOnClick"
    >
      <a-form ref="createFormRef" :model="createForm">
        <a-form-item
          label="部门名称"
          field="depName"
          :rules="[{ required: true, message: '部门名称是必填项' }]"
        >
          <a-input v-model="createForm.depName" />
        </a-form-item>
        <a-form-item
          label="父部门"
          field="pId"
          :rules="[{ required: true, message: '父部门是必选项' }]"
        >
          <a-tree-select
            v-model="createForm.pId"
            :field-names="{ title: 'depName', key: 'id', children: 'children' }"
            :data="depData"
          />
        </a-form-item>
        <a-form-item
          label="部门负责人"
          field="leaderIds"
          :rules="[{ required: true, message: '部门负责人是必选项' }]"
        >
          <EmployeeSelect v-model="createForm.leaderIds" />
        </a-form-item>
        <a-form-item
          label="手机号"
          :rules="{
            match: RegExp(
              '^1(3\\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\\d|9[0-35-9])\\d{8}$'
            ),
            message: '违规手机号格式',
          }"
          field="phoneNumber"
        >
          <a-input v-model="createForm.phoneNumber" />
        </a-form-item>
        <a-form-item
          label="邮箱"
          :rules="{
            match: RegExp(
              '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$'
            ),
            message: '违规邮箱格式',
          }"
          field="email"
        >
          <a-input v-model="createForm.email" />
        </a-form-item>
        <a-form-item label="备注" field="remark">
          <a-input v-model="createForm.remark" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-drawer
      v-model:visible="view.detailVisible"
      :width="350"
      title="部门详情"
    >
      <a-form auto-label-width>
        <a-form-item label="部门名称">
          <a-input v-model="depDetailModel.depName"></a-input>
        </a-form-item>
        <a-form-item label="部门负责人">
          <EmployeeSelect v-model="depDetailModel.leaderIds" />
        </a-form-item>
        <a-form-item label="部门手机号">
          <a-input>{{ depDetailModel.phoneNumber }}</a-input>
        </a-form-item>
        <a-form-item label="部门邮箱">
          <a-input>{{ depDetailModel.email }}</a-input>
        </a-form-item>
        <a-form-item label="备注">
          <a-input>{{ depDetailModel.remark }}</a-input>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import {
    createDepartment,
    CreateDepartmentRequest,
    deleteDepartment,
    DepartmentNode,
    getDepartmentTree,
    GetDepartmentTreeReply,
    UpdateDepartmentRequest,
  } from '@/api/department';
  import { Employee, listEmployees } from '@/api/employee';
  import { Message } from '@arco-design/web-vue';
  import EmployeeSelect from '@/views/admin/employee/components/employee-select.vue';
  import { SimpleEmployee } from '@/api/base';

  const depPage = ref({} as GetDepartmentTreeReply);

  const depData = computed(() => {
    if (depPage.value.depTree === undefined) {
      return [] as DepartmentNode[];
    }
    return [depPage.value.depTree];
  });

  const createForm = ref({} as CreateDepartmentRequest);
  const createFormRef = ref();

  const view = reactive({
    tableLoading: false,
    createVisible: false,
    detailVisible: false,
  });

  const options = reactive({
    userOptions: [] as Employee[],
  });

  const depDetailModel = ref({} as UpdateDepartmentRequest);

  function fetchDepTree() {
    view.tableLoading = true;
    getDepartmentTree(1)
      .then((res) => {
        depPage.value = res.data;
      })
      .finally(() => {
        view.tableLoading = false;
      });
  }

  const search = (input: string) => {
    listEmployees({ likeName: input }).then((res) => {
      options.userOptions = res.data.list;
    });
  };

  const createOnClick = async () => {
    const err = await createFormRef.value.validate();
    if (err !== undefined) {
      Message.warning('请按提示完成填写');
      return false;
    }
    createDepartment(createForm.value).then(() => {
      Message.success('创建成功');
      fetchDepTree();
      view.createVisible = false;
      return true;
    });
    return false;
  };

  function deleteDep(id: number) {
    deleteDepartment(id).then((res) => {
      Message.success('删除成功');
      fetchDepTree();
    });
  }

  onMounted(() => {
    fetchDepTree();
    search('');
  });
</script>

<script lang="ts">
  export default {
    name: 'DepartmentList',
  };
</script>

<style scoped></style>
