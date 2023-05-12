import { defineStore } from 'pinia';
import {
  ApprovalStatusDDType,
  CustomerTypesDDType,
  DictionaryItem,
  listDictionaryItems,
  ProductPlanDDType,
  ProductTypesDDType,
  PromoteChannelsDDType,
  SalesChannelsDDType,
  SourceTypesDDType,
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
  },
});

export default useOptionsStore;
