<script lang="ts" setup>
  import useWeComUserStore, { ViewType } from '@/store/modules/scrm/wecom/user';
  import { ref } from 'vue';
  import { pullSyncWeComDepartmentsAndUsers } from '@/api/scrm/wecom/user';
  import { Message } from '@arco-design/web-vue';
  import useLoadingStore from '@/store/modules/loading';
  import AddDepartment from '@/views/scrm/wecom/organization/user/components/add-department/index.vue';
  import DepartmentUserList from '@/views/scrm/wecom/organization/user/components/department-user-list/index.vue';
  import DepartmentTree from '@/views/scrm/wecom/organization/user/components/department-tree/index.vue';
  import TagList from '@/views/scrm/wecom/organization/user/components/tag-list/index.vue';
  import TagUserList from '@/views/scrm/wecom/organization/user/components/tag-user-list/index.vue';
  import {
    pullSyncWeComTagsAndUsers,
    WeComTagTypeTag,
  } from '@/api/scrm/wecom/tag/tag';
  import styles from './index.module.less';

  const useWeComUser = useWeComUserStore();
  const loadingStore = useLoadingStore();
  const addDepartmentRef = ref<InstanceType<typeof AddDepartment> | null>(null);

  const checkedViewType = ref('department');
  const handleDepartmentChange = (data: number) => {
    useWeComUser.setSelectedDepartment(data);
    // consola.log(data, useWeComUser.selectedDepartmentId);
    // queryChange();
  };

  const onSelectedViewType = (e: ViewType) => {
    // console.log(e);
    useWeComUser.setSelectedViewType(e);
  };

  const onAddDepartment = () => {
    addDepartmentRef.value?.resetForm();
    useWeComUser.showCreateDepartmentModal = true;
  };

  const onSyncWeComDepartments = async () => {
    loadingStore.setLoading(true);
    try {
      const res = await pullSyncWeComDepartmentsAndUsers({
        sync: 1,
      });
      if (res) {
        Message.success('同步成功');
        await useWeComUser.loadDepartmentTree(1);
        // await useWeComUser.loadUsersByDepartmentId(0);
      }
    } catch (err: any) {
      Message.error(err.message);
    } finally {
      loadingStore.setLoading(false);
    }
  };
  const onAddTag = () => {
    console.log('add tag');
  };
  const onSyncWeComTags = async () => {
    loadingStore.setLoading(true);
    try {
      const res = await pullSyncWeComTagsAndUsers({
        tagType: WeComTagTypeTag,
      });
      if (res) {
        Message.success('同步成功');
        await useWeComUser.loadTagList();
        // await useWeComUser.loadUsersByDepartmentId(0);
      }
    } catch (err: any) {
      Message.error(err.message);
    } finally {
      loadingStore.setLoading(false);
    }
  };
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.departmentList">
      <div class="flex flex-row justify-between px-2 gap-2 mb-2">
        <a-input-search
          size="mini"
          :style="{ fontSize: '6px' }"
          placeholder="搜索成员、部门、标签"
        />
        <a-dropdown position="br">
          <a-button size="mini"><icon-menu /></a-button>
          <template #content>
            <a-doption
              v-if="useWeComUser.selectedViewType === 'department'"
              @click="onAddDepartment"
              ><icon-plus /> 添加部门</a-doption
            >
            <a-doption
              v-if="useWeComUser.selectedViewType === 'department'"
              @click="onSyncWeComDepartments"
              ><icon-sync /> 从企微同步部门</a-doption
            >
            <a-doption
              v-if="useWeComUser.selectedViewType === 'tag'"
              @click="onAddTag"
              ><icon-plus /> 添加标签</a-doption
            >
            <a-doption
              v-if="useWeComUser.selectedViewType === 'tag'"
              @click="onSyncWeComTags"
              ><icon-sync /> 从企微同步员工标签</a-doption
            >
          </template>
        </a-dropdown>
      </div>
      <a-radio-group
        v-model="checkedViewType"
        type="button"
        class="flex justify-center w-full"
        size="mini"
        @change="onSelectedViewType"
      >
        <a-radio
          class="flex-1"
          style="text-align: center"
          value="department"
          default-checked
          >组织架构</a-radio
        >
        <a-radio class="flex-1" style="text-align: center" value="tag"
          >标签</a-radio
        >
      </a-radio-group>
      <a-divider :margin="8" />
      <DepartmentTree
        v-if="useWeComUser.selectedViewType === 'department'"
        @update:model-value="handleDepartmentChange"
      />
      <TagList v-if="useWeComUser.selectedViewType === 'tag'" />
    </div>
    <div :class="styles.userTable">
      <DepartmentUserList
        v-if="useWeComUser.selectedViewType === 'department'"
      />
      <TagUserList v-if="useWeComUser.selectedViewType === 'tag'" />
    </div>
    <AddDepartment ref="addDepartmentRef" />
  </div>
</template>

<style scoped></style>
