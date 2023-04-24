<template>
  <div>
    <a-form ref="formRef" auto-label-width :model="formModel" :rules="rules" @submit="onSubmit">
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="产品名称" field="name">
            <a-input v-model="formModel.name"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="财务类别" field="accountingCategory">
            <a-input v-model="formModel.accountingCategory"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="类型" field="type">
            <a-select v-model="formModel.type"
                      :options="options.productTypes"
                      :field-names="{ label: 'name', value: 'id' }"
                      placeholder="请选择产品类型"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="审核状态" field="approvalStatus">
            <a-select v-model="formModel.approvalStatus"
                      :options="options.approvalStatus"
                      :field-names="{ label: 'name', value: 'id' }"
                      placeholder="请选择审核状态"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="计划" field="plan">
            <a-select v-model="formModel.plan"
                      :options="options.productPlans"
                      :field-names="{ label: 'name', value: 'id' }"
                      placeholder="请选择产品计划"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否激活" field="isActivated">
            <a-checkbox v-model="formModel.isActivated" default-value="false"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="描述" field="description">
            <a-textarea style="height: 80px" v-model="formModel.description"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否线上销售" field="canSellOnline">
            <a-checkbox v-model="formModel.canSellOnline"/>
          </a-form-item>
          <a-form-item label="是否可以抵扣购买" field="canUseForDeduct">
            <a-checkbox v-model="formModel.canUseForDeduct"/>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="可销售渠道" field="salesChannelsItemIds">
            <a-select multiple
                      :options="options.salesChannels"
                      v-model="formModel.salesChannelsItemIds"
                      :field-names="{ label: 'name', value: 'id' }"
                      placeholder="请选择可销售渠道"/>
          </a-form-item>
          <a-form-item label="可推广渠道" field="promoteChannelsItemIds">
            <a-select multiple
                      :options="options.promoteChannels"
                      v-model="formModel.promoteChannelsItemIds"
                      :field-names="{ label: 'name', value: 'id' }"
                      placeholder="请选择可推广渠道"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="销售开始时间" field="saleStartDate">
            <a-date-picker v-model="formModel.saleStartDate"/>
          </a-form-item>
          <a-form-item label="销售结束时间" field="saleEndDate">
            <a-date-picker v-model="formModel.saleEndDate"/>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="允许购买数量上限" field="purchasedQuantity">
            <a-input-number v-model="formModel.purchasedQuantity"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上传头图" field="coverURL">
            <a-upload
                list-type="picture-card"
                action="/"
                :default-file-list="fileList"
                image-preview
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item>
        <a-space size="large">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="$refs.formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>


<script lang="ts" setup>


import {onMounted, PropType, reactive, ref} from "vue";
import {updateProduct,} from "@/api/crm/product-service/product";
import {FieldRule, Message} from "@arco-design/web-vue";
import {Product} from "@/api/crm/product-service/product";

import useOptionsStore from "@/store/modules/data-dictionary";
import {PriceBook} from "@/api/crm/product-service/priceBook";

const prop = defineProps({
  node: {
    type: Object as PropType<Product>,
    default() {
      return {};
    },
  }
});

const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

const options = useOptionsStore()

const fileList = []

const formRef = ref();
const formModel = ref({
  id:prop.node?.id,
  name: prop.node.name,
  accountingCategory: prop.node.accountingCategory,
  type: prop.node.type,
  plan: prop.node.plan,
  salesChannelsItemIds: prop.node.salesChannelsItemIds,
  promoteChannelsItemIds: prop.node.promoteChannelsItemIds,
  approvalStatus: prop.node.approvalStatus,
  canSellOnline: prop.node.canSellOnline,
  canUseForDeduct: prop.node.canUseForDeduct,
  isActivated: prop.node.isActivated,
  description: prop.node.description,
  coverURL: prop.node.coverURL,
  purchasedQuantity: prop.node.purchasedQuantity,
  validityPeriodDays: prop.node.validityPeriodDays,
  saleStartDate: prop.node.saleStartDate,
  saleEndDate: prop.node.saleEndDate,
} as Product);

const rules = {
  name: [
    {required: true, message: '请输入商品手册名称'},
    {max: 10, message: '商品名称长度不能超过 10 个字符'},
  ],
  accountingCategory: [
    {required: true, message: '请输入财务类别名称'},
    {max: 10, message: '财务类别长度不能超过 10 个字符'},
  ],
  type: [
    {required: true, message: '请输入商品类型名称'},
  ],
  plan: [
    {required: true, message: '请输入商品计划名称'},
  ],
  approvalStatus: [
    {required: true, message: '请输入审核状态名称'},
  ],
  description: [{max: 100, message: '描述长度不能超过 100 个字符'}],


} as Record<string, FieldRule[]>;


const state = reactive({submitLoading: false});


const onSubmit = async () => {
  if (state.submitLoading) {
    return;
  }
  const err = await formRef.value.validate();
  if (err) {
    return;
  }
  state.submitLoading = true;
  updateProduct(formModel.value)
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

onMounted(() => {

});

</script>