import { DictionaryItem } from '@/api/dictionary';

export interface OptionsState {
  customerTypes: DictionaryItem[];
  productTypes: DictionaryItem[];
  productPlans: DictionaryItem[];
  approvalStatus: DictionaryItem[];
  salesChannels: DictionaryItem[];
  promoteChannels: DictionaryItem[];
  sourceTypes: DictionaryItem[];
}
