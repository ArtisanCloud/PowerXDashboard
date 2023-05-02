import axios from "axios";
import {PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';
import {URI_PRODUCT_API} from '@/api/crm/product-service/product';


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
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/price-books/page-list`,
		{
			params: request,
		}
	);
}

export function createPriceBook(request: PriceBook) {
	return axios.post<PriceBook>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/price-books`,
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
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/price-books/${request.id}`
	);
}



