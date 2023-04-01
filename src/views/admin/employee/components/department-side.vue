<template>
  <a-card style="width: 100%; height: 100%">
    <a-scrollbar style="width: 100%; height: 100%; overflow: auto">
      <a-tree
        v-if="data.depTree.length > 0"
        :data="data.depTree"
        block-node
        :show-line="true"
        :field-names="{
          title: 'depName',
          key: 'id',
          children: 'children',
        }"
        checked-strategy="child"
        @select="onSelect"
      >
        <template #title="nodeData">
          <span>{{ nodeData.depName }}</span>
        </template>
        <template #extra="nodeData">
          <a-dropdown position="bl" style="background-color: white">
            <a-link type="text">···</a-link>
            <template #content>
              <a-doption @click="openAddDepDrawer(nodeData.id)"
                >添加子部门</a-doption
              >
              <a-drawer
                v-if="
                  nodeData.id === state.addDepDrawer.pId &&
                  state.addDepDrawer.visible
                "
                v-model:visible="state.addDepDrawer.visible"
                title="添加子部门"
                width="500px"
              >
                <CreateDepartment :id="state.addDepDrawer.pId" />
              </a-drawer>
            </template>
          </a-dropdown>
        </template>
        <template #drag-icon>
          <a-icon type="menu" />
        </template>
      </a-tree>
    </a-scrollbar>
  </a-card>
</template>

<script lang="ts" setup>
  import { computed, onMounted, PropType, reactive } from 'vue';
  import { DepartmentNode, getDepartmentTree } from '@/api/department';
  import CreateDepartment from '@/views/admin/employee/components/create-department.vue';

  const prop = defineProps({
    modelValue: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const depId = computed({
    get() {
      return prop.modelValue;
    },
    set(v) {
      emit('update:modelValue', v);
    },
  });

  const data = reactive({
    depTree: [] as DepartmentNode[],
  });

  const state = reactive({
    addDepDrawer: {
      visible: false,
      pId: 0,
    },
  });

  const onSelect = (v: number[]) => {
    depId.value = v.shift();
  };

  function fetch() {
    getDepartmentTree({ depId: 1 }).then((res) => {
      data.depTree = [res.data.depTree];
    });
  }

  function openAddDepDrawer(pId: number) {
    state.addDepDrawer.visible = true;
    state.addDepDrawer.pId = pId;
  }

  onMounted(() => {
    fetch();
  });
</script>

<style scoped>

</style>
