<script lang="ts" setup>
  import DepartmentSide from '@/views/scrm/wecom/organization/user/components/department-side/index.vue';
  import useWeComUserStore from '@/store/modules/scrm/wecom/user';
  import styles from './index.module.less';

  const useWeComUser = useWeComUserStore();

  const handleDepartmentChange = (data: number | undefined) => {
    useWeComUser.setSelectedDepartment(data!);
    // queryChange();
  };
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.departmentList">
      <div class="flex flex-row justify-between px-2 gap-2">
        <a-input-search
          :style="{ fontSize: '6px' }"
          placeholder="搜索成员、部门、标签"
        />
        <a-button :sytle="{ width: '12px' }">+</a-button>
      </div>
      <a-scrollbar>
        <DepartmentSide
          style="min-height: 65vh"
          @update:model-value="handleDepartmentChange"
        />
      </a-scrollbar>
    </div>
  </div>
</template>

<style scoped></style>
