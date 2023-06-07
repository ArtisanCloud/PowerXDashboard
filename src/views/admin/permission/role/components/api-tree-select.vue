<template>
  <a-tree
    v-model:checked-keys="data"
    :data="treeData"
    checkable
    :checked-strategy="'child'"
  />
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import { AdminAPI, listAPI } from '@/api/permission';

  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const data = computed<(string | number)[]>({
    get(): Array<string | number> {
      return props.modelValue as Array<string | number>;
    },
    set(value: ReadonlyArray<string | number>): void {
      emit('update:modelValue', value);
    },
  });

  const apiData = ref([] as AdminAPI[]);

  function formatApiData(list: AdminAPI[]) {
    const groups = {} as Record<string, any>;

    list.forEach((item) => {
      if (!groups[item.groupId]) {
        groups[item.groupId] = {
          key: `group_${item.groupId}`,
          title: item.groupName,
          children: [],
        };
      }

      groups[item.groupId].children.push({
        key: item.id,
        title: item.name,
        isLeaf: true,
      });
    });

    return Object.values(groups);
  }

  const treeData = computed(() => {
    return formatApiData(apiData.value);
  });

  function fetch() {
    listAPI({}).then((res) => {
      apiData.value = res.data.list;
    });
  }

  onMounted(() => {
    fetch();
  });
</script>
