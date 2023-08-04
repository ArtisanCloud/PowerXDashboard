<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="标签组名称" field="groupId">
        <a-input
          v-model="formModel.groupName"
          max-length="50"
          placeholder="请输入标签组名称"
        />
      </a-form-item>
      <a-form-item label="标签组排序" field="groupId">
        <a-input-number
          v-model="formModel.sort"
          max-length="50"
          placeholder="请输入标签组名称"
        />
      </a-form-item>
      <a-form-item>
        <a-space size="large">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="handlereset">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import { addTag, AddTagRequest, groupOption, TagList } from '@/api/scrm/tag';

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);
  const formRef = ref();
  interface GroupOption {
    groupId: string;
    groupName: string;
  }
  const groupOptionList = ref([] as GroupOption[]);
  const tagList = ref([] as TagList[]);
  const formModel = ref({
    groupId: '',
    groupName: '',
    agentId: 0,
    sort: 0,
    tag: [
      {
        name: ' ',
        sort: 0,
      },
    ],
  } as AddTagRequest);

  const rules = {
    groupName: [{ required: true, message: '请选择标签组名称' }],
    sort: [{ required: true, message: '请输入排序' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({
    coverUrlList: [] as Array<any>,
    detailUrlList: [] as Array<any>,
    submitLoading: false,
  });

  const handlereset = () => {
    formRef.value.resetFields();
  };

  const onSubmit = async () => {
    const err = await formRef.value.validate();
    if (err) {
      return;
    }

    addTag({
      ...formModel.value,
    })
      .then(() => {
        handlereset();
        tagList.value = [];
        Message.success('标签新增成功');
        emits('submitSuccess');
      })
      .catch(() => {
        emits('submitFailed');
      })
      .finally(() => {
        state.submitLoading = false;
      });
  };

  async function fetchGroupOption() {
    const res = await groupOption();
    try {
      groupOptionList.value = res.data.list;
    } catch (err) {
      groupOptionList.value = [];
    }
  }

  onMounted(() => {
    fetchGroupOption();
  });
</script>

<style lang="less" scoped>
  .close {
    cursor: pointer;
    padding: 0 0 0 6px;
  }
</style>
