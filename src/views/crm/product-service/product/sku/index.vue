<template>
  <!--	产品规格配置表-->
  <a-card>
    <a-form
      ref="formRefSpecific"
      auto-label-width
      :model="state.productSpecifics"
      @submit="onSaveSpecifics"
    >
      <a-list>
        <template #header>
          {{ state.product.name }}
          &nbsp;&nbsp;&nbsp;
          <a-button
            :style="{
              width: '120px',
              cursor: 'pointer',
            }"
            @click="addSpecific"
          >
            <template #icon>
              <icon-plus />
            </template>
            添加规格
          </a-button>
        </template>
        <a-list-item
          v-for="(specific, index) in state.productSpecifics"
          :key="index"
        >
          <a-list-item-meta>
            <template #title>
              <div
                style="
                  width: 160px;
                  display: flex;
                  flex-wrap: nowrap;
                  /*border: #6b1111 1px dashed;*/
                "
              >
                <a-input
                  v-model="state.productSpecifics[index].name"
                  size="mini"
                  @change="
                    validateSpecificNameDuplicated(
                      state.productSpecifics[index].name
                    )
                  "
                />
                &nbsp;&nbsp;

                <a-button shape="round" size="mini" @click="addOption(index)">
                  <icon-plus />
                </a-button>
                &nbsp;
                <a-button
                  shape="round"
                  size="mini"
                  @click="removeSpecific(index)"
                >
                  <icon-minus />
                </a-button>
              </div>
            </template>
          </a-list-item-meta>
          <a-space :wrap="true" :direction="specificOptionsDirection">
            <a-checkbox
              v-for="(option, indexOption) in specific.specificOptions"
              :key="indexOption"
              v-model="option.isActivated"
              :default-checked="option.isActivated"
            >
              <a-input
                v-model="option.name"
                size="mini"
                @change="validateOptionNameDuplicated(index, option.name)"
              />
            </a-checkbox>
          </a-space>
        </a-list-item>
        <template #footer>
          <div style="display: flex; justify-content: flex-end">
            <a-button type="primary" html-type="submit">保存规格</a-button>
          </div>
        </template>
      </a-list>
    </a-form>
  </a-card>

  <!--	SKU 配置表格-->
  <a-card>
    <a-form
      ref="formRefSKU"
      auto-label-width
      :model="state.productSpecifics"
      @submit="onSaveSKUs"
    >
      <a-table
        :data="state.product.skus"
        :loading="state.loading"
        row-key="id"
        :columns="columns"
        column-resizable
        :pagination="false"
        :bordered="{ cell: true }"
      >
        <template #id="{ rowIndex }">
          <a-typography-text>{{ rowIndex + 1 }}</a-typography-text>
        </template>
        <template #skuNo="{ rowIndex }">
          <a-input v-model="state.product.skus[rowIndex].skuNo" />
        </template>
        <template #status="{ rowIndex }">
          <a-checkbox v-model="state.product.skus[rowIndex].isActive"
            >激活
          </a-checkbox>
        </template>

        <template #inventory="{ rowIndex }">
          <a-input-number v-model="state.product.skus[rowIndex].inventory" />
        </template>
      </a-table>
      <div style="margin-top: 10px; display: flex; justify-content: flex-end">
        <a-button type="primary" html-type="submit">保存SKU</a-button>
      </div>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import {
    configProductSpecific,
    listProductSpecifics,
    ProductSpecific,
    SpecificOption,
  } from '@/api/crm/product-service/productSpeficic';
  import { MaxPageSize } from '@/api/common';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { getProduct, Product, SKU } from '@/api/crm/product-service/product';

  const router = useRouter();

  const formRefSpecific = ref();
  const formRefSKU = ref();

  const state = reactive({
    productId: 0,
    product: {} as Product,
    productSpecifics: [] as ProductSpecific[],
    skus: [] as SKU[],
    loading: false,
    formSpecificValid: true,
    formOptionValid: true,
  });

  const columns = reactive([
    {
      title: 'Id',
      dataIndex: 'id',
      width: 60,
      slotName: 'id',
    },
    {
      title: 'SKU',
      dataIndex: 'skuNo',
      width: 250,
      slotName: 'skuNo',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      slotName: 'status',
    },
    {
      title: '库存',
      dataIndex: 'inventory',
      slotName: 'inventory',
    },
  ]);

  const specificOptionsDirection = computed(() => {
    return state.productSpecifics.length > 3 ? 'vertical' : 'horizontal';
  });

  const addSpecific = () => {
    if (state.productSpecifics.length >= 5) {
      Message.error('产品的规格数量不能超过5个');
      return;
    }
    state.productSpecifics.push({
      productId: state.productId,
      name: '新规格',
      specificOptions: [],
    });
  };
  const removeSpecific = (index: number) => {
    state.productSpecifics.splice(index, 1);
  };

  const fetchProductSpecifics = async () => {
    const res = await listProductSpecifics({
      productId: state.product.id ?? 0,
      pageIndex: 0,
      pageSize: MaxPageSize,
    });

    state.productSpecifics = res.data.list;
  };

  const fetchProduct = async (productId: number) => {
    const res = await getProduct({
      productId,
    });

    state.product = res.data;
  };

  const refreshProductSpecifics = () => {
    // fetchProductSpecifics();
    state.productSpecifics = state.product.productSpecifics;
  };

  const refreshSKUs = () => {
    // fetchProductSpecifics();
    state.skus = state.product.skus;
  };

  const onSaveSpecifics = async () => {
    // Perform any additional validation or checks if required

    if (!state.formSpecificValid) {
      Message.error('请检查规格名称，不要出现名称');
      return;
    }
    if (!state.formOptionValid) {
      Message.error('请检查某规格的选项名称，不要出现名称');
      return;
    }

    // console.log(state.productSpecifics);

    const res = await configProductSpecific({
      productSpecifics: state.productSpecifics,
    });

    if (res.data.result) {
      Message.info('更新产品规格成功，请配置SKU');
      await fetchProduct(state.productId);
      refreshSKUs();
    }
  };

  const onSaveSKUs = () => {
    // Perform any additional validation or checks if required
    console.log('Save skus:', state.product.skus);
  };

  const addOption = (specificIndex: number) => {
    const specific = state.productSpecifics[specificIndex];
    // console.log(specific);
    if (specific.specificOptions!.length >= 5) {
      Message.error('产品的规格选项数量不能超过5个');
      return;
    }

    const option = {
      name: '新规格选项',
      isActivated: true,
    } as SpecificOption;
    if (specific.id! > 0) {
      option.productSpecificId = specific.id!;
    }

    specific.specificOptions?.push(option);
  };

  const removeOption = (specificIndex: number, optionIndex: number) => {
    state.productSpecifics[specificIndex].specificOptions?.splice(
      optionIndex,
      1
    );
  };

  const validateSpecificNameDuplicated = (name: string) => {
    // Check for duplicated names in state.productSpecifics array
    const duplicates = state.productSpecifics.filter(
      (specific) => specific.name === name
    );

    // Return true if duplicates exist, indicating that the name is duplicated

    state.formSpecificValid = !(duplicates.length > 1);
    if (!state.formSpecificValid) {
      Message.error(`规格：${name}已经存在，请不要重名`);
    }
    return state.formSpecificValid;
  };
  const validateOptionNameDuplicated = (index: number, name: string) => {
    // Get the options array for the specific at the given index
    const options = state.productSpecifics[index].specificOptions;

    // Check for duplicated names in options array
    const duplicates = options!.filter((option) => option.name === name);

    // Return true if duplicates exist, indicating that the name is duplicated
    state.formOptionValid = !(duplicates.length > 1);

    if (!state.formOptionValid) {
      Message.error(`选项：${name}已经存在，请不要重名`);
    }

    return state.formSpecificValid;
  };

  onMounted(async () => {
    const { query } = useRouter().currentRoute.value;
    const productId = Number(query.productId);
    // console.log(priceBookId);
    if (!productId || productId <= 0) {
      Message.error('请先选择正确的产品');
      await router.push({
        name: 'ProductService',
      });
      return;
    }

    state.productId = productId;
    await fetchProduct(state.productId);
    refreshProductSpecifics();
    refreshSKUs();
  });
</script>

<style scoped></style>
