<script lang="ts" setup>
  import DepartmentSide from '@/views/scrm/wecom/organization/user/components/department-side/index.vue';
  import UserList from '@/views/scrm/wecom/organization/user/components/user-list/index.vue';
  import TagUserList from '@/views/scrm/wecom/organization/user/components/tag-user-list/index.vue';
  import useWeComUserStore, { ViewType } from '@/store/modules/scrm/wecom/user';
  import { ref } from 'vue';
  import { pullSyncWeComDepartmentsAndUsers } from '@/api/scrm/customer';
  import { Message } from '@arco-design/web-vue';
  import styles from './index.module.less';

  const useWeComUser = useWeComUserStore();

  const checkedViewType = ref('department');
  const handleDepartmentChange = (data: number | undefined) => {
    useWeComUser.setSelectedDepartment(data!);
    // queryChange();
  };

  const onSelectedViewType = (e: ViewType) => {
    // console.log(e);
    useWeComUser.setSelectedViewType(e);
  };

  const onAddDepartment = () => {
    console.log('add department');
  };
  const onSyncWeComDepartments = async () => {
    // state.loading = true;
    // const res = await pullSyncWeComDepartmentsAndUsers({
    //   sync: 1,
    // });
    // try {
    //   if (res) {
    //     Message.success('同步成功');
    //     fetchCustomers();
    //   }
    // } catch (err) {
    //   state.loading = false;
    // } finally {
    //   state.loading = false;
    // }
  };
  const onAddTag = () => {
    console.log('add tag');
  };
  const onSyncWeComTags = () => {
    console.log('sync wecom tags');
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
              ><icon-sync /> 从企微同步标签</a-doption
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
      <a-scrollbar>
        <DepartmentSide
          style="min-height: 65vh"
          @update:model-value="handleDepartmentChange"
        />
      </a-scrollbar>
    </div>
    <div :class="styles.userTable">
      <UserList v-if="useWeComUser.selectedViewType === 'department'" />
      <TagUserList v-if="useWeComUser.selectedViewType === 'tag'" />
    </div>
  </div>
</template>

<style scoped></style>
