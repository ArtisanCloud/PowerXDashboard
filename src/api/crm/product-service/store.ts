import {PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';
import axios from "axios";
import DataDictionary from "@/store/modules/data-dictionary";
import {URI_PRODUCT_API} from '@/api/crm/product-service/product';

export interface Store extends PowerModel {
	name:  string,
	employeeId:  number,
	contactNumber:  string,
	coverURL:  string,
	address:  string,
	longitude:  number,
	latitude:  number,
	artisans:  [],
}


export interface ListStoreRequest {
	ids?: number[];
	likeName?: string;
	storeIds?: number[];
	pageIndex?: number;
	pageSize?: number;
}

export interface ListStoreReply {
	list: Store[];
	pageIndex: number;
	pageSize: number;
	total: number;
}

export function listStores(request: ListStoreRequest) {
	return axios.get<ListStoreReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/stores`,
		{
			params: request,
		}
	);
}


export function createStore(request: Store) {
	return axios.post<Store>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/stores`,
		request
	);
}


export function updateStore(request: Store) {
	return axios.put<Store>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/stores/${request.id}`,
		request
	);
}

export interface DeleteStoreRequest {
	id: number;
}

export interface DeleteStoreReply {
	id: number;
}

export function deleteStore(request: DeleteStoreRequest) {
	return axios.delete<DeleteStoreReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/stores/${request.id}`
	);
}


