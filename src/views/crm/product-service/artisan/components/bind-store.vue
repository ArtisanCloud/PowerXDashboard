<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      @submit="onSubmit"
    >
      <a-form-item label="元匠名称" field="name">
        <a-typography-text>{{ prop.node.name }} </a-typography-text>
      </a-form-item>

      <a-form-item label="门店" field="level">
        <a-select
          v-model="state.selectedStoreId"
          :options="state.storeList"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择门店"
        />
      </a-form-item>

      <a-form-item>
        <a-space size="large">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, PropType, reactive, ref } from 'vue';
  import {
    Artisan,
    bindArtisanToStore,
    BindArtisanToStoreRequest,
  } from '@/api/crm/product-service/artisan';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    ListStorePageRequest,
    listStores,
    Store,
  } from '@/api/crm/market/store';
  import { MaxPageSize } from '@/api';

  const { loading, setLoading } = useLoading();

  const prop = defineProps({
    node: {
      type: Object as PropType<Artisan>,
      default() {
        return {};
      },
    },
  });

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const formRef = ref();
  const formModel = ref({
    artisanIds: [prop.node?.id],
    storeIds: [],
  } as BindArtisanToStoreRequest);

  const state = reactive({
    selectedStoreId: 0,
    storeList: [] as Array<Store>,
    submitLoading: false,
  });

  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }

    state.submitLoading = true;
    bindArtisanToStore({
      artisanIds: formModel.value.artisanIds,
      storeIds: [state.selectedStoreId],
    })
      .then(() => {
        Message.success('更新成功');
        emits('submitSuccess');
      })
      .catch(() => {
        emits('submitFailed');
      })
      .finally(() => {
        state.submitLoading = false;
      });
  };

  const fetchStoreList = async (req: ListStorePageRequest) => {
    const res = await listStores(req);
    state.storeList = res.data.list;
  };

  onMounted(() => {
    fetchStoreList({ pageSize: MaxPageSize });
    state.selectedStoreId = prop.node?.storeIds[0] ?? '';
  });
</script>
