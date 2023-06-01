import { PowerModel, PrefixUriAdmin } from '@/api/common';
import axios from 'axios';
import { Payment } from '@/api/crm/trade/payment';
import { Customer } from '@/api/crm/customer-domain/customer';
import UriTrade from '@/api/crm/trade/index';

const UriOrder = '/orders';

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

export interface ListOrderPageRequest {
  ids?: number[];
  likeName?: string;
  storeIds?: number[];
  pageIndex?: number;
  pageSize?: number;
}

export interface ListOrderPageReply {
  list: Order[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listOrders(request: ListOrderPageRequest) {
  return axios.get<ListOrderPageReply>(
    `${PrefixUriAdmin + UriTrade + UriOrder}/page-list`,
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
