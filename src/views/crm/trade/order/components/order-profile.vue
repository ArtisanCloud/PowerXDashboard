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
          <a-form-item label="物流单号" field="trackingCode">
            <a-input v-model="formModel.logistics.trackingCode" />
          </a-form-item> </a-col
      ></a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="货代商" field="carrier">
            <a-input v-model="formModel.logistics.carrier" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="物流单状态" field="status">
            <a-input v-model="formModel.logistics.status" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="预期送货时间" field="estimatedDeliveryDate">
            <a-input v-model="formModel.logistics.estimatedDeliveryDate" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="实际到货时间" field="actualDeliveryDate">
            <a-input v-model="formModel.logistics.actualDeliveryDate" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-divider />
      <a-row :gutter="32">
        <a-form-item label="支付记录" field="orderItems">
          <a-list style="width: 100%">
            <a-list-item v-for="item in formModel.payments" :key="item.id">
              <a-list-item-meta>
                <template #description>
                  支付单号：{{ item.paymentNumber }} - 支付时间:
                  {{ item.paymentDate }}
                  <br />
                  参考单号：{{ item.referenceNumber }} - 支付类型：
                  {{ item.paymentType }}
                  <br />
                  支付状态：{{ item.status }}
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
  import { MediaResource } from '@/api/mediaresource';
  import { getDefaultLogistics } from '@/api/crm/trade/logistics';

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
    logistics: prop.node?.logistics ?? getDefaultLogistics(),
  } as Order);

  const rules = {
    orderNumber: [
      { required: true, message: '请输入订单号' },
      { max: 20, message: '订单号不能为空' },
    ],
  } as Record<string, FieldRule[]>;

  const getOssUrl = (resource: MediaResource) => {
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
