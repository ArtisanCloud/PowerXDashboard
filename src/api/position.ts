import axios from 'axios';

/**
 * Position
 * @description 职位管理
 */

export interface Position {
  id: number;
  name: string;
  desc: string;
  level: string;
  roleCodes: string[];
}

export interface CreatePositionRequest {
  name: string;
  desc?: string;
  level: string;
  roleCodes: string[];
}

export interface CreatePositionReply {
  id: number;
}

export function createPosition(request: CreatePositionRequest) {
  return axios.post<CreatePositionReply>(
    '/api/v1/admin/position/positions',
    request
  );
}

export interface PatchPositionRequest {
  id: number;
  name?: string;
  desc?: string;
  level?: string;
  roleCodes?: string[];
}

export type PatchPositionReply = Position;

export function patchPosition(request: PatchPositionRequest) {
  return axios.patch<PatchPositionReply>(
    `/api/v1/admin/position/positions/${request.id}`,
    request
  );
}

export interface DeletePositionRequest {
  id: number;
}

export interface DeletePositionReply {
  id: number;
}

export function deletePosition(request: DeletePositionRequest) {
  return axios.delete<DeletePositionReply>(
    `/api/v1/admin/position/positions/${request.id}`
  );
}

export interface ListPositionsRequest {
  likeName?: string;
}

export interface ListPositionsReply {
  list: Position[];
}

export function listPositions(request: ListPositionsRequest) {
  return axios.get<ListPositionsReply>('/api/v1/admin/position/positions', {
    params: request,
  });
}

export interface GetPositionRequest {
  id: number;
}

export type GetPositionReply = Position;

export function getPosition(request: GetPositionRequest) {
  return axios.get<GetPositionReply>(
    `/api/v1/admin/position/positions/${request.id}`
  );
}
