import { PowerModel, PrefixUriAdmin } from '@/api/common';
import axios from 'axios';
import UriTrade from '@/api/crm/trade/index';
import { Pagination } from '@/types/global';

const UriPayment = '/payments';

export interface PaymentItem extends PowerModel {
  paymentId: number;
  quantity: number;
  unitPrice: number;
  paymentCustomerName: string;
  bankInformation: string;
  bankResponseCode: string;
  carrierType: string;
  creditCardNumber: string;
  deductMembershipId: string;
  deductionPoint: number;
  invoiceCreateTime: string;
  invoiceNumber: string;
  invoiceTotalAmount: number;
  taxIdNumber: string;
}

export interface Payment extends PowerModel {
  orderId?: number;
  paymentDate?: string;
  paymentType?: number;
  paidAmount?: number;
  paymentNumber?: string;
  referenceNumber?: string;
  status?: number;
  paymentItems?: PaymentItem[];
}

export interface ListPaymentPageRequest extends Pagination {
  ids?: number[];
  likeName?: string;
  storeIds?: number[];
}

export interface ListPaymentPageReply extends Pagination {
  list: Payment[];
}

export function listPayments(request: ListPaymentPageRequest) {
  return axios.get<ListPaymentPageReply>(
    `${PrefixUriAdmin + UriTrade + UriPayment}/page-list`,
    {
      params: request,
    }
  );
}

export function createPayment(request: Payment) {
  return axios.post<Payment>(
    `${PrefixUriAdmin + UriTrade + UriPayment}`,
    request
  );
}

export function updatePayment(request: Payment) {
  return axios.put<Payment>(
    `${PrefixUriAdmin + UriTrade + UriPayment}/${request.id}`,
    request
  );
}

export interface DeletePaymentRequest {
  id: number;
}

export interface DeletePaymentReply {
  id: number;
}

export function deletePayment(request: DeletePaymentRequest) {
  return axios.delete<DeletePaymentReply>(
    `${PrefixUriAdmin + UriTrade + UriPayment}/${request.id}`
  );
}
