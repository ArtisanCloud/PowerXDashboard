<template>
  <div class="create-employee">
    <a-form ref="formRef" :model="formModel" :rules="rules" @submit="onSubmit">
      <a-form-item label="账号" prop="account">
        <a-input v-model="formModel.account" />
      </a-form-item>
      <a-form-item label="姓名" prop="name">
        <a-input v-model="formModel.name" />
      </a-form-item>
      <a-form-item label="昵称" prop="nickName">
        <a-input v-model="formModel.nickName" />
      </a-form-item>
      <a-form-item label="描述" prop="desc">
        <a-input v-model="formModel.desc" />
      </a-form-item>
      <a-form-item label="邮箱" prop="email">
        <a-input v-model="formModel.email" />
      </a-form-item>
      <a-form-item label="头像" prop="avatar">
        <a-input v-model="formModel.avatar" />
      </a-form-item>
      <a-form-item label="外部邮箱" prop="externalEmail">
        <a-input v-model="formModel.externalEmail" />
      </a-form-item>
      <a-form-item label="手机号" prop="mobilePhone">
        <a-input v-model="formModel.mobilePhone" />
      </a-form-item>
      <a-form-item label="性别" prop="gender">
        <a-radio-group v-model="formModel.gender">
          <a-radio value="male">男</a-radio>
          <a-radio value="female">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="部门 ID" prop="depId">
        <a-input-number v-model="formModel.depId" />
      </a-form-item>
      <a-form-item label="职位" prop="position">
        <a-input v-model="formModel.position" />
      </a-form-item>
      <a-form-item label="职称" prop="jobTitle">
        <a-input v-model="formModel.jobTitle" />
      </a-form-item>
      <a-form-item label="密码" prop="password">
        <a-input v-model="formModel.password" type="password" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { createEmployee } from '@/api/employee';

  const formRef = ref();
  const formModel = ref({
    account: '',
    name: '',
    nickName: '',
    desc: '',
    email: '',
    avatar: '',
    externalEmail: '',
    mobilePhone: '',
    gender: '',
    depId: 0,
    position: '',
    jobTitle: '',
    password: '',
  });

  const rules = {
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      {
        min: 4,
        max: 20,
        message: '账号长度应在 4 到 20 个字符之间',
        trigger: 'blur',
      },
    ],
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      {
        min: 2,
        max: 20,
        message: '姓名长度应在 2 到 20 个字符之间',
        trigger: 'blur',
      },
    ],
    nickName: [
      { max: 20, message: '昵称长度不能超过 20 个字符', trigger: 'blur' },
    ],
    desc: [
      { max: 100, message: '描述长度不能超过 100 个字符', trigger: 'blur' },
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
    externalEmail: [
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
    mobilePhone: [
      {
        pattern: /^1[3-9]\d{9}$/,
        message: '请输入正确的手机号',
        trigger: 'blur',
      },
    ],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    depId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
    position: [
      { max: 50, message: '职位长度不能超过 50 个字符', trigger: 'blur' },
    ],
    jobTitle: [
      { max: 50, message: '职称长度不能超过 50 个字符', trigger: 'blur' },
    ],
    password: [
      {
        min: 6,
        max: 20,
        message: '密码长度应在 6 到 20 个字符之间',
        trigger: 'blur',
      },
    ],
  };
  const onSubmit = async () => {
    const err = await formRef.value.validate();
    if (err != null) {
      Message.warning({
        content: '请检查表单输入',
        duration: 5,
      });
      return;
    }

    createEmployee(formModel.value)
      .then((res) => {
        Message.success({
          content: '提交成功',
          duration: 5,
        });
      })
      .catch((error) => {
        Message.error({
          content: `提交失败: ${error.message}`,
          duration: 5,
        });
      });
  };
</script>
