import { PowerModel, PrefixUriAdmin } from '@/api/common';
import axios from 'axios';

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

export interface ListCustomerPageRequest {
  ids?: number[];
  likeName?: string;
  likeMobile?: string;
  storeIds?: number[];
  pageIndex?: number;
  pageSize?: number;
}

export interface ListCustomerPageReply {
  list: Customer[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listCustomers(request: ListCustomerPageRequest) {
  // console.log(request);
  return axios.get<ListCustomerPageReply>(
    `${PrefixUriAdmin + UriCustomerDomain}/customers/page-list`,
    {
      params: request,
    }
  );
}

export function createCustomer(request: Customer) {
  return axios.post<Customer>(
    `${PrefixUriAdmin + UriCustomerDomain}/customers`,
    request
  );
}

export function updateCustomer(request: Customer) {
  return axios.put<Customer>(
    `${PrefixUriAdmin + UriCustomerDomain}/customers/${request.id}`,
    request
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
    `${PrefixUriAdmin + UriCustomerDomain}/customers/${request.id}`
  );
}
