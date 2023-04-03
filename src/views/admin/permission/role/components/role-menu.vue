<template>
  <div>
    <a-tree
      :data="data"
      :checked-keys="checked"
      checkable
      :selectable="false"
    />
    <a-button type="primary">更新</a-button>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import {getRole, putRole} from '@/api/permission';
  import { RouteRecordNormalized } from 'vue-router';
  import { menuRoutes } from '@/router/routes';

  const prop = defineProps({
    roleCode: {
      type: String,
      required: true,
    },
  });

  function getTreeData(routes: RouteRecordNormalized[]): any[] {
    return routes.map((route) => ({
      title: route.meta.locale,
      key: route.name,
      children: route.children.length
        ? getTreeData(route.children as RouteRecordNormalized[])
        : [],
    }));
  }

  const data = computed(() => {
    return getTreeData(menuRoutes);
  });

  const checked = ref([] as string[]);
  const currentRole = ref({} as any);

  function fetchSelectedMenuNames() {
    getRole({ roleCode: prop.roleCode }).then((res) => {
      checked.value = res.data.menuNames;
      currentRole.value = res.data;
    });
  }

  const submit = () => {
    console.log(checked.value);
    putRole({
      roleCode: prop.roleCode,
      name: currentRole.value.name,
      desc: currentRole.value.desc,
      menuNames: checked.value,
    }).then((res) => {
      console.log(res);
    })
  };

  onMounted(() => {
    fetchSelectedMenuNames();
  });
</script>
