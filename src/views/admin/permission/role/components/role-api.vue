<template>
  <a-tree :data="data" checkable :selectable="false"></a-tree>
</template>

<script lang="ts" setup>
  import { AdminAPI, listAPI } from '@/api/permission';
  import { TreeNodeData } from '@arco-design/web-vue';
  import { onMounted, ref } from 'vue';

  const data = ref([] as TreeNodeData[]);

  function getTreeData(apiList: AdminAPI[]) {
    const treeData = [] as TreeNodeData[];
    const groupNameMapById = {} as Record<string, string>;
    const mapByGroup = apiList.reduce((map, api) => {
      const { groupId } = api;
      if (!map[groupId]) {
        map[groupId] = [];
      }
      map[groupId].push(api);
      if (!groupNameMapById[groupId]) {
        groupNameMapById[groupId] = api.groupName;
      }
      return map;
    }, {} as Record<string, AdminAPI[]>);

    Object.keys(mapByGroup).forEach((groupId) => {
      const apis = mapByGroup[groupId];
      const groupNode = {
        title: groupNameMapById[groupId],
        key: groupId,
        children: apis.map((api) => ({
          title: api.name,
          key: api.id,
          isLeaf: true,
        })),
      };
      treeData.push(groupNode);
    });

    return treeData;
  }

  function fetchApiList() {
    listAPI({}).then((res) => {
      data.value = getTreeData(res.data.list);
    });
  }

  onMounted(() => {
    fetchApiList();
  });
</script>
