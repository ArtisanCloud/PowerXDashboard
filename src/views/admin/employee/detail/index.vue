<template>
  <div class="container">
    <a-card>
      <a-form :model="userModel" label-align="left">
        <a-row>
          <a-col flex="120px">
            <a-avatar :size="80" shape="square" />
          </a-col>
          <a-col flex="1">
            <h2>{{ userModel.name }}</h2>
            <a-form-item label="用户名">
              <span>{{ userModel.name }}</span>
            </a-form-item>
            <a-form-item label="邮箱地址">
              <span>{{ userModel.email }}</span>
            </a-form-item>
            <a-form-item label="职位">
              <span>{{ userModel.position }}</span>
            </a-form-item>
            <a-form-item label="角色"> TODO </a-form-item>
            <a-form-item label="部门"> TODO </a-form-item>
            <a-form-item label="职称">
              <span>{{ userModel.jobTitle }}</span>
            </a-form-item>
          </a-col>
          <a-col flex="1">
            <a-form-item label="个人描述">
              <span>{{ userModel.desc }}</span>
            </a-form-item>
            <a-form-item label="昵称">
              <span>{{ userModel.nickName }}</span>
            </a-form-item>
            <a-form-item label="手机号">
              <span>{{ userModel.mobilePhone }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider />
      <a-space fill size="large">
        <a-button type="primary" @click="editOnClick">编辑</a-button>
        <a-popconfirm @ok="deleteOnClick">
          <a-button type="primary" status="danger">删除</a-button>
        </a-popconfirm>
        <a-button type="primary">激活用户</a-button>
        <a-button type="primary" status="warning" @click="resetPwd"
          >重设密码</a-button
        >
        <div>
          <a-switch :model-value="userModel.isEnabled" @change="enableChange" />
          <span>启用</span>
        </div>
      </a-space>
    </a-card>
    <EditEmployeeModal
      v-model:visible="view.updateEmployeeVisible"
      :employee="userModel"
      @refresh="
        () => {
          fetchData();
        }
      "
    />
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
  import EditEmployeeModal from '@/views/admin/employee/components/edit-employee-modal.vue';

  const route = useRoute();
  const router = useRouter();

  const userId = parseInt(route.params.id as string, 10);

  const userModel = ref({} as Employee);

  const view = reactive({
    updateEmployeeVisible: false,
  });

  const editOnClick = () => {
    view.updateEmployeeVisible = true;
  };

  const deleteOnClick = () => {
    deleteEmployee(userModel.value.id).then((res) => {
      Message.success('删除成功');
      router.push('/admin/employee/list');
    });
  };

  const resetPwd = () => {
    resetPassword({ userId: userModel.value.id }).then((res) => {
      Message.success('重置成功');
    });
  };

  const enableChange = (value: boolean) => {
    if (value !== userModel.value.isEnabled) {
      updateEmployee({ status: +value }, userModel.value.id).then((res) => {
        userModel.value.isEnabled = value;
      });
    }
  };

  function fetchData() {
    getEmployee(userId).then((res) => {
      userModel.value = res.data;
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
