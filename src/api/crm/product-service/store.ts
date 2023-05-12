import {PowerModel, PrefixUriAdminApi} from '@/api/common';
import axios from "axios";
import DataDictionary from "@/store/modules/data-dictionary";
import {UriProductApi} from '@/api/crm/product-service/product';

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
		`${PrefixUriAdminApi + UriProductApi}/stores/page-list`,
		{
			params: request,
		}
	);
}


export function createStore(request: Store) {
	return axios.post<Store>(
		`${PrefixUriAdminApi + UriProductApi}/stores`,
		request
	);
}


export function updateStore(request: Store) {
	return axios.put<Store>(
		`${PrefixUriAdminApi + UriProductApi}/stores/${request.id}`,
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
		`${PrefixUriAdminApi + UriProductApi}/stores/${request.id}`
	);
}


