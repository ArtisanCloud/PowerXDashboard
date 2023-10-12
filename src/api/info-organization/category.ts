import { imageAbleInfo, PowerModel } from '@/api/common';
import axios from 'axios';
import { PrefixUriAdmin } from '@/api';
import { MediaSet } from '@/api/media-resource';
import UriInfoOrganization from '@/api/info-organization';

export const UriCategory = '/categories';

export interface Category extends PowerModel, imageAbleInfo, MediaSet {
  pId?: number;
  name: string;
  sort?: number;
  viceName?: string;
  description?: string;
  children?: Category[];
}

export interface GetCategoryTreeRequest {
  id: number;
}

export interface GetCategoryTreeReply {
  tree: Category[];
}

export function getCategoryTree(request: GetCategoryTreeRequest) {
  return axios.get<GetCategoryTreeReply>(
    `${PrefixUriAdmin + UriInfoOrganization}/category-tree`,
    {
      params: request,
    },
  );
}

export type CreateCategoryRequest = Category;

export type CreateCategoryReply = Category;

export type UpdateCategoryRequest = Category;
export type UpdateCategoryReply = Category;

export function createCategory(request: CreateCategoryRequest) {
  return axios.post<CreateCategoryReply>(
    `${PrefixUriAdmin + UriInfoOrganization + UriCategory}`,
    request,
  );
}

export function updateCategory(request: UpdateCategoryRequest) {
  return axios.put<UpdateCategoryReply>(
    `${PrefixUriAdmin + UriInfoOrganization + UriCategory}/${request.id}`,
    request,
  );
}

export interface DeleteCategoryRequest {
  id: number;
}

export interface DeleteCategoryReply {
  id: number;
}

export function deleteCategory(request: DeleteCategoryRequest) {
  return axios.delete<DeleteCategoryReply>(
    `${PrefixUriAdmin + UriInfoOrganization + UriCategory}/${request.id}`,
  );
}
