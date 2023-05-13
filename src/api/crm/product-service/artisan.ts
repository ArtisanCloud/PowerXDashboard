import { PowerModel, PrefixUriAdminApi } from '@/api/common';
import axios from 'axios';
import { UriProductApi } from '@/api/crm/product-service/product';

export interface ArtisanSpecific {
  Id: number;
}

export interface Artisan extends PowerModel, ArtisanSpecific {
  employeeId: number;
  name: string;
  level: number;
  gender: string;
  birthday: string;
  phoneNumber: string;
  coverURL: string;
  workNo: string;
  email: string;
  experience: string;
  specialty: string;
  certificate: string;
  address: string;
}

export interface ListArtisanPageRequest {
  ids?: number[];
  likeName?: string;
  storeIds?: number[];
  pageIndex?: number;
  pageSize?: number;
}

export interface ListArtisanPageReply {
  list: Artisan[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listArtisans(request: ListArtisanPageRequest) {
  return axios.get<ListArtisanPageReply>(
    `${PrefixUriAdminApi + UriProductApi}/artisans`,
    {
      params: request,
    }
  );
}

export function createArtisan(request: Artisan) {
  return axios.post<Artisan>(
    `${PrefixUriAdminApi + UriProductApi}/artisans`,
    request
  );
}

export function updateArtisan(request: Artisan) {
  return axios.put<Artisan>(
    `${PrefixUriAdminApi + UriProductApi}/artisans/${request.id}`,
    request
  );
}

export interface DeleteArtisanRequest {
  id: number;
}

export interface DeleteArtisanReply {
  id: number;
}

export function deleteArtisan(request: DeleteArtisanRequest) {
  return axios.delete<DeleteArtisanReply>(
    `${PrefixUriAdminApi + UriProductApi}/artisans/${request.id}`
  );
}
