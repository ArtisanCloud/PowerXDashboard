import { PowerModel, PrefixUriAdmin } from '@/api/common';
import axios from 'axios';

import {
  Customer,
  CustomerExternalId,
  UriCustomerDomain,
} from '@/api/crm/customer-domain/customer';

export interface Lead extends PowerModel, CustomerExternalId {
  name: string;
  mobile: string;
  email: string;
  inviter: Customer;
  inviterId: number;
  source: number;
  type: number;
  isActivated: boolean;
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
    `${PrefixUriAdmin + UriCustomerDomain}/leads/page-list`,
    {
      params: request,
    }
  );
}

export function createLead(request: Lead) {
  return axios.post<Lead>(
    `${PrefixUriAdmin + UriCustomerDomain}/leads`,
    request
  );
}

export function updateLead(request: Lead) {
  return axios.put<Lead>(
    `${PrefixUriAdmin + UriCustomerDomain}/leads/${request.id}`,
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
    `${PrefixUriAdmin + UriCustomerDomain}/leads/${request.id}`
  );
}
