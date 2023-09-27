<template>
  <div class="content">
    <w-offi-account-menu @submit-data="subMenuData" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { WOffiAccountMenu } from '@yaoyaochi/weyui';

  const subMenuData = async (menuData: any) => {
    console.log(menuData);
  };

  onMounted(() => {});
</script>

<style scoped lang="less">
  .content {
    padding: 20px;
  }
</style>
