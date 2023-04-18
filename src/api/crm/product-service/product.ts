import {imageAbleInfo, PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';
import axios from "axios";

export const URI_PRODUCT_API = '/product'

export interface Product extends PowerModel, imageAbleInfo {
	pId: bigint
	name: string
	sort: number
	viceName: string
	description: string
	children: Product[]
}


export interface GetProductListRequest {
	Id: number;
}

export interface GetProductListReply {
	Tree: Product[];
}

export function getProductList(request: GetProductListRequest) {
	return axios.get<GetProductListReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/products`
	);
}



export function CreateProductRequest(request: Product) {
	return axios.get<GetProductListReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/products`
	);
}


export interface DeleteProductRequest {
	id: number;
}

export interface DeleteProductReply {
	id: number;
}

export function deleteProduct(request: DeleteProductRequest) {
	return axios.get<DeleteProductReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/products/${request.id}`
	);
}


