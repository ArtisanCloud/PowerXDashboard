import { defineStore } from 'pinia';
import {
  ApprovalStatusDDType,
  ArtisanLevelDDType,
  CustomerTypesDDType,
  DictionaryItem,
  listDictionaryItems,
  MediaTypeDDType,
  MGMSceneDDType,
  OrderStatusDDType,
  OrderTypeDDType,
  PaymentStatusDDType,
  PaymentTypeDDType,
  ProductPlanDDType,
  ProductTypesDDType,
  PromoteChannelsDDType,
  SalesChannelsDDType,
  SourceTypesDDType,
} from '@/api/dictionary';
import { OptionsState } from '@/store/modules/data-dictionary/type';

const sessionPrefix = 'data-dictionary';

function formatItemSessionKey(type: string) {
  return `${sessionPrefix}:${type}`;
}

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
    mgmScenes: [],
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
      id: number,
    ): DictionaryItem | undefined {
      for (let i = 0; i < options.length; i += 1) {
        if (options[i].id === id) {
          return options[i];
        }
      }
      return undefined;
    },
    GetOptionByKey(
      options: DictionaryItem[],
      key: string,
    ): DictionaryItem | undefined {
      for (let i = 0; i < options.length; i += 1) {
        if (options[i].key === key) {
          return options[i];
        }
      }
      return undefined;
    },
    async fetchOption(type: string) {
      const cachedData = sessionStorage.getItem(formatItemSessionKey(type));
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      try {
        const res = await listDictionaryItems({ type });
        sessionStorage.setItem(
          formatItemSessionKey(type),
          JSON.stringify(res.data.list),
        );
        return res.data.list;
      } finally {
        // console.log("fetch options")
      }
    },
    async fetchAllOptions() {
      const types = [
        CustomerTypesDDType,
        ProductTypesDDType,
        ProductPlanDDType,
        ApprovalStatusDDType,
        SalesChannelsDDType,
        PromoteChannelsDDType,
        SourceTypesDDType,
        ArtisanLevelDDType,
        MediaTypeDDType,
        MGMSceneDDType,
        OrderTypeDDType,
        OrderStatusDDType,
        PaymentTypeDDType,
        PaymentStatusDDType,
      ];

      [
        this.customerTypes,
        this.productTypes,
        this.productPlans,
        this.approvalStatus,
        this.salesChannels,
        this.promoteChannels,
        this.sourceTypes,
        this.artisanLevels,
        this.mediaTypes,
        this.mgmScenes,
        this.orderTypes,
        this.orderStatus,
        this.paymentTypes,
        this.paymentStatus,
      ] = await Promise.all(types.map((type) => this.fetchOption(type)));

      this.setup = true;
    },
    isSetup() {
      return this.setup;
    },
  },
});

export default useOptionsStore;
