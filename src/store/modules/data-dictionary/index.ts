import { defineStore } from 'pinia';
import {
  ApprovalStatusDDType,
  ArtisanLevelDDType,
  CustomerTypesDDType,
  DictionaryItem,
  listDictionaryItems,
  ProductPlanDDType,
  ProductTypesDDType,
  PromoteChannelsDDType,
  SalesChannelsDDType,
  SourceTypesDDType,
  MediaTypeDDType,
  OrderTypeDDType,
  OrderStatusDDType,
  PaymentTypeDDType,
  PaymentStatusDDType,
} from '@/api/dictionary';
import { OptionsState } from '@/store/modules/data-dictionary/type';

const useOptionsStore = defineStore('options', {
  state: (): OptionsState => ({
    customerTypes: [],
    productTypes: [],
    productPlans: [],
    approvalStatus: [],
    salesChannels: [],
    promoteChannels: [],
    sourceTypes: [],
    artisanLevels: [],
    mediaTypes: [],
    orderTypes: [],
    orderStatus: [],
    paymentTypes: [],
    paymentStatus: [],
    setup: false,
  }),

  getters: {},

  actions: {
    GetOptionById(
      options: DictionaryItem[],
      id: number
    ): DictionaryItem | undefined {
      for (let i = 0; i < options.length; i += 1) {
        // console.log(options[i].id, id)
        if (options[i].id === id) {
          return options[i];
        }
      }
      return undefined;
    },

    async fetchCustomerTypesOptions() {
      try {
        const res = await listDictionaryItems({ type: CustomerTypesDDType });
        this.customerTypes = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch approval status options")
      }
    },

    async fetchProductTypeOptions() {
      try {
        const res = await listDictionaryItems({ type: ProductTypesDDType });
        this.productTypes = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch product type options")
      }
    },

    async fetchProductPlanOptions() {
      try {
        const res = await listDictionaryItems({ type: ProductPlanDDType });
        this.productPlans = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch product plan options")
      }
    },

    async fetchApprovalStatusOptions() {
      try {
        const res = await listDictionaryItems({ type: ApprovalStatusDDType });
        this.approvalStatus = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch approval status options")
      }
    },

    async fetchSalesChannelsOptions() {
      try {
        const res = await listDictionaryItems({ type: SalesChannelsDDType });
        this.salesChannels = res.data.list;
        // console.log(this.salesChannels)
      } finally {
        // console.log("fetch approval status options")
      }
    },

    async fetchPromoteChannelsOptions() {
      try {
        const res = await listDictionaryItems({ type: PromoteChannelsDDType });
        this.promoteChannels = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch approval status options")
      }
    },

    async fetchSourceTypesOptions() {
      try {
        const res = await listDictionaryItems({ type: SourceTypesDDType });
        this.sourceTypes = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch approval status options")
      }
    },

    async fetchArtisanLevelsOptions() {
      try {
        const res = await listDictionaryItems({ type: ArtisanLevelDDType });
        this.artisanLevels = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch approval status options")
      }
    },

    async fetchMediaTypesOptions() {
      try {
        const res = await listDictionaryItems({ type: MediaTypeDDType });
        this.mediaTypes = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch approval status options")
      }
    },

    async fetchOrderTypesOptions() {
      try {
        const res = await listDictionaryItems({ type: OrderTypeDDType });
        this.orderTypes = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch approval status options")
      }
    },

    async fetchOrderStatusOptions() {
      try {
        const res = await listDictionaryItems({ type: OrderStatusDDType });
        this.orderStatus = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch approval status options")
      }
    },

    async fetchPaymentTypesOptions() {
      try {
        const res = await listDictionaryItems({ type: PaymentTypeDDType });
        this.paymentTypes = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch approval status options")
      }
    },

    async fetchPaymentStatusOptions() {
      try {
        const res = await listDictionaryItems({ type: PaymentStatusDDType });
        this.paymentStatus = res.data.list;
        // console.log(dictionaryTypeList)
      } finally {
        // console.log("fetch approval status options")
      }
    },

    async fetchAllOptions() {
      await this.fetchCustomerTypesOptions();
      await this.fetchProductTypeOptions();
      await this.fetchProductPlanOptions();
      await this.fetchApprovalStatusOptions();
      await this.fetchSalesChannelsOptions();
      await this.fetchPromoteChannelsOptions();
      await this.fetchSourceTypesOptions();
      await this.fetchArtisanLevelsOptions();
      await this.fetchMediaTypesOptions();
      await this.fetchOrderTypesOptions();
      await this.fetchOrderStatusOptions();
      await this.fetchPaymentTypesOptions();
      await this.fetchPaymentStatusOptions();
      this.setup = true;
    },

    isSetup() {
      return this.setup;
    },
  },
});

export default useOptionsStore;
