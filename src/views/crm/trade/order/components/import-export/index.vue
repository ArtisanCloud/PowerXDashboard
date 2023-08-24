<template>
  <a-space
    size="large"
    style="display: flex; justify-content: flex-end; padding-right: 80px"
  >
    <a-button
      type="primary"
      tooltip="通过查询结果，下载订单"
      :disabled="filterIsEmpty()"
      @click="downloadOrders"
      >下载订单
    </a-button>
    <div>
      <a-upload
        ref="uploadRef"
        action="/api/v1/admin/trade/orders/import"
        limit="1"
        @change="onChange"
      >
        <template #upload-button>
          <a-space>
            <a-button type="primary">导入订单 </a-button>
          </a-space>
        </template>
      </a-upload>
    </div>
  </a-space>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ExportOrders, ListOrderPageRequest } from '@/api/crm/trade/order';
  import { Message } from '@arco-design/web-vue';

  const uploadRef = ref();
  const files = ref([]);

  const formSearch = ref({} as ListOrderPageRequest);

  const filterIsEmpty = () => {
    return Object.keys(formSearch.value).length === 0;
  };

  const downloadOrders = async () => {
    if (!filterIsEmpty()) {
      const res = await ExportOrders(formSearch.value);

      const { headers } = res;
      // console.log(res.data);
      // console.log(headers);

      // 创建 Blob 对象并触发下载
      const blob = new Blob([res.data], {
        type: headers['content-type'],
      });
      const fileName = `${formSearch.value.startAt}_${formSearch.value.endAt}.csv`;

      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName; // 设置下载的文件名
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      Message.warning('请先选择筛选条件');
    }
  };
  const importOrders = () => {
    console.log('import orders');
  };

  const setFilters = (req: ListOrderPageRequest) => {
    formSearch.value = req;
  };

  defineExpose({ setFilters });
</script>

<style scoped></style>
