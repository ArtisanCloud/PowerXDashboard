import {defineStore} from 'pinia';
import {
	ApprovalStatusDDType,
	DictionaryItem,
	listDictionaryItems,
	ProductPlanDDType,
	ProductTypesDDType
} from "@/api/dictionary";
import {OptionsState} from "@/store/modules/data-dictionary/type";


const useOptionsStore = defineStore('options', {
	state: (): OptionsState => ({
		productTypes: [],
		productPlans: [],
		approvalStatus: [],
	}),

	getters: {},

	actions: {

		GetOptionById(options: DictionaryItem[], id: number): DictionaryItem | undefined {
			for (let i = 0; i < options.length; i += 1) {
				// console.log(options[i].id, id)
				if (options[i].id === id) {
					return options[i]
				}
			}
			return undefined
		},

		async fetchProductTypeOptions() {
			try {
				const res = await listDictionaryItems({type: ProductTypesDDType});
				this.productTypes = res.data.list;
				// console.log(dictionaryTypeList)
			} finally {
				// console.log("fetch product type options")
			}
		},

		async fetchProductPlanOptions() {
			try {
				const res = await listDictionaryItems({type: ProductPlanDDType});
				this.productPlans = res.data.list;
				// console.log(dictionaryTypeList)
			} finally {
				// console.log("fetch product plan options")
			}
		},


		async fetchApprovalStatusOptions() {
			try {
				const res = await listDictionaryItems({type: ApprovalStatusDDType});
				this.approvalStatus = res.data.list;
				// console.log(dictionaryTypeList)
			} finally {
				// console.log("fetch approval status options")
			}
		},
	}
})

export default useOptionsStore;
