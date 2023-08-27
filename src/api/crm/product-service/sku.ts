import axios from 'axios';
import { PowerModel } from '@/api/common';
import { PrefixUriAdmin } from '@/api';

const UriProduct = '/product';

export interface SKU extends PowerModel {
  uniqueId: string;
  skuNo: string;
  inventory: number;
  productId: number;
  discount: number;
  optionsIds: number[];

  // extends
  unitPrice: number;
  listPrice: number;
  isActive: boolean;
}

export interface ListSKUsPageRequest {
  ids?: number[];
  productId: number;
  pageIndex?: number;
  pageSize?: number;
}

export interface ListSKUsPageReply {
  list: SKU[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listSKUs(request: ListSKUsPageRequest) {
  return axios.get<ListSKUsPageReply>(
    `${PrefixUriAdmin + UriProduct}/skus/page-list`,
    {
      params: request,
    }
  );
}

export interface ConfigSKURequest {
  skus: SKU[];
}
export interface ConfigSKUReply {
  result: boolean;
}

export function configSKU(request: ConfigSKURequest) {
  return axios.post<ConfigSKUReply>(
    `${PrefixUriAdmin + UriProduct}/skus/config`,
    request
  );
}

export type UpdateSKURequest = SKU;

export interface UpdateSKUReply {
  id: number;
}

export function updateSKU(request: UpdateSKURequest) {
  return axios.post<UpdateSKUReply>(
    `${PrefixUriAdmin + UriProduct}/skus/${request.id}`,
    request
  );
}

export interface DeleteSKURequest {
  id: number;
}

export interface DeleteSKUReply {
  id: number;
}

export function deleteSKU(request: DeleteSKURequest) {
  return axios.delete<DeleteSKUReply>(
    `${PrefixUriAdmin + UriProduct}/skus/${request.id}`
  );
}
