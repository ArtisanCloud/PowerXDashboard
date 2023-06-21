import axios from 'axios';
import { PowerModel, PrefixUriAdmin } from '@/api/common';

const UriProduct = '/product';

export interface ProductAttribute {
  inventory?: number;
  weight?: number;
  volume?: number;
  encode?: string;
  barCode?: string;
  extra?: string;
}

export interface PriceBookEntry extends PowerModel, ProductAttribute {
  priceBookId: number;
  productId: number;
  skuId?: number;
  unitPrice: number;
  listPrice?: number;
  isActive: boolean;
  // extend
  productName?: string;
  spu?: string;
  skuNo?: string;
  skuEntries?: PriceBookEntry[];
}

export interface ListPriceBookEntriesRequest {
  ids?: number[];
  priceBookId: number;
  productIds?: number[];
  pageIndex?: number;
  pageSize?: number;
}

export interface ListPriceBookEntriesReply {
  list: PriceBookEntry[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listPriceBookEntries(request: ListPriceBookEntriesRequest) {
  return axios.get<ListPriceBookEntriesReply>(
    `${PrefixUriAdmin + UriProduct}/price-book-entries/page-list`,
    {
      params: request,
    }
  );
}

export interface ConfigPriceBookEntryRequest {
  priceBookEntries: PriceBookEntry[];
}

export function configPriceBookEntry(request: ConfigPriceBookEntryRequest) {
  return axios.post<PriceBookEntry[]>(
    `${PrefixUriAdmin + UriProduct}/price-book-entries/config`,
    request
  );
}

export type UpdatePriceBookEntryRequest = PriceBookEntry;

export interface UpdatePriceBookEntryReply {
  id: number;
}

export function updatePriceBookEntry(request: UpdatePriceBookEntryRequest) {
  return axios.post<UpdatePriceBookEntryReply>(
    `${PrefixUriAdmin + UriProduct}/price-book-entries/${request.id}`,
    request
  );
}

export interface DeletePriceBookEntryRequest {
  id: number;
}

export interface DeletePriceBookEntryReply {
  id: number;
}

export function deletePriceBookEntry(request: DeletePriceBookEntryRequest) {
  return axios.delete<DeletePriceBookEntryReply>(
    `${PrefixUriAdmin + UriProduct}/price-book-entries/${request.id}`
  );
}
