import {DictionaryItem} from "@/api/dictionary";

export interface OptionsState {
	productTypes: DictionaryItem[],
	productPlans: DictionaryItem[],
	approvalStatus: DictionaryItem[],
}