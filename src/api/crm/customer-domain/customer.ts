import { PowerModel, PrefixUriAdminApi } from '@/api/common';
import axios from 'axios';

export const URI_CUSTOMER_DOMAIN_API = '/customer-domain';

export interface CustomerExternalId {
  openIdInMiniProgram: string;
  openIdInWeChatOfficialAccount: string;
  openIdInWeCom: string;
}

export interface Customer extends PowerModel, CustomerExternalId {
  name: string;
  mobile: string;
  email: string;
  inviterId: number;
  source: number;
  type: number;
  isActivated: boolean;
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
  console.log(request);
  return axios.get<ListCustomerPageReply>(
    `${PrefixUriAdminApi + URI_CUSTOMER_DOMAIN_API}/customers/page-list`,
    {
      params: request,
    }
  );
}

export function createCustomer(request: Customer) {
  return axios.post<Customer>(
    `${PrefixUriAdminApi + URI_CUSTOMER_DOMAIN_API}/customers`,
    request
  );
}

export function updateCustomer(request: Customer) {
  return axios.put<Customer>(
    `${PrefixUriAdminApi + URI_CUSTOMER_DOMAIN_API}/customers/${request.id}`,
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
    `${PrefixUriAdminApi + URI_CUSTOMER_DOMAIN_API}/customers/${request.id}`
  );
}
