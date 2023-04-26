import {PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';
import axios from "axios";
import {URI_PRODUCT_API} from '@/api/crm/product-service/product';

export interface ArtisanSpecific {
	Id: number
	
}

export interface Artisan extends PowerModel, ArtisanSpecific {
	employeeId : number,
	name : string,
	level : number,
	gender : string,
	birthday : string,
	phoneNumber : string,
	coverURL : string,
	workNo : string,
	email : string,
	experience : number,
	specialty : string,
	certificate : string,
	address : string

}


export interface ListArtisanPageRequest {
	ids?: number[];
	likeName?: string;
	storeIds?: number[];
	pageIndex?: number;
	pageSize?: number;
}

export interface ListArtisanPageReply {
	list: Artisan[];
	pageIndex: number;
	pageSize: number;
	total: number;
}

export function listArtisans(request: ListArtisanPageRequest) {
	return axios.get<ListArtisanPageReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/artisans`,
		{
			params: request,
		}
	);
}


export function createArtisan(request: Artisan) {
	return axios.post<Artisan>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/artisans`,
		request
	);
}


export function updateArtisan(request: Artisan) {
	return axios.put<Artisan>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/artisans/${request.id}`,
		request
	);
}

export interface DeleteArtisanRequest {
	id: number;
}

export interface DeleteArtisanReply {
	id: number;
}

export function deleteArtisan(request: DeleteArtisanRequest) {
	return axios.delete<DeleteArtisanReply>(
		`${PREFIX_URI_ADMIN_API + URI_PRODUCT_API}/artisans/${request.id}`
	);
}


