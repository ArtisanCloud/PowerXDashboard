import axios from 'axios';
import { PowerModel, PrefixUriAdmin } from '@/api/common';

const UriProduct = '/product';

export interface SpecificOption {
  productSpecificId: number;
  name: string;
  isActivated?: boolean;
}

export interface ProductSpecific extends PowerModel {
  productId: number;
  name: string;

  options?: SpecificOption[];
}

export interface ListProductSpecificsRequest {
  ids?: number[];
  productId: number;
  pageIndex?: number;
  pageSize?: number;
}

export interface ListProductSpecificsReply {
  list: ProductSpecific[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listProductSpecifics(request: ListProductSpecificsRequest) {
  return axios.get<ListProductSpecificsReply>(
    `${PrefixUriAdmin + UriProduct}/product-specifics/page-list`,
    {
      params: request,
    }
  );
}

export interface CreateProductSpecificRequest {
  priceBookEntries: ProductSpecific[];
}

export function createProductSpecific(request: CreateProductSpecificRequest) {
  return axios.post<ProductSpecific[]>(
    `${PrefixUriAdmin + UriProduct}/product-specifics/config`,
    request
  );
}

export type UpdateProductSpecificRequest = ProductSpecific;

export interface UpdateProductSpecificReply {
  id: number;
}

export function updateProductSpecific(request: UpdateProductSpecificRequest) {
  return axios.post<UpdateProductSpecificReply>(
    `${PrefixUriAdmin + UriProduct}/product-specifics/${request.id}`,
    request
  );
}

export interface DeleteProductSpecificRequest {
  id: number;
}

export interface DeleteProductSpecificReply {
  id: number;
}

export function deleteProductSpecific(request: DeleteProductSpecificRequest) {
  return axios.delete<DeleteProductSpecificReply>(
    `${PrefixUriAdmin + UriProduct}/product-specifics/${request.id}`
  );
}
