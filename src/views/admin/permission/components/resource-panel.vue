<template>
  <div>
    <!--    <a-card>-->
    <!--      <a-space>-->
    <!--        <a-button type="primary">创建资源</a-button>-->
    <!--      </a-space>-->
    <!--    </a-card>-->
    <!--    <div style="height: 8px" />-->
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
                <span>{{ act.action }} : </span>
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
