import { PowerModel, PrefixUriAdmin } from '@/api/common';
import axios from 'axios';
import type { ProductCategory } from '@/api/crm/product-service/category';
import { MediaSet } from '@/api/mediaresource';
import {
  PriceBookEntry,
  ProductAttribute,
} from '@/api/crm/product-service/priceBookEntry';
import { ProductSpecific } from '@/api/crm/product-service/productSpeficic';

export const UriProduct = '/product';

export interface DetailImage {
  id: number;
  url: string;
  name: string;
  sort: string;
}

// export interface PriceEntry extends PowerModel {
//   unitPrice: number;
//   listPrice: number;
//   discount: number;
// }

export interface SKU extends PowerModel {
  skuNo: string;
  inventory: number;
  unitPrice: number;
  listPrice: number;
  discount: number;
  optionsIds: number[];
  isActive: boolean;
}

export interface Product extends PowerModel, ProductAttribute, MediaSet {
  name: string;
  spu: string;
  type: number;
  plan: number;
  accountingCategory: string;
  canSellOnline: boolean;
  canUseForDeduct: boolean;
  approvalStatus: number;
  isActivated: boolean;
  description: string;
  allowedSellQuantity: number;
  validityPeriodDays: number;
  salesChannelsItemIds: number[];
  promoteChannelsItemIds: number[];
  saleStartDate: Date;
  saleEndDate: Date;

  // price
  activePriceBookEntry: PriceBookEntry;
  priceBookEntries: PriceBookEntry[];
  skus: SKU[];
  productSpecifics: ProductSpecific[];

  // category
  productCategories: ProductCategory[];
  categoryIds: number[];
}

export interface ListProductPageRequest {
  ids?: number[];
  likeName?: string;
  storeIds?: number[];
  pageIndex?: number;
  pageSize?: number;
}

export interface ListProductPageReply {
  list: Product[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listProducts(request: ListProductPageRequest) {
  return axios.get<ListProductPageReply>(
    `${PrefixUriAdmin + UriProduct}/products/page-list`,
    {
      params: request,
    }
  );
}

export interface GetProductRequest {
  productId: number;
}

export type GetProductReply = Product;

export function getProduct(request: GetProductRequest) {
  return axios.get<GetProductReply>(
    `${PrefixUriAdmin + UriProduct}/products/${request.productId}`
  );
}

export function createProduct(request: Product) {
  return axios.post<Product>(
    `${PrefixUriAdmin + UriProduct}/products`,
    request
  );
}

export function updateProduct(request: Product) {
  return axios.put<Product>(
    `${PrefixUriAdmin + UriProduct}/products/${request.id}`,
    request
  );
}

export interface DeleteProductRequest {
  id: number;
}

export interface DeleteProductReply {
  id: number;
}

export function deleteProduct(request: DeleteProductRequest) {
  return axios.delete<DeleteProductReply>(
    `${PrefixUriAdmin + UriProduct}/products/${request.id}`
  );
}
