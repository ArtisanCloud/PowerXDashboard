import {PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';
import axios from "axios";


export const URI_RESERVATION_CENTER_API = '/reservation-center'

export interface Reservation extends PowerModel {

	storeId: number,
	approvalStatus: string,
	capacity: number,
	copyFromReservationId: number,
	name: string,
	description: string,
	isActive: string,
	status: string,
	startTime: string,
	endTime: string,


}


export interface ListReservationRequest {
	ids?: number[];
	storeId?: number;
	currentDate?: Date;
	pageIndex?: number;
	pageSize?: number;
}

export interface ListReservationReply {
	list: Reservation[];
	pageIndex: number;
	pageSize: number;
	total: number;
}

export function listReservations(request: ListReservationRequest) {
	return axios.get<ListReservationReply>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/schedules`,
		{
			params: request,
		}
	);
}


export function createReservation(request: Reservation) {
	return axios.post<Reservation>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/schedules`,
		request
	);
}


export function updateReservation(request: Reservation) {
	return axios.put<Reservation>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/schedules/${request.id}`,
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
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/schedules/${request.id}`
	);
}


