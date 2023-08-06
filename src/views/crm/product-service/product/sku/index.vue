<template>
  <div class="container">
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
                    v-model="specific.name"
                    size="mini"
                    @change="validateSpecificNameDuplicated"
                  />
                  &nbsp;&nbsp;

                  <a-button shape="round" size="mini" @click="addOption(index)">
                    <icon-plus />
                  </a-button>
                  &nbsp;<a-popconfirm
                    content="确认要删除改规格么？这会造成需要重新梳理SKU"
                    @ok="removeSpecific(state.productSpecifics[index])"
                  >
                    <a-button shape="round" size="mini">
                      <icon-minus />
                    </a-button>
                  </a-popconfirm>
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
                  @change="validateOptionNameDuplicated(index)"
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
          :data="state.skus"
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
            <a-input v-model="state.skus[rowIndex].skuNo" />
          </template>

          <template #inventory="{ rowIndex }">
            <a-input-number v-model="state.skus[rowIndex].inventory" />
          </template>
          <template #optional="{ record }">
            <a-space align="center">
              <!--删除SKU按钮-->
              <a-popconfirm
                content="该操作会删除SKU,确定要删除此SKU吗？"
                @ok="removeSKU(record.id)"
              >
                <a-button>
                  <template #icon>
                    <icon-delete :style="{ fontSize: '16px', color: 'red' }" />
                  </template>
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
        <div style="margin-top: 10px; display: flex; justify-content: flex-end">
          <a-button type="primary" html-type="submit">保存SKU</a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { getProduct, Product } from '@/api/crm/product-service/product';
  import { configSKU, deleteSKU, SKU } from '@/api/crm/product-service/sku';
  import {
    configProductSpecific,
    deleteProductSpecific,
    ProductSpecific,
    SpecificOption,
  } from '@/api/crm/product-service/productSpecific';

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
      width: 350,
      slotName: 'skuNo',
    },
    {
      title: '库存',
      dataIndex: 'inventory',
      width: 150,
      slotName: 'inventory',
    },
    {
      title: '操作',
      width: 250,
      // align: 'center',
      slotName: 'optional',
    },
  ]);

  const specificOptionsDirection = computed(() => {
    return state.productSpecifics.length > 3 ? 'horizontal' : 'vertical';
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

  const refreshPage = async () => {
    await fetchProduct(state.productId);
    refreshProductSpecifics();
    refreshSKUs();
  };

  const removeSpecific = async (specific: ProductSpecific) => {
    // console.log(specific, specific.id);
    const id = specific.id ?? 0;
    if (id > 0) {
      const res = await deleteProductSpecific({ id });
      if (res.data.id > 0) {
        await refreshPage();
      }
    }
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

      await refreshPage();
    }
  };

  const onSaveSKUs = async () => {
    // Perform any additional validation or checks if required
    // console.log('Save skus:', state.skus);
    const res = await configSKU({
      skus: state.skus,
    });

    if (res.data.result) {
      Message.info('更新SKU成功');

      await refreshPage();
    }
  };

  const addOption = (specificIndex: number) => {
    const specific = state.productSpecifics[specificIndex];
    // console.log(specific);
    if (specific.specificOptions && specific.specificOptions.length >= 5) {
      Message.error('产品的规格选项数量不能超过5个');
      return;
    }

    const option = {
      name: '新规格选项',
      isActivated: true,
    } as SpecificOption;
    if (specific.id && specific.id > 0) {
      option.productSpecificId = specific.id ?? 0;
    }

    specific.specificOptions?.push(option);
  };

  const removeSKU = async (id: number) => {
    const res = await deleteSKU({ id });
    if (res.data.id > 0) {
      await refreshPage();
    }
  };

  const validateSpecificNameDuplicated = () => {
    // Check for duplicated names in state.productSpecifics array
    const duplicates = state.productSpecifics.filter(
      (specific, index, array) =>
        array.findIndex((item) => item.name === specific.name) !== index
    );

    // Return true if duplicates exist, indicating that the name is duplicated
    state.formSpecificValid = duplicates.length === 0;

    if (!state.formSpecificValid) {
      Message.error(`规格名称存在重复，请确保每个规格名称都是唯一的`);
    }

    return state.formSpecificValid;
  };
  const validateOptionNameDuplicated = (index: number) => {
    // Get the options array for the specific at the given index
    const options = state.productSpecifics[index]?.specificOptions;

    // Check for duplicated names in options array
    const duplicates = options?.filter(
      (option, optionIndex, array) =>
        array.findIndex((item) => item.name === option.name) !== optionIndex
    );

    // Return true if duplicates exist, indicating that the name is duplicated
    state.formOptionValid = !duplicates || duplicates.length === 0;

    if (!state.formOptionValid) {
      Message.error(`选项名称存在重复，请确保每个选项名称都是唯一的`);
    }

    return state.formOptionValid;
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
    await refreshPage();
  });
</script>

<style scoped></style>
