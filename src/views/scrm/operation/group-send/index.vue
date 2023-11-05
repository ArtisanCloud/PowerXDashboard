<template>
  <div class="container">
    <a-card>
      <a-space>
        <a-button type="primary" @click="state.createGroupSendVisible = true">
          新建群发
        </a-button>
      </a-space>
    </a-card>
    <br />
    <group-send-table />
    <a-modal
      v-model:visible="state.createGroupSendVisible"
      title="新建群发"
      width="800px"
      destroy-on-close
    >
      <create-group-send-form
        @submit-success="state.createGroupSendVisible = false"
      />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import GroupSendTable from '@/views/scrm/operation/group-send/components/group-send-table.vue';
  import { reactive } from 'vue';
  import CreateGroupSendForm from '@/views/scrm/operation/group-send/components/create-group-send-form.vue';

  const state = reactive({
    createGroupSendVisible: false,
  });
</script>

<style scoped></style>
