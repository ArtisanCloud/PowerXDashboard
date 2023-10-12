import { PowerModel } from '@/api/common';
import axios from 'axios';
import { Payment } from '@/api/crm/trade/payment';
import { Customer } from '@/api/crm/customer-domain/customer';
import UriTrade from '@/api/crm/trade/index';
import { Pagination } from '@/types/global';
import { RequestOption, UploadRequest } from '@arco-design/web-vue';
import { PrefixUriAdmin } from '@/api';
import { Logistics } from '@/api/crm/trade/logistics';
import { MediaSet } from '@/api/media-resource';

const UriOrder = '/orders';

export const MaxOrderPageSize = 9999;

export interface OrderItem extends PowerModel, MediaSet {
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
  logistics: Logistics;

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
    },
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
    },
  );
}

export function createOrder(request: Order) {
  return axios.post<Order>(`${PrefixUriAdmin + UriTrade + UriOrder}`, request);
}

export function updateOrder(request: Order) {
  return axios.put<Order>(
    `${PrefixUriAdmin + UriTrade + UriOrder}/${request.id}`,
    request,
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
    `${PrefixUriAdmin + UriTrade + UriOrder}/${request.id}`,
  );
}

export interface UploadOrdersReply {
  total: number;
  failed: number;
  ignored: number;
  success: number;
}

export function UploadOrders(option: any) {
  // 处理上传事件的逻辑
  const { fileItem } = option;

  // 自定义上传逻辑
  const formData = new FormData();
  formData.append('resource', fileItem.file);

  // 发送自定义请求
  return axios.post<UploadOrdersReply>(
    `${PrefixUriAdmin + UriTrade}/orders/import`,
    formData,
  );
}

export function uploadOrdersWithTrackingNumbers(
  option: RequestOption,
  onSuccess: (data: any) => void,
): UploadRequest {
  let isAborted = false; // 标记是否中止上传

  const abort = () => {
    isAborted = true; // 设置标记为中止状态
  };

  const uploadPromise = UploadOrders(option)
    .then((result: any) => {
      if (!isAborted) {
        if (result.data) {
          onSuccess(result.data);
          option.onSuccess(result.data);
        } else {
          option.onError(result);
        }
      }
    })
    .catch((error: any) => {
      if (!isAborted) {
        option.onError(error);
      }
    });

  return {
    abort,
    promise: uploadPromise, // 返回上传操作的Promise对象
  };
}
