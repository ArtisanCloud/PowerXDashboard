<template>
  <div class="container">
    <a-card>
      <a-form :model="data" label-align="left">
        <a-row>
          <a-col flex="120px">
            <a-avatar :size="80" shape="square" />
          </a-col>
          <a-col flex="1">
            <h2>{{ data.name }}</h2>
            <a-form-item label="用户名">
              <span>{{ data.name }}</span>
            </a-form-item>
            <a-form-item label="邮箱地址">
              <span>{{ data.email }}</span>
            </a-form-item>
            <a-form-item label="职位">
              <span>
                {{ data.position.name }} (LEVEL{{ data.position.level }})
              </span>
            </a-form-item>
            <a-form-item label="角色"> TODO </a-form-item>
            <a-form-item label="部门"> TODO </a-form-item>
            <a-form-item label="职称">
              <span>{{ data.jobTitle }}</span>
            </a-form-item>
          </a-col>
          <a-col flex="1">
            <a-form-item label="个人描述">
              <span>{{ data.desc }}</span>
            </a-form-item>
            <a-form-item label="昵称">
              <span>{{ data.nickName }}</span>
            </a-form-item>
            <a-form-item label="手机号">
              <span>{{ data.mobilePhone }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider />
      <a-space fill size="large">
        <a-button type="primary" @click="editOnClick">编辑</a-button>
        <a-popconfirm content="确定要删除吗" @ok="deleteOnClick">
          <a-button type="primary" status="danger">删除</a-button>
        </a-popconfirm>
        <a-button type="primary">激活用户</a-button>
        <a-button type="primary" status="warning" @click="resetPwd"
          >重设密码</a-button
        >
        <div>
          <a-switch :model-value="data.isEnabled" @change="enableChange" />
          <span>启用</span>
        </div>
      </a-space>
      <a-drawer
        v-model:visible="state.updateEmployeeVisible"
        width="500px"
        :footer="false"
      >
        <EditEmployee v-if="data.id !== undefined" :id="data.id" />
      </a-drawer>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    deleteEmployee,
    Employee,
    getEmployee,
    resetPassword,
    updateEmployee,
  } from '@/api/employee';
  import { useRoute, useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import EditEmployee from '@/views/admin/employee/components/edit-employee.vue';

  const route = useRoute();
  const router = useRouter();

  const userId = parseInt(route.params.id as string, 10);

  const data = ref({} as Employee);

  const state = reactive({
    updateEmployeeVisible: false,
  });

  const editOnClick = () => {
    state.updateEmployeeVisible = true;
  };

  const deleteOnClick = () => {
    deleteEmployee({ id: data.value.id }).then((res) => {
      Message.success('删除成功');
      router.push('/admin/employee/list');
    });
  };

  const resetPwd = () => {
    resetPassword(data.value.id).then((res) => {
      Message.success('重置成功');
    });
  };

  const enableChange = (value: any) => {
    if (value !== data.value.isEnabled) {
      updateEmployee({
        id: data.value.id,
        status: value ? 'enabled' : 'disabled',
      }).then((res) => {
        data.value.isEnabled = value;
      });
    }
  };

  function fetchData() {
    getEmployee({ id: userId }).then((res) => {
      data.value = res.data;
    });
  }

  onMounted(() => {
    fetchData();
  });
</script>

<script lang="ts">
  export default {
    name: 'EmployeeDetail',
  };
</script>

<style scoped></style>
