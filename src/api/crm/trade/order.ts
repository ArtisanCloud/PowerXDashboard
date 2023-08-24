import { PowerModel, PrefixUriAdmin } from '@/api/common';
import axios from 'axios';
import { Payment } from '@/api/crm/trade/payment';
import { Customer } from '@/api/crm/customer-domain/customer';
import UriTrade from '@/api/crm/trade/index';
import { Pagination } from '@/types/global';

const UriOrder = '/orders';

export const MaxOrderPageSize = 9999;

export interface OrderItem extends PowerModel {
  orderId: number;
  priceBookEntryId: number;
  customerId: number;
  type: number;
  status: number;
  quantity: number;
  unitPrice: number;
  listPrice: number;
  discount: number;
  coverUrl: string;
  productName: string;
  skuNo: string;
}

export interface Order extends PowerModel {
  customerId?: number;
  paymentType?: number;
  type?: number;
  status: number;
  orderNumber?: string;
  discount?: number;
  listPrice?: number;
  unitPrice?: number;
  comment?: string;
  orderItems?: OrderItem[];
  payments?: Payment[];

  customer?: Customer;
}

export interface ListOrderPageRequest extends Pagination {
  ids?: number[];
  name?: string;
  startAt?: string;
  endAt?: string;
  typeIds?: number[];
  statusIds?: number[];
  storeIds?: number[];
  dates?: Date[];
}

export interface ListOrderPageReply extends Pagination {
  list: Order[];
}

export function listOrders(request: ListOrderPageRequest) {
  return axios.get<ListOrderPageReply>(
    `${PrefixUriAdmin + UriTrade + UriOrder}/page-list`,
    {
      params: request,
    }
  );
}

interface ExportOrdersReply {
  data: string;
  headers: any;
}

export function ExportOrders(request: ListOrderPageRequest) {
  return axios.get<ExportOrdersReply>(
    `${PrefixUriAdmin + UriTrade + UriOrder}/export`,
    {
      params: request,
    }
  );
}

export function createOrder(request: Order) {
  return axios.post<Order>(`${PrefixUriAdmin + UriTrade + UriOrder}`, request);
}

export function updateOrder(request: Order) {
  return axios.put<Order>(
    `${PrefixUriAdmin + UriTrade + UriOrder}/${request.id}`,
    request
  );
}

export interface DeleteOrderRequest {
  id: number;
}

export interface DeleteOrderReply {
  id: number;
}

export function deleteOrder(request: DeleteOrderRequest) {
  return axios.delete<DeleteOrderReply>(
    `${PrefixUriAdmin + UriTrade + UriOrder}/${request.id}`
  );
}
