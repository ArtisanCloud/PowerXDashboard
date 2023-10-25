<template>
  <div class="content">
    <div v-if="state.isPlugin">
      <span v-if="!state.loading">未找到插件</span>
    </div>
    <div v-else>
      <a-result class="result" status="404" :subtitle="'not found'"> </a-result>
      <div class="operation-row">
        <a-button key="back" type="primary" @click="back"> back </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';
  import { reactive, watchEffect } from 'vue' 

  const router = useRouter();
  const route = useRoute();
  
  const state = reactive({
    isPlugin: false,
    loading: false
  })

  watchEffect(() => {
    if (route.path.startsWith('/powerx-plugins')) {
      state.isPlugin = true;
      state.loading = true;
      const pathSegments = route.path.split('/').slice(0, 3);
      const newPath = pathSegments.join('/');
      let retryCount = 0;
      const interval = setInterval(() => {
        const pluginRoute = router.getRoutes().find((r) => r.path === newPath);
        if (pluginRoute) {
          clearInterval(interval);
          router.push({ name: pluginRoute.name });
        } else {
          retryCount += 1;
          if (retryCount >= 5) {
            clearInterval(interval);
          }
        }
      }, 500);
    }
  });

  const back = () => {
    // warning： Go to the node that has the permission
    router.push({ name: 'Home' });
  };
</script>

<style scoped lang="less">
  .content {
    // padding-top: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -95px;
    margin-top: -121px;
    text-align: center;
  }
</style>
