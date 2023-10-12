import axios from 'axios';
import { PowerModel } from '@/api/common';
import { Pagination } from '@/types/global';
import { PrefixUriAdmin } from '@/api';

const UriProduct = '/product';

export interface ProductStatistics extends PowerModel {
  productId: number;
  soldAmount: number;
  inventoryQuantity: number;
  viewCount: number;
  baseSoldAmount: number;
  baseInventoryQuantity: number;
  baseViewCount: number;
}

export type ConfigProductStatisticsRequest = ProductStatistics;
export interface ConfigProductStatisticsReply {
  result: boolean;
}

export function configProductStatistics(
  request: ConfigProductStatisticsRequest,
) {
  return axios.post<ConfigProductStatisticsReply>(
    `${PrefixUriAdmin + UriProduct}/product-statistics/config`,
    request,
  );
}

export interface getProductStatisticsByProductIdRequest {
  productId: number;
}
export type getProductStatisticsByProductIdReply = ProductStatistics;

export function getProductStatisticsByProductId(
  request: getProductStatisticsByProductIdRequest,
) {
  return axios.get<getProductStatisticsByProductIdReply>(
    `${PrefixUriAdmin + UriProduct}/product-statistics/${request.productId}`,
  );
}
