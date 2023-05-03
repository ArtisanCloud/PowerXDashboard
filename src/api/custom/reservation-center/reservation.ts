import {PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';
import axios from "axios";
import {Artisan} from "@/api/crm/product-service/artisan";
import {Customer} from "@/api/crm/customer-domain/customer";
import {ServiceSpecific} from "@/api/custom/product-service/serviceSpecific";


export const URI_RESERVATION_CENTER_API = '/reservation-center'


export const ReservationTypeOnSite = "_reserved_by_onsite" // 现场预约
export const ReservationTypeOnline = "_reserved_by_online" // 线上预约
export const ReservationTypePhone = "_reserved_by_phone"   // 电话预约


// data dictionary types
export const OperationStatusType = "_operation_status"     // 预约操作字典类型
export const ReservationTypesType = "_reservation_type"    // 预约类型字典类型
export const ReservationStatusType = "_reservation_status" // 预约状态字典类型

// data dictionary items
export const OperationStatusNone = "_none"                    // 无操作
export const OperationStatusCancelling = "_cancelling"        // 取消中
export const OperationStatusCancelled = "_cancelled"          // 已取消
export const OperationStatusCancelFailed = "_cancel_failed"   // 取消失败
export const OperationStatusLateCancelled = "_late_cancelled" // 事后取消
export const OperationStatusAutoCancelled = "_auto_cancelled" // 自动取消
export const OperationStatusNoShow = "_no_show"               // 未到场
export const OperationStatusCheckIn = "_checkin"              // 到场
export const OperationStatusSuccess = "_success"              // 完成服务


export const ReservationStatusDraft = "_draft"         // 状态草稿
export const ReservationStatusConfirmed = "_confirmed" // 预约状态成功
export const ReservationStatusCancelled = "_cancelled" // 预约状态取消
export const ReservationStatusFailed = "_failed"       // 预约状态失败


export interface Reservation extends PowerModel {

	scheduleId: number,
	customerId: number,
	reservedArtisanId: number,
	serviceId: number,
	serviceDuration: number,
	sourceChannelId: number
	type: number,
	reservedTime: string,
	cancelTime: string,
	checkinTime: string,
	description: string,
	consumedPoints: number,
	consumeMembershipId: number,
	operationStatus: number,
	reservationStatus: number,
	reservedCustomer: Customer,
	reservedArtisan: Artisan,
	reservedService: ServiceSpecific,

}


export interface ListReservationRequest {
	scheduleId: number;
}

export interface ListReservationReply {
	list: Reservation[];
}

export function listReservations(request: ListReservationRequest) {
	return axios.get<ListReservationReply>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/reservations`,
		{
			params: request,
		}
	);
}


export function createReservation(request: Reservation) {
	return axios.post<Reservation>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/reservations`,
		request
	);
}


export function updateReservation(request: Reservation) {
	return axios.put<Reservation>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/reservations/${request.id}`,
		request
	);
}

export interface DeleteReservationRequest {
	id: number;
}

export interface DeleteReservationReply {
	id: number;
}

export function deleteReservation(request: DeleteReservationRequest) {
	return axios.delete<DeleteReservationReply>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/reservations/${request.id}`
	);
}


export interface CancelReservationRequest {
	id: number;
}

export interface CancelReservationReply{
	id: number;
	operationStatus: number;
	reservationStatus: number;
}

export function cancelReservation(request: CancelReservationRequest) {
	return axios.post<CancelReservationReply>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/reservations/${request.id}`
	);
}