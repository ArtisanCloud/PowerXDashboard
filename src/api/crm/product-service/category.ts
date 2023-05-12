import {DepartmentOption, imageAbleInfo, PowerModel, PrefixUriAdminApi} from '@/api/common';
import axios from "axios";
import {UriProductApi} from "@/api/crm/product-service/product";


export interface ProductCategory extends PowerModel, imageAbleInfo {
	pId: number
	name: string
	sort: number
	viceName: string
	description: string
	children: ProductCategory[]
}


export interface GetCategoryTreeRequest {
	id: number;


}

export interface GetCategoryTreeReply {
	tree: ProductCategory[];
}

export function getCategoryTree(request: GetCategoryTreeRequest) {
	return axios.get<GetCategoryTreeReply>(
		`${PrefixUriAdminApi + UriProductApi}/product-category-tree`
	);
}

export interface CreateCategoryRequest extends imageAbleInfo {
	pId: number
	name: string
	sort: number
	viceName: string
	description: string
}

export interface CreateCategoryReply extends imageAbleInfo {
	pId: number
	name: string
	sort: number
	viceName: string
	description: string
}

export function createCategory(request: CreateCategoryRequest) {
	return axios.post<CreateCategoryReply>(
		`${PrefixUriAdminApi + UriProductApi}/product-categories`,
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
	return axios.delete<DeleteCategoryReply>(
		`${PrefixUriAdminApi + UriProductApi}/product-categories/${request.id}`
	);
}



