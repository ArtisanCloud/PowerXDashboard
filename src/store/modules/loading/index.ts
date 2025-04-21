import { defineStore } from 'pinia';

const useLoadingStore = defineStore('loading', {
  state: () => ({
    loading: false, // 全局 loading 状态
  }),
  actions: {
    setLoading(value: boolean) {
      // console.log(value);
      this.loading = value;
    },
  },
});

export default useLoadingStore;
