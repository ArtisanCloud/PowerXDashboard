import { imageAbleInfo, PowerModel, PrefixUriAdmin } from '@/api/common';
import axios from 'axios';
import { UriProduct } from '@/api/crm/product-service/product';
import { MediaSet } from '@/api/mediaresource';

export interface ProductCategory extends PowerModel, imageAbleInfo, MediaSet {
  pId?: number;
  name: string;
  sort?: number;
  viceName?: string;
  description?: string;
  children?: ProductCategory[];
}

export interface GetCategoryTreeRequest {
  id: number;
}

export interface GetCategoryTreeReply {
  tree: ProductCategory[];
}

export function getCategoryTree(request: GetCategoryTreeRequest) {
  return axios.get<GetCategoryTreeReply>(
    `${PrefixUriAdmin + UriProduct}/product-category-tree`,
    {
      params: request,
    }
  );
}

export type CreateCategoryRequest = ProductCategory;

export type CreateCategoryReply = ProductCategory;

export type UpdateCategoryRequest = ProductCategory;
export type UpdateCategoryReply = ProductCategory;

export function createCategory(request: CreateCategoryRequest) {
  return axios.post<CreateCategoryReply>(
    `${PrefixUriAdmin + UriProduct}/product-categories`,
    request
  );
}

export function updateCategory(request: UpdateCategoryRequest) {
  return axios.put<UpdateCategoryReply>(
    `${PrefixUriAdmin + UriProduct}/product-categories/${request.id}`,
    request
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
    `${PrefixUriAdmin + UriProduct}/product-categories/${request.id}`
  );
}
