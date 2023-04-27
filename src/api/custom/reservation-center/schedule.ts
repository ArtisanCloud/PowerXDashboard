import {PowerModel, PREFIX_URI_ADMIN_API} from '@/api/common';
import axios from "axios";
import {URI_RESERVATION_CENTER_API} from "@/api/custom/reservation-center/reservation";


export interface Schedule extends PowerModel {

	storeId: number,
	approvalStatus: string,
	capacity: number,
	copyFromScheduleId: number,
	name: string,
	description: string,
	isActive: string,
	status: string,
	startTime: string,
	endTime: string,


}


export interface ListScheduleRequest {
	ids?: number[];
	storeId?: number;
	currentDate?: Date;
	pageIndex?: number;
	pageSize?: number;
}

export interface ListScheduleReply {
	list: Schedule[];
	pageIndex: number;
	pageSize: number;
	total: number;
}

export function listSchedules(request: ListScheduleRequest) {
	return axios.get<ListScheduleReply>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/schedules`,
		{
			params: request,
		}
	);
}


export function createSchedule(request: Schedule) {
	return axios.post<Schedule>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/schedules`,
		request
	);
}


export function updateSchedule(request: Schedule) {
	return axios.put<Schedule>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/schedules/${request.id}`,
		request
	);
}

export interface DeleteScheduleRequest {
	id: number;
}

export interface DeleteScheduleReply {
	id: number;
}

export function deleteSchedule(request: DeleteScheduleRequest) {
	return axios.delete<DeleteScheduleReply>(
		`${PREFIX_URI_ADMIN_API + URI_RESERVATION_CENTER_API}/schedules/${request.id}`
	);
}


