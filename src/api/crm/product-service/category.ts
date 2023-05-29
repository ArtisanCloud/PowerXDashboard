import {
  DepartmentOption,
  imageAbleInfo,
  PowerModel,
  PrefixUriAdmin,
} from '@/api/common';
import axios from 'axios';
import { UriProduct } from '@/api/crm/product-service/product';

export interface ProductCategory extends PowerModel, imageAbleInfo {
  pId?: number;
  name: string;
  sort?: number;
  viceName?: string;
  description?: string;
  children: ProductCategory[];
}

export interface GetCategoryTreeRequest {
  id: number;
}

export interface GetCategoryTreeReply {
  tree: ProductCategory[];
}

export function getCategoryTree(request: GetCategoryTreeRequest) {
  return axios.get<GetCategoryTreeReply>(
    `${PrefixUriAdmin + UriProduct}/product-category-tree`
  );
}

export interface CreateCategoryRequest extends imageAbleInfo {
  pId: number;
  name: string;
  sort: number;
  viceName: string;
  description: string;
}

export interface CreateCategoryReply extends imageAbleInfo {
  pId: number;
  name: string;
  sort: number;
  viceName: string;
  description: string;
}

export function createCategory(request: CreateCategoryRequest) {
  return axios.post<CreateCategoryReply>(
    `${PrefixUriAdmin + UriProduct}/product-categories`,
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
