import axios from "axios";
import {PowerModel, PrefixUriAdminApi} from '@/api/common';
import {UriProductApi} from '@/api/crm/product-service/product';


export interface PriceBook extends PowerModel {

	isStandard: boolean
	name: string
	description: string
	storeId: number

}


export interface ListPriceBooksRequest {
	ids?: number[];
	likeName?: string;
	storeIds?: number[];
	pageIndex?: number;
	pageSize?: number;

}

export interface ListPriceBooksReply {
	list: PriceBook[];
	pageIndex: number;
	pageSize: number;
	total: number;
}

export function listPriceBooks(request: ListPriceBooksRequest) {
	return axios.get<ListPriceBooksReply>(
		`${PrefixUriAdminApi + UriProductApi}/price-books/page-list`,
		{
			params: request,
		}
	);
}

export function createPriceBook(request: PriceBook) {
	return axios.post<PriceBook>(
		`${PrefixUriAdminApi + UriProductApi}/price-books`,
		request
	);
}


export interface DeletePriceBookRequest {
	id: number;
}

export interface DeletePriceBookReply {
	id: number;
}

export function deletePriceBook(request: DeletePriceBookRequest) {
	return axios.delete<DeletePriceBookReply>(
		`${PrefixUriAdminApi + UriProductApi}/price-books/${request.id}`
	);
}



