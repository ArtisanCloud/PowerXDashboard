<template>
  <div>
    <a-card>
      <a-form
        ref="form"
        :model="formModel"
        layout="inline"
        @submit="onSearch()"
      >
        <a-form-item label="群发类型" name="chatType">
          <a-select
            v-model="formModel.chatType"
            :options="option.chatTypeOptions"
          />
        </a-form-item>
        <a-form-item label="开始时间" name="startTime">
          <a-date-picker v-model="formModel.startTime" />
        </a-form-item>
        <a-form-item label="结束时间" name="endTime">
          <a-date-picker v-model="formModel.endTime" />
        </a-form-item>
        <a-form-item>
          <a-space size="large">
            <a-button type="primary" html-type="submit">搜索</a-button>
            <a-button @click="(form as any).resetFields()">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
      <a-table :data="tableData" style="margin-top: 24px">
        <template #columns>
          <a-table-column title="消息ID" data-index="messageId" />
          <a-table-column title="消息类型" data-index="messageType" />
          <a-table-column title="消息内容" data-index="messageContent" />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { listGroupSendLog } from '@/api/scrm/operation/group-send';

  const form = ref();
  const formModel = reactive({
    chatType: '',
    startTime: undefined,
    endTime: undefined,
  });

  const option = reactive({
    chatTypeOptions: [
      { label: '客户', value: 'single' },
      { label: '客户群', value: 'group' },
    ],
  });

  const tableData = ref([] as any);
  const tableMetadata = reactive({
    cursorList: [] as any,
    currentCursor: undefined,
    nextCursor: undefined,
  } as any);

  function fetchTableData(req: any) {
    listGroupSendLog(req).then((res) => {
      tableData.value = res.data.sendList;
      if (res.data.nextCursor) {
        tableMetadata.nextCursor = res.data.nextCursor;
      }
    });
  }

  function getFormParams() {
    const params = {
      chatType: formModel.chatType,
    } as any;
    if (formModel.startTime) {
      params.startTime = formModel.startTime;
    }
    if (formModel.endTime) {
      params.endTime = formModel.endTime;
    }
    return params;
  }

  const onSearch = () => {
    form.value.validate().then(() => {
      fetchTableData(getFormParams());
    });
  };

  // 翻页方法
  const onPaginationChange = () => {
    const params = getFormParams();
    params.cursor = tableMetadata.nextCursor;
    tableMetadata.cursorList.push(tableMetadata.nextCursor);
    fetchTableData(params);
    tableMetadata.currentCursor = tableMetadata.nextCursor;
  };
</script>

<style scoped>
  a-form-item {
    margin-bottom: 16px;
  }
</style>
