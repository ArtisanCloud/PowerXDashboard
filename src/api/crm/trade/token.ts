import { PowerModel } from '@/api/common';
import axios from 'axios';
import UriTrade from '@/api/crm/trade/index';
import { Pagination } from '@/types/global';
import { PrefixUriAdmin } from '@/api';

const UriTokenProduct = '/token/products';

export interface TokenProduct extends PowerModel {
  orderId?: number;
  paymentDate?: string;
  paymentType?: number;
  paidAmount?: number;
  paymentNumber?: string;
  referenceNumber?: string;
  status?: number;
}

export interface ListTokenProductPageRequest extends Pagination {
  ids?: number[];
  likeName?: string;
  storeIds?: number[];
}

export interface ListTokenProductPageReply extends Pagination {
  list: TokenProduct[];
}

export function listTokenProducts(request: ListTokenProductPageRequest) {
  return axios.get<ListTokenProductPageReply>(
    `${PrefixUriAdmin + UriTrade + UriTokenProduct}/page-list`,
    {
      params: request,
    },
  );
}

export function createTokenProduct(request: TokenProduct) {
  return axios.post<TokenProduct>(
    `${PrefixUriAdmin + UriTrade + UriTokenProduct}`,
    request,
  );
}

export function updateTokenProduct(request: TokenProduct) {
  return axios.put<TokenProduct>(
    `${PrefixUriAdmin + UriTrade + UriTokenProduct}/${request.id}`,
    request,
  );
}

export interface DeleteTokenProductRequest {
  id: number;
}

export interface DeleteTokenProductReply {
  id: number;
}

export function deleteTokenProduct(request: DeleteTokenProductRequest) {
  return axios.delete<DeleteTokenProductReply>(
    `${PrefixUriAdmin + UriTrade + UriTokenProduct}/${request.id}`,
  );
}
