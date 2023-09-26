<template>
  <div class="content">
    <a-card class="card">
      <custom-menu @submit-data="subMenuData" />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { CustomMenu } from '@yaoyaochi/weyui/';
  import '@yaoyaochi/weyui/style.css';

  const subMenuData = async (menuData: any) => {
    console.log(menuData);
  };

  onMounted(() => {});
</script>

<style scoped lang="less">
  .content {
    padding: 20px;
    .card {
      padding: 20px;
    }
  }
</style>
