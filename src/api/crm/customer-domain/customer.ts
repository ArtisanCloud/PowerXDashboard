import { PowerModel } from '@/api/common';
import axios from 'axios';
import { Pagination } from '@/types/global';
import { PrefixUriAdmin } from '@/api';

export const UriCustomerDomain = '/customerdomain';

export interface CustomerExternalId {
  openIdInMiniProgram?: string;
  openIdInWeChatOfficialAccount?: string;
  openIdInWeCom?: string;
}

export interface Customer extends PowerModel, CustomerExternalId {
  name: string;
  mobile: string;
  email: string;
  inviterId: number;
  source: number;
  type: number;
  isActivated: boolean;
  inviter?: Customer;
}

export interface ListCustomerPageRequest extends Pagination {
  ids?: number[];
  likeName?: string;
  likeMobile?: string;
  storeIds?: number[];
}

export interface ListCustomerPageReply extends Pagination {
  list: Customer[];
}

export function listCustomers(request: ListCustomerPageRequest) {
  // console.log(request);
  return axios.get<ListCustomerPageReply>(
    `${PrefixUriAdmin + UriCustomerDomain}/customers/page-list`,
    {
      params: request,
    },
  );
}

export function createCustomer(request: Customer) {
  return axios.post<Customer>(
    `${PrefixUriAdmin + UriCustomerDomain}/customers`,
    request,
  );
}

export function updateCustomer(request: Customer) {
  return axios.put<Customer>(
    `${PrefixUriAdmin + UriCustomerDomain}/customers/${request.id}`,
    request,
  );
}

export interface DeleteCustomerRequest {
  id: number;
}

export interface DeleteCustomerReply {
  id: number;
}

export function deleteCustomer(request: DeleteCustomerRequest) {
  return axios.delete<DeleteCustomerReply>(
    `${PrefixUriAdmin + UriCustomerDomain}/customers/${request.id}`,
  );
}
