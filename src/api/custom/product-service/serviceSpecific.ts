import axios from "axios";
import {PowerModel, PREFIX_URI_ADMIN_API} from "@/api/common";

import {Product, URI_PRODUCT_API} from "@/api/crm/product-service/product";

export interface ServiceSpecific extends PowerModel{
	parentId: number,
	productId: number,
	isFree: boolean,
	name: string,
	duration: number,
	mandatoryDuration: number,
	children: ServiceSpecific[],
	Product: Product
}


export interface ListServiceSpecificRequest {
	ids?: number[];
	likeName?: string;
	pageIndex?: number;
	pageSize?: number;
}

export interface ListServiceSpecificReply {
	list: ServiceSpecific[];
}

export function listServiceSpecifics(request: ListServiceSpecificRequest) {
	return axios.get<ListServiceSpecificReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/service-specifics/page-list`,
		{
			params: request,
		}
	);
}


export function createServiceSpecific(request: ServiceSpecific) {
	return axios.post<ServiceSpecific>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/service-specifics`,
		request
	);
}


export function updateServiceSpecific(request: ServiceSpecific) {
	return axios.put<ServiceSpecific>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/service-specifics/${request.id}`,
		request
	);
}

export interface DeleteServiceSpecificRequest {
	id: number;
}

export interface DeleteServiceSpecificReply {
	id: number;
}

export function deleteServiceSpecific(request: DeleteServiceSpecificRequest) {
	return axios.delete<DeleteServiceSpecificReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/service-specifics/${request.id}`
	);
}

