<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="view.createEmployeeVisible = true"
          >创建新员工
        </a-button>
      </a-space>
    </a-card>
    <div style="height: 8px" />
    <div style="display: -webkit-box">
      <a-card style="width: 250px; overflow: auto">
        <a-tree
          v-if="options.depTree.length > 0"
          :block-node="true"
          :data="options.depTree"
          :show-line="true"
          :field-names="{
            title: 'depName',
            key: 'id',
            children: 'children',
          }"
          checked-strategy="child"
          multiple
          @select="
            (v) => {
              queryForm.employee.depIds = v;
              queryChange();
            }
          "
        >
          <template #extra="nodeData">
            <a-dropdown position="bl">
              <a-link type="text">···</a-link>
              <template #content>
                <a-doption @click="clickAddDep(nodeData)"
                  >添加子部门
                </a-doption>
              </template>
            </a-dropdown>
          </template>
        </a-tree>
      </a-card>
      <a-card style="width: calc(100% - 258px); margin-left: 8px">
        <a-form class="inline-query-form" layout="inline">
          <a-form-item label="用户名">
            <a-input
              v-model="queryForm.employee.likeName"
              @change="queryChange"
            />
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input
              v-model="queryForm.employee.likeEmail"
              @change="queryChange"
            />
          </a-form-item>
          <a-form-item label="手机号码">
            <a-input
              v-model="queryForm.employee.likePhoneNumber"
              @change="queryChange"
            />
          </a-form-item>
          <a-form-item label="职位">
            <a-select
              v-model="queryForm.employee.positions"
              :options="options.employee.positions"
              multiple
              allow-clear
              @change="queryChange"
            >
            </a-select>
          </a-form-item>
          <a-form-item label="角色">
            <a-select
              v-model="queryForm.employee.roleCodes"
              :options="options.employee.roles"
              :field-names="{ label: 'roleName', value: 'roleCode' }"
              multiple
              allow-clear
              @change="queryChange"
            >
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              v-model="queryForm.employee.isEnable"
              allow-clear
              @clear="
                () => {
                  queryForm.isEnable = undefined;
                }
              "
              @change="queryChange"
            >
              <a-option :value="0">未启用</a-option>
              <a-option :value="1">已启用</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <a-divider />
        <a-table
          :data="employeePage.list"
          :loading="view.fetchEmployeeLoading"
          column-resizable
          scrollbar
        >
          <template #columns>
            <a-table-column title="姓名" :width="100">
              <template #cell="{ record }">
                <a-link
                  @click="
                    () => {
                      goDetail(record.id);
                    }
                  "
                  >{{ record.name }}</a-link
                >
              </template>
            </a-table-column>
            <a-table-column title="性别" :width="75">
              <template #cell="{ record }">
                <span v-if="record.gender === 0">{{
                  $t('employee.genderUnKnown')
                }}</span>
                <span v-if="record.gender === 1">{{
                  $t('employee.genderMale')
                }}</span>
                <span v-if="record.gender === 2">{{
                  $t('employee.genderFemale')
                }}</span>
              </template>
            </a-table-column>
            <a-table-column
              title="邮箱"
              data-index="email"
              :width="175"
              ellipsis
            />
            <a-table-column
              title="手机"
              data-index="mobilePhone"
              :width="150"
            />
            <a-table-column title="状态" data-index="mobilePhone" :width="150">
              <template #cell="{ record }">
                <a-switch
                  :model-value="record.isEnabled"
                  @change="
                    (v) => {
                      enableChange(v, record);
                    }
                  "
                />
              </template>
            </a-table-column>
            <a-table-column
              title="创建日期"
              data-index="createdAt"
              :width="175"
              ellipsis
            />
            <a-table-column title="操作" :width="200">
              <template #cell="{ record }">
                <a-space>
                  <a-link
                    @click="
                      () => {
                        editEmployee(record);
                      }
                    "
                    >编辑</a-link
                  >
                  <a-popconfirm content="确定要强退用户吗?">
                    <a-link disabled>强退</a-link>
                  </a-popconfirm>
                  <a-popconfirm
                    content="确定要删除用户吗?"
                    :ok-loading="view.deleteEmployeeLoading"
                    @ok="
                      () => {
                        deleteEmployeeById(record.id);
                      }
                    "
                  >
                    <a-link status="danger">删除</a-link>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  // eslint-disable-next-line import/no-cycle
  import {
    deleteEmployee,
    getEmployeeOptions,
    GetEmployeeOptionsReply,
    listEmployees,
    ListEmployeesReply,
    ListEmployeesRequest,
    updateEmployee,
    UpdateEmployeeRequest,
  } from '@/api/employee';
  import { getDepartmentTree } from '@/api/department';
  import { Message } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const employeePage = ref({} as ListEmployeesReply);

  const view = reactive({
    createEmployeeVisible: false,
    updateEmployeeVisible: false,
    createDepVisible: false,
    fetchEmployeeLoading: false,
    deleteEmployeeLoading: false,
  });



  function fetchEmployees(req = {} as ListEmployeesRequest) {
    if (view.fetchEmployeeLoading) {
      return;
    }
    listEmployees(req)
      .then((res) => {
        employeePage.value = res.data;
      })
      .finally(() => {
        view.fetchEmployeeLoading = false;
      });
  }

  const queryChange = () => {
    fetchEmployees(queryForm.employee);
  };

  function fetchDepTree() {
    getDepartmentTree({ depId: 1 }).then((res) => {
      options.depTree = [res.data.depTree];
    });
  }

  function fetchOptions() {
    getEmployeeOptions().then((res) => {
      options.employee = res.data;
    });
  }

  const clickAddDep = (nodeData: any) => {
    values.PDepId = nodeData.id;
    view.createDepVisible = true;
  };

  const enableChange = (value: boolean, record: any) => {
    const status = value ? 'enabled' : 'disabled';
    if (value !== record.isEnabled) {
      updateEmployee({
        id: record.id,
        status,
      }).then((res) => {
        record.isEnabled = value;
      });
    }
  };

  function formatRoles(roles: string[] | null) {
    if (roles === null) {
      return '';
    }
    return roles.join(',');
  }

  function editEmployee(record: any) {
    values.updateEmployee = record;
    view.updateEmployeeVisible = true;
  }

  function deleteEmployeeById(id: number) {
    if (view.deleteEmployeeLoading) {
      Message.warning('请等待删除动作结束');
      return;
    }
    view.deleteEmployeeLoading = true;
    deleteEmployee({ id })
      .then(() => {
        Message.success('删除成功');
        fetchEmployees();
      })
      .finally(() => {
        view.deleteEmployeeLoading = false;
      });
  }

  function goDetail(userId: number) {
    router.push(`/admin/employee/${userId}/detail`);
  }

  onMounted(() => {
    fetchEmployees();
    fetchDepTree();
    fetchOptions();
  });
</script>

<script lang="ts">
  export default {
    name: 'EmployeeList',
  };
</script>

<style scoped></style>
