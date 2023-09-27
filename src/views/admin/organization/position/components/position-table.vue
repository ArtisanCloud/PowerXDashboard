<template>
  <div class="content">
    <a-table
      :data="positionList"
      :loading="state.loading"
      row-key="id"
      :columns="columns"
      column-resizable
      :bordered="{ cell: true }"
    >
      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑职位按钮-->
          <a-button @click="openEditPosition(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--删除职位按钮-->
          <a-popconfirm
            content="确定要删除此职位吗？"
            @ok="deletePositionById(record.id)"
          >
            <a-button>
              <template #icon>
                <icon-delete :style="{ fontSize: '16px', color: 'red' }" />
              </template>
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <a-drawer
      v-model:visible="state.editPosition.visible"
      width="800px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditPosition
        v-if="state.editPosition.visible"
        :position-id="state.editPosition.positionId"
        @submit-success="fetchPositionList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { listPositions, deletePosition, Position } from '@/api/position';
  import EditPosition from '@/views/admin/organization/position/components/edit-position.vue';
  import { Message } from '@arco-design/web-vue';

  const positionList = ref<Position[]>([]);

  const columns = reactive([
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '职位名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'desc',
      width: 200,
    },
    {
      title: '级别',
      dataIndex: 'level',
      width: 120,
    },
    {
      title: '操作',
      slotName: 'optional',
    },
  ]);

  const state = reactive({
    loading: false,
    editPosition: {
      visible: false,
      positionId: 0,
    },
  });

  const fetchPositionList = async () => {
    state.loading = true;
    try {
      const res = await listPositions({});
      positionList.value = res.data.list;
    } finally {
      state.loading = false;
    }
  };

  const openEditPosition = (position: Position) => {
    state.editPosition.positionId = position.id;
    state.editPosition.visible = true;
  };

  const deletePositionById = async (positionId: number) => {
    try {
      const rep = await deletePosition({ id: positionId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('删除成功');
        await fetchPositionList();
      }
    } catch (error) {
      // console.error(error);
    }
  };

  defineExpose({ fetchPositionList });

  onMounted(() => {
    fetchPositionList();
  });
</script>

<style scoped></style>
