import {DepartmentOption, imageAbleInfo, PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';
import axios from "axios";
import {URI_PRODUCT_API} from "@/api/crm/product-service/product";


export interface ProductCategory extends PowerModel, imageAbleInfo {
	pId: bigint
	name: string
	sort: number
	viceName: string
	description: string
	children: ProductCategory[]
}


export interface GetCategoryTreeRequest {
	Id: number;

}

export interface GetCategoryTreeReply {
	Tree: ProductCategory[];
}

export function getCategoryTree(request: GetCategoryTreeRequest) {
	return axios.get<GetCategoryTreeReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/product-category-tree`
	);
}

export interface CreateCategoryRequest extends imageAbleInfo {
	pId: bigint
	name: string
	sort: number
	viceName: string
	description: string
}

export interface CreateCategoryReply extends imageAbleInfo {
	pId: bigint
	name: string
	sort: number
	viceName: string
	description: string
}

export function createCategory(request: CreateCategoryRequest) {
	return axios.post<CreateCategoryReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/product-categories`,
		request
	);
}


export interface DeleteCategoryRequest {
	id: number;
}

export interface DeleteCategoryReply {
	id: number;
}

export function deleteCategory(request: DeleteCategoryRequest) {
	return axios.get<DeleteCategoryReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/product-categories/${request.id}`
	);
}



