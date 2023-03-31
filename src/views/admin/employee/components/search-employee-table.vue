<template>
  <a-card style="width: calc(100% - 258px); margin-left: 8px">
    <a-form class="inline-query-form" layout="inline">
      <a-form-item label="用户名">
        <a-input v-model="queryForm.employee.likeName" @change="queryChange" />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-model="queryForm.employee.likeEmail" @change="queryChange" />
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
      :data="pageData.list"
      :loading="state.tableLoading"
      column-resizable
      scrollbar
    >
      <template #columns>
        <a-table-column title="姓名" :width="100">
          <template #cell="{ record }">
            <a-link @click="gotoEmployeeDetail(record.id)"
              >{{ record.name }}
            </a-link>
          </template>
        </a-table-column>
        <a-table-column title="性别" :width="75">
          <template #cell="{ record }">
            <span>{{ getGenderLabel(record.gender) }}</span>
          </template>
        </a-table-column>
        <a-table-column title="邮箱" data-index="email" :width="175" ellipsis />
        <a-table-column title="手机" data-index="mobilePhone" :width="150" />
        <a-table-column title="状态" data-index="mobilePhone" :width="150">
          <template #cell="{ record }">
            <a-switch
              :model-value="record.isEnabled"
              @change="
                (v) => {
                  changeEmployeeStatus(record.id, v);
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
                >编辑
              </a-link>
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
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import {
    deleteEmployee,
    GetEmployeeOptionsReply,
    listEmployees,
    ListEmployeesReply,
    ListEmployeesRequest,
    updateEmployee,
  } from '@/api/employee';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const { t } = useI18n();
  const router = useRouter();

  const option = reactive({} as GetEmployeeOptionsReply);

  const queryForm = reactive({
    employee: {
      likeName: '',
      likeEmail: '',
      positions: [] as string[],
      likePhoneNumber: '',
      roleCodes: [] as string[],
      isEnable: undefined as undefined | boolean,
      depIds: [],
    } as ListEmployeesRequest,
  });

  const state = reactive({
    tableLoading: false,
    deleteEmployeeLoading: false,
  });

  const pageData = ref({} as ListEmployeesReply);

  const queryChange = () => {
    if (state.tableLoading) {
      return;
    }
    state.tableLoading = true;
    listEmployees(queryForm.employee)
      .then((res) => {
        pageData.value = res.data;
      })
      .finally(() => {
        state.tableLoading = false;
      });
  };

  // --- other code ---

  function getGenderLabel(gender: string): string {
    if (gender === 'male') {
      return t('employee.genderUnKnown');
    }
    if (gender === 'female') {
      return t('employee.genderMale');
    }
    if (gender === 'un_know') {
      return t('employee.genderFemale');
    }
    return '';
  }

  function gotoEmployeeDetail(id: number) {
    router.push(`/employee/detail/${id}`);
  }

  function changeEmployeeStatus(id: number, value: boolean) {
    const status = value ? 'enabled' : 'disabled';
    updateEmployee({ id, status })
      .then((res) => {
        pageData.value.list.forEach((item) => {
          if (item.id === id) {
            item.isEnabled = res.data.isEnabled;
          }
        });
      })
      .finally(() => {
        state.tableLoading = false;
      });
  }

  const deleteEmployeeById = (id: number) => {
    if (state.deleteEmployeeLoading) {
      return;
    }
    state.deleteEmployeeLoading = true;
    deleteEmployee({ id })
      .then((res) => {
        queryChange();
      })
      .finally(() => {
        state.deleteEmployeeLoading = false;
      });
  };
</script>

<style scoped></style>