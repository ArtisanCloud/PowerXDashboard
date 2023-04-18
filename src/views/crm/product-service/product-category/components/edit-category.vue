<template>
  <div>
    <a-form ref="formRef" :model="formModel" :rules="rules" @submit="onSubmit">
      <a-form-item label="产品品类名称" field="depName">
        <a-input v-model="formModel.depName" />
      </a-form-item>
      <a-form-item label="上级品类" field="leaderId">
        <a-select
          v-model="formModel.leaderId"
          :options="option.leaderOptions"
          :field-names="{ label: 'name', value: 'id' }"
        />
      </a-form-item>
      <a-form-item label="父产品品类" field="pId">
        <a-select
          v-model="formModel.pId"
          :options="option.parentOptions"
          :field-names="{ label: 'name', value: 'id' }"
        />
      </a-form-item>
      <a-form-item label="描述" field="desc">
        <a-input v-model="formModel.desc" />
      </a-form-item>
      <a-form-item label="电话号码" field="phoneNumber">
        <a-input v-model="formModel.phoneNumber" />
      </a-form-item>
      <a-form-item label="邮箱" field="email">
        <a-input v-model="formModel.email" />
      </a-form-item>
      <a-form-item label="备注" field="remark">
        <a-input v-model="formModel.remark" />
      </a-form-item>
      <a-form-item>
        <a-space size="large">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="$refs.formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import { createCategory, CreateCategoryRequest } from '@/api/crm/product-service/category';
  import {
    getEmployeeOptions,
  } from '@/api/common';

  const prop = defineProps({
    id: {
      type: Number,
      default: 1,
    },
  });

  const emit = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const parentId = computed({
    get() {
      return prop.id;
    },
    set(val) {
      emit('update:id', val);
    },
  });

  const formRef = ref();
  const formModel = ref({
    name: '',
    pId: parentId.value,
    sort: 0,
    viceName: '',
    description: '',
    icon: '',
    backgroundColor: '',
    imageURL: '',

  } as CreateCategoryRequest);

  const rules = {
    depName: [
      { required: true, message: '请输入产品品类名称' },
      { max: 50, message: '产品品类名称长度不能超过 50 个字符' },
    ],
    leaderId: [{ required: true, message: '请选择产品品类负责人' }],
    pId: [{ required: true, message: '请选择父产品品类' }],
    desc: [{ max: 100, message: '描述长度不能超过 100 个字符' }],
    phoneNumber: [
      {
        match: /^1[3-9]\d{9}$/,
        message: '请输入正确的手机号',
      },
    ],
    email: [{ type: 'email', message: '请输入正确的邮箱格式' }],
    remark: [{ max: 100, message: '备注长度不能超过 100 个字符' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({ submitLoading: false });

  const option = reactive({
    // leaderOptions: [] as Array<EmployeeOption>,
    // parentOptions: [] as Array<CategoryOption>,
  });

  function fetchLeaderOptions(likeName = '') {
    return getEmployeeOptions({ likeName }).then((res) => {
      // option.leaderOptions = res.data.list;
    });
  }

  function fetchParentOptions({ id, likeName } = { id: 0, likeName: '' }) {
    // return getCategoryOptions({ ids: [id], likeName }).then((res) => {
    //   option.parentOptions = res.data.list;
    // });
  }

  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }
    const err = await formRef.value.validate();
    if (err) {
      return;
    }
    state.submitLoading = true;
    createCategory(formModel.value)
      .then(() => {
        Message.success('创建成功');
        emit('submitSuccess');
      })
      .catch(() => {
        emit('submitFailed');
      })
      .finally(() => {
        state.submitLoading = false;
      });
  };

  onMounted(() => {
    fetchLeaderOptions();
    fetchParentOptions({ id: parentId.value, likeName: '' });
  });
</script>
