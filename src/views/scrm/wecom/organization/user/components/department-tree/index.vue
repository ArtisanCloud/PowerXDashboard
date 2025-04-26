<script lang="ts" setup>
  import { computed, onMounted, PropType, ref } from 'vue';
  import useWeComUserStore from '@/store/modules/scrm/wecom/user';
  import { consola } from 'consola';
  import styles from './index.module.less';

  const prop = defineProps({
    modelValue: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  });
  const emit = defineEmits(['update:modelValue', 'departmentSelect']);

  const useWeComUser = useWeComUserStore();
  const depId = computed({
    get() {
      return prop.modelValue;
    },
    set(v) {
      emit('update:modelValue', v);
    },
  });

  const onSelect = (selectedKeys: number[]) => {
    depId.value = selectedKeys[0] === 1 ? 1 : selectedKeys[0];
  };

  const expandedKeys = ref<number[]>([]);

  const getAllKeys = (tree: any[]) => {
    const keys: number[] = [];
    const traverse = (nodes: any[]) => {
      nodes.forEach((node) => {
        keys.push(node.weComDepId);
        if (Array.isArray(node.children)) {
          traverse(node.children);
        }
      });
    };
    traverse(tree);
    return keys;
  };

  onMounted(async () => {
    // 默认拉取根目录的部门树
    await useWeComUser.loadDepartmentTree(1);
    // consola.log(useWeComUser.departmentTree);
    // expandedKeys.value = getAllKeys(useWeComUser.departmentTree);
    expandedKeys.value = [1]; // 只展开根节点，可改成 getAllKeys(...) 全部展开

    // 加载完部部树后，设置默认选中的部门
    await useWeComUser.setSelectedDepartment(1);
  });

  // 监听展开事件，更新 expandedKeys
  const onExpand = (keys: number[]) => {
    expandedKeys.value = keys;
  };
</script>

<template>
  <div :class="styles.container">
    <a-tree
      :data="useWeComUser.departmentTree"
      :expanded-keys="expandedKeys"
      :show-line="true"
      :field-names="{
        title: 'name',
        key: 'weComDepId',
        children: 'children',
      }"
      checked-strategy="child"
      @select="onSelect"
      @expand="onExpand"
    >
      <template #title="nodeData">
        <span>{{ nodeData.name }}</span>
      </template>
      <template #switcher-icon="{ children }">
        <icon-caret-down
          v-if="Array.isArray(children) && children.length > 0"
        />
      </template>
      <template #icon>
        <icon-folder />
      </template>
    </a-tree>
  </div>
</template>
