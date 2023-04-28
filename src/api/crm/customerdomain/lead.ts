import {PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';
import axios from "axios";

import {CustomerExternalId, URI_CUSTOMER_DOMAIN_API} from '@/api/crm/customerdomain/customer';


export interface Lead extends PowerModel, CustomerExternalId {

	name: string,
	mobile: string,
	email: string,
	inviterId: number,
	source: number,
	status: number,

}


export interface ListLeadPageRequest {
	ids?: number[];
	likeName?: string;
	storeIds?: number[];
	pageIndex?: number;
	pageSize?: number;
}

export interface ListLeadPageReply {
	list: Lead[];
	pageIndex: number;
	pageSize: number;
	total: number;
}

export function listLeads(request: ListLeadPageRequest) {
	return axios.get<ListLeadPageReply>(
		`${PREFIX_URI_ADMIN_API + URI_CUSTOMER_DOMAIN_API}/artisans`,
		{
			params: request,
		}
	);
}


export function createLead(request: Lead) {
	return axios.post<Lead>(
		`${PREFIX_URI_ADMIN_API + URI_CUSTOMER_DOMAIN_API}/artisans`,
		request
	);
}


export function updateLead(request: Lead) {
	return axios.put<Lead>(
		`${PREFIX_URI_ADMIN_API + URI_CUSTOMER_DOMAIN_API}/artisans/${request.id}`,
		request
	);
}

export interface DeleteLeadRequest {
	id: number;
}

export interface DeleteLeadReply {
	id: number;
}

export function deleteLead(request: DeleteLeadRequest) {
	return axios.delete<DeleteLeadReply>(
		`${PREFIX_URI_ADMIN_API + URI_CUSTOMER_DOMAIN_API}/artisans/${request.id}`
	);
}


