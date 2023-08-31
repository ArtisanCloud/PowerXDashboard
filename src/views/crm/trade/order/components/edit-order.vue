<template>
  <div class="container">
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-row :gutter="32">
        <a-col :span="32">
          <a-form-item label="订单号" field="orderNumber">
            <a-input v-model="formModel.orderNumber" />
          </a-form-item> </a-col
      ></a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="订单类型" field="type">
            <a-select
              v-model="formModel.type"
              :options="options.orderTypes"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择订单类型"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="支付类型" field="paymentType">
            <a-select
              v-model="formModel.paymentType"
              :options="options.paymentTypes"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择支付类型"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="订单状态" field="approvalStatus">
            <a-select
              v-model="formModel.status"
              :options="options.orderStatus"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择订单状态"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="零售价格" field="listPrice">
            <a-input-number v-model="formModel.listPrice" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="实际成交价格" field="unitPrice">
            <a-input-number v-model="formModel.unitPrice" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="折扣" field="discount">
            <a-input-number v-model="formModel.discount" />
          </a-form-item> </a-col
      ></a-row>
      <a-row :gutter="32">
        <a-col :span="32">
          <a-form-item label="标注" field="comment">
            <a-textarea v-model="formModel.comment" style="width: 360px" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-divider />
      <a-row :gutter="32">
        <a-form-item label="购买项详情" field="orderItems">
          <a-list style="width: 100%">
            <a-list-item v-for="item in formModel.orderItems" :key="item.id">
              <a-list-item-meta>
                <template #avatar>
                  <a-avatar shape="square">
                    <img alt="avatar" :src="getOssUrl(item.coverImage)" />
                  </a-avatar>
                </template>
                <template #description>
                  产品名称：{{ item.productName }}
                  <br />
                  成交价格：{{ item.unitPrice }}元 x 单位：{{ item.quantity }}
                  <br />
                </template>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-form-item>
      </a-row>

      <a-divider />

      <!--      <a-form-item>-->
      <!--        <a-space size="large">-->
      <!--          <a-button type="primary" html-type="submit">提交</a-button>-->
      <!--          <a-button @click="formRef.resetFields()">重置</a-button>-->
      <!--        </a-space>-->
      <!--      </a-form-item>-->
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, ref } from 'vue';

  import { FieldRule, Message } from '@arco-design/web-vue';
  import { Order } from '@/api/crm/trade/order';
  import useOptionsStore from '@/store/modules/data-dictionary';
  import { ossUrl, staticUrl } from '@/api';
  import { MediaResource } from '@/api/media-resource';

  const prop = defineProps({
    node: {
      type: Object as PropType<Order>,
      default() {
        return {};
      },
    },
  });

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const options = useOptionsStore();

  const formRef = ref();
  const formModel = ref({
    paymentType: prop.node?.paymentType,
    type: prop.node?.type,
    status: prop.node?.status,
    orderNumber: prop.node?.orderNumber,
    discount: prop.node?.discount,
    listPrice: prop.node?.listPrice,
    unitPrice: prop.node?.unitPrice,
    comment: prop.node?.comment,
    orderItems: prop.node?.orderItems,
  } as Order);

  const rules = {
    orderNumber: [
      { required: true, message: '请输入订单号' },
      { max: 20, message: '订单号不能为空' },
    ],
  } as Record<string, FieldRule[]>;

  const getOssUrl = (resource: MediaResource | undefined): string => {
    if (resource) {
      if (resource.isLocalStored) {
        return staticUrl(resource.url);
      }
      return ossUrl(resource.url);
    }
    return '';
  };

  const onSubmit = async () => {
    // if (state.submitLoading) {
    // 	return;
    // }
    // const err = await formRef.value.validate();
    // if (err) {
    // 	return;
    // }
    //
    // // console.log(formModel.value.detailImageIds);
    //
    // state.submitLoading = true;
    // updateProduct(formModel.value)
    // 	.then(() => {
    // 		Message.success('更新成功');
    // 		emits('submitSuccess');
    // 	})
    // 	.catch(() => {
    // 		emits('submitFailed');
    // 	})
    // 	.finally(() => {
    // 		state.submitLoading = false;
    // 	});
  };
</script>

<style scoped></style>
