import {PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';
import axios from "axios";
import {Artisan} from "@/api/crm/product-service/artisan";
import {Customer} from "@/api/crm/customer-domain/customer";
import {ServiceSpecific} from "@/api/custom/product-service/serviceSpecific";


export const URI_RESERVATION_CENTER_API = '/reservation-center'

export const ReservationTypesType = "_reservation_type"

export const ReservationTypeOnSite = "_reserved_by_onsite" // 现场预约
export const ReservationTypeOnline = "_reserved_by_online" // 线上预约
export const ReservationTypePhone = "_reserved_by_phone"   // 电话预约

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
	reservedService:  ServiceSpecific,

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


