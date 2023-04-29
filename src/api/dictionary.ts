import axios from "axios";
import {PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';

const URI_DATE_DICTIONARY_API = '/dictionary'

export const CustomerTypesDDType = '_customer_type'
export const ProductTypesDDType = '_product_type'
export const ProductPlanDDType = '_product_plan'
export const ApprovalStatusDDType = '_approval_status'
export const SalesChannelsDDType = '_sales_channel'
export const PromoteChannelsDDType = '_promote_channel'
export const SourceTypesDDType = '_source_channel'

export const StatusDraft = '_draft'
export const StatusActive = '_active'
export const StatusCanceled = '_canceled'
export const StatusPending = '_pending'
export const StatusInactive = '_inactive'

export const ChannelDirect = '_direct'      // 品牌自营
export const ChannelWechat = '_wechat'      // 微信
export const ChannelTaoBao = '_tao_bao'     // 淘宝
export const ChannelJD = '_jd'              // 京东
export const ChannelDianPing = '_dian_ping' // 点评
export const ChannelMeiTuan = '_mei_tuan'   // 美团
export const ChannelDingDing = '_ding_ding' // 钉钉
export const ChannelDouYin = '_dou_yin'     // 抖音
export const ChannelAlipay = '_alipay'      // 支付宝

export interface DictionaryItem extends PowerModel {

	key: string
	type: string
	name: string
	value: string
	sort: number
	description: string

}


export interface DictionaryType extends PowerModel {

	type: string
	name: string
	description: string
	items: DictionaryItem[]

}


export interface ListDictionaryTypesRequest {
	ids?: number[];
	likeName?: string;
	pageIndex?: number;
	pageSize?: number;

}

export interface ListDictionaryTypesReply {
	list: DictionaryType[];
	pageIndex: number;
	pageSize: number;
	total: number;
}

export function listDictionaryTypes(request: ListDictionaryTypesRequest) {
	return axios.get<ListDictionaryTypesReply>(
		`${PREFIX_URI_ADMIN_API + URI_DATE_DICTIONARY_API}/types`,
		{
			params: request,
		}
	);
}

export interface CreateDictionaryTypeRequest {
	type: string
	name: string
	description?: string
}

export interface CreateDictionaryTypeReply {
	type: string
	name: string
	description?: string
}

export function createDictionaryType(request: CreateDictionaryTypeRequest) {
	return axios.post<CreateDictionaryTypeReply>(
		`${PREFIX_URI_ADMIN_API + URI_DATE_DICTIONARY_API}/types`,
		request
	);
}


export interface UpdateDictionaryTypeRequest {
	type: string
	name: string
	description?: string
}

export type UpdateDictionaryTypeReply = DictionaryType

export function updateDictionaryType(request: UpdateDictionaryTypeRequest) {
	return axios.put<UpdateDictionaryTypeReply>(
		`${PREFIX_URI_ADMIN_API + URI_DATE_DICTIONARY_API}/types/${request.type}`,
		request
	);
}

export interface DeleteDictionaryTypeRequest {
	type: string;
}

export interface DeleteDictionaryTypeReply {
	type: string;
}

export function deleteDictionaryType(request: DeleteDictionaryTypeRequest) {
	return axios.delete<DeleteDictionaryTypeReply>(
		`${PREFIX_URI_ADMIN_API + URI_DATE_DICTIONARY_API}/types/${request.type}`
	);
}


export interface ListDictionaryItemsRequest {
	type: string;

}

export interface ListDictionaryItemsReply {
	list: DictionaryItem[];
}

export function listDictionaryItems(request: ListDictionaryItemsRequest) {
	return axios.get<ListDictionaryItemsReply>(
		`${PREFIX_URI_ADMIN_API + URI_DATE_DICTIONARY_API}/items`,
		{
			params: request,
		}
	);
}

export interface CreateDictionaryItemRequest {
	key: string
	type: string
	name: string
	value: string
	sort?: number
	description?: string
}

export interface CreateDictionaryItemReply {
	key: string
	type: string
	name: string
	value: string
	sort?: number
	description?: string
}

export function createDictionaryItem(request: CreateDictionaryItemRequest) {
	return axios.post<CreateDictionaryItemReply>(
		`${PREFIX_URI_ADMIN_API + URI_DATE_DICTIONARY_API}/items/`,
		request
	);
}


export interface UpdateDictionaryItemRequest {
	key: string
	type: string
	name: string
	value: string
	sort?: number
	description?: string
}

export type UpdateDictionaryItemReply = DictionaryItem

export function updateDictionaryItem(request: UpdateDictionaryItemRequest) {
	return axios.put<UpdateDictionaryItemReply>(
		`${PREFIX_URI_ADMIN_API + URI_DATE_DICTIONARY_API}/items/${request.type}/${request.key}`,
		request
	);
}

export interface DeleteDictionaryItemRequest {
	type: string;
	key: string;
}

export interface DeleteDictionaryItemReply {
	type: string;
	key: string;
}

export function deleteDictionaryItem(request: DeleteDictionaryItemRequest) {
	return axios.delete<DeleteDictionaryItemReply>(
		`${PREFIX_URI_ADMIN_API + URI_DATE_DICTIONARY_API}/items/${request.type}/${request.key}`
	);
}

