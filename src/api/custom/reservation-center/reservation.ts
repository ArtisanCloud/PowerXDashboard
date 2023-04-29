import {PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';
import axios from "axios";
import {Artisan} from "@/api/crm/product-service/artisan";
import {Customer} from "@/api/crm/customerdomain/customer";
import {ServiceSpecific} from "@/api/custom/product-service/serviceSpecific";


export const URI_RESERVATION_CENTER_API = '/reservation-center'

export interface Reservation extends PowerModel {
	id: number
	storeId: number,
	approvalStatus: string,
	capacity: number,
	copyFromReservationId: number,
	name: string,
	reservedTime: string
	description: string,
	isActive: string,
	status: string,
	startTime: string,
	endTime: string,
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

