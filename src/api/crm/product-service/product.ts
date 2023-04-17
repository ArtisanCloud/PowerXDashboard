import { imageAbleInfo, PowerModel } from '@/api/common';

export interface ProductCategory extends PowerModel, imageAbleInfo {
	pId: bigint
	name: string
	sort: number
	viceName: string
	description: string
	children: ProductCategory[]
}