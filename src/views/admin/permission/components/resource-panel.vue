<template>
  <div>
    <a-card>
      <a-space>
        <a-switch v-model="statuses.isDev">
          <template #checked> Dev </template>
          <template #unchecked> Normal </template>
        </a-switch>
      </a-space>
    </a-card>
    <div style="height: 8px" />
    <a-card>
      <a-table :data="resData.list" :expandable="expand" row-key="resCode">
        <template #columns>
          <a-table-column title="Code" data-index="resCode" />
          <a-table-column title="资源名称" data-index="resName" />
          <a-table-column title="类型" data-index="type" />
          <a-table-column title="描述" data-index="desc" />
        </template>
        <template #expand-row="{ record }">
          <a-space>
            <span style="font-size: 12px">资源操作: </span>
            <div v-for="(act, index) in record.acts" :key="index">
              <a-tag color="arcoblue">
                <span v-if="statuses.isDev"
                  >{{ act.action }} ({{ act.version + act.restPath }}) :
                </span>
                <span> {{ act.desc }}</span>
              </a-tag>
            </div>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { listRecourses, ListRecoursesReply } from '@/api/permission';
  import { TableExpandable } from '@arco-design/web-vue';

  const resData = ref({} as ListRecoursesReply);

  const expand = reactive({
    title: 'Action',
    width: 75,
  } as TableExpandable);

  const statuses = reactive({
    isDev: false,
  });

  function fetchRes() {
    listRecourses().then((res) => {
      resData.value = res.data;
    });
  }

  onMounted(() => {
    fetchRes();
  });
</script>

<style scoped></style>
