<template>
  <a-card>
    <a-form class="inline-query-form" layout="inline" :model="queryForm">
      <a-form-item label="用户名">
        <a-input v-model="queryForm.likeName" @change="queryChange" />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-model="queryForm.likeEmail" @change="queryChange" />
      </a-form-item>
      <a-form-item label="手机号码">
        <a-input v-model="queryForm.likePhoneNumber" @change="queryChange" />
      </a-form-item>
      <a-form-item label="职位">
        <a-select
          v-model="queryForm.positionIds"
          :options="option.positions"
          multiple
          allow-clear
          @change="queryChange"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="角色">
        <a-select
          v-model="queryForm.roleCodes"
          :options="option.roles"
          :field-names="{ label: 'roleName', value: 'roleCode' }"
          multiple
          allow-clear
          @change="queryChange"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="状态">
        <a-select
          v-model="queryForm.isEnable"
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
        <a-table-column title="状态" :width="150">
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
              <a-link @click="openEditEmployeeModal(record.id)">编辑 </a-link>
              <a-popconfirm content="确定要强退用户吗?">
                <a-link disabled>强退</a-link>
              </a-popconfirm>
              <a-popconfirm
                content="确定要删除用户吗?"
                :ok-loading="state.deleteEmployeeLoading"
                @ok="deleteEmployeeById(record.id)"
              >
                <a-link status="danger">删除</a-link>
              </a-popconfirm>
            </a-space>
            <a-drawer
              v-if="
                state.editEmployee.visible &&
                state.editEmployee.employeeId === record.id
              "
              v-model:visible="state.editEmployee.visible"
              title="编辑员工"
              width="500px"
            >
              <EditEmployee
                :id="state.editEmployee.employeeId"
                @submit-success="queryChange()"
              />
            </a-drawer>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import {
    deleteEmployee,
    listEmployees,
    ListEmployeesReply,
    ListEmployeesRequest,
    updateEmployee,
  } from '@/api/employee';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import EditEmployee from '@/views/admin/employee/components/edit-employee.vue';
  import { getEmployeeQueryOptions, getOptions } from '@/api/common';

  const { t } = useI18n();
  const router = useRouter();

  const option = ref({} as any);

  const props = defineProps({
    depIds: {
      type: Array as () => number[],
      default: [] as number[],
    },
  });

  const emit = defineEmits(['update:depIds']);

  const depIds = computed({
    get() {
      return props.depIds;
    },
    set(v) {
      emit('update:depIds', v);
    },
  });

  const queryForm = reactive({
    likeName: '',
    likeEmail: '',
    positionIds: [],
    likePhoneNumber: '',
    roleCodes: [] as string[],
    isEnable: undefined as undefined | boolean,
    depIds: [],
  } as ListEmployeesRequest);

  const state = reactive({
    tableLoading: false,
    deleteEmployeeLoading: false,
    editEmployee: {
      visible: false,
      loading: false,
      employeeId: 0,
    },
  });

  const pageData = ref({} as ListEmployeesReply);

  function fetchOption() {
    getEmployeeQueryOptions().then((res) => {
      option.value.roles = res.data.roles;
      option.value.departments = res.data.departments;
    });
    getOptions({ type: 'position' }).then((res) => {
      option.value.positions = res.data.options;
    });
  }

  const queryChange = () => {
    if (state.tableLoading) {
      return;
    }
    state.tableLoading = true;
    listEmployees(queryForm)
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
    router.push(`/admin/employee/detail/${id}`);
  }

  function changeEmployeeStatus(id: number, value: any) {
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

  function openEditEmployeeModal(id: number) {
    state.editEmployee.employeeId = id;
    state.editEmployee.visible = true;
  }

  watch(depIds, () => {
    queryForm.depIds = depIds.value;
    queryChange();
  });

  onMounted(() => {
    fetchOption();
    queryChange();
  });

  defineExpose({
    refresh: queryChange,
  });
</script>

<style scoped></style>
