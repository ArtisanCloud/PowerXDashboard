<script setup lang="ts">
  import useWeComUserStore from '@/store/modules/scrm/wecom/user';
  import { reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import {
    createWeComDepartment,
    CreateWeComDepartmentRequest,
  } from '@/api/scrm/wecom/department';
  import useLoadingStore from '@/store/modules/loading';
  import styles from './index.module.less';

  const useWeComUser = useWeComUserStore();
  const loadingStore = useLoadingStore();

  const formRef = ref();
  const form = reactive<{
    name: string;
    departmentId: number | null;
  }>({
    name: '',
    departmentId: null,
  });

  const resetForm = () => {
    form.name = '';
    form.departmentId = null;
  };

  const handleBeforeOk = async (done: any) => {
    const err = await formRef.value.validate();
    if (err !== undefined) {
      Message.warning({
        content: '请检查表单输入',
        duration: 5000,
      });
      done(false);
      return;
    }

    loadingStore.setLoading(true);
    try {
      await createWeComDepartment({
        name: form.name,
        weComParentId: form.departmentId,
        // order: 99990000,
      } as CreateWeComDepartmentRequest);
      useWeComUser.setSelectedDepartment(1);
      Message.success(`${form.name} 部门已经创建成功`);
      done(true);
    } catch (e: any) {
      Message.error(e.message);
      done(false);
    } finally {
      loadingStore.setLoading(false);
    }
  };
  const handleCancel = () => {
    useWeComUser.showCreateDepartmentModal = false;
  };

  const handleDepartmentChange = (val: number) => {
    form.departmentId = val;
    formRef.value?.validateField?.('departmentId'); // 手动触发该字段的校验
  };

  const rules = {
    name: [
      {
        required: true,
        message: '部门名称是必填的',
      },
    ],
    departmentId: [{ required: true, message: '请选择所属部门' }],
  };

  defineExpose({
    resetForm,
  });
</script>

<template>
  <div :class="styles.container">
    <a-modal
      v-model:visible="useWeComUser.showCreateDepartmentModal"
      title="新建部门"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="formRef" :rules="rules" :model="form">
        <a-form-item field="name" label="部门名称" validate-trigger="blur">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item
          field="departmentId"
          label="所属部门"
          validate-trigger="blur"
        >
          <a-tree-select
            v-model="form.departmentId"
            :data="useWeComUser.departmentTree"
            placeholder="选择所属部门"
            :field-names="{
              key: 'weComDepId',
              title: 'name',
              children: 'children',
            }"
            style="width: 300px"
            @change="handleDepartmentChange"
          ></a-tree-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped></style>
