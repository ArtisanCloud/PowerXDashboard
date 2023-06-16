import axios from 'axios';
import { PowerModel, PrefixUriAdmin } from '@/api/common';
import { UriProduct } from '@/api/crm/product-service/product';

export interface PriceBookEntrySpecific {
  inventory: number;
  weight: number;
  volume: number;
  encode: string;
  barCode: string;
  extra: string;
}

export interface PriceBookEntry extends PowerModel {
  priceBookId: number;
  productId: number;
  skuId: number;
  unitPrice: number;
  listPrice: number;
  isActive: boolean;
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

export function createPriceBookEntry(request: PriceBookEntry) {
  return axios.post<PriceBookEntry>(
    `${PrefixUriAdmin + UriProduct}/price-book-entries`,
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
