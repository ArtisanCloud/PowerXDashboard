import { PowerModel, PrefixUriAdmin } from '@/api/common';
import axios from 'axios';
import { MediaSet } from '@/api/mediaresource';

export const UriMarket = '/market';
const UriMedia = '/medias';

export const MediaTypeProductShowcase = '_product_showcase'; // 产品展示
export const MediaTypeTutorialDemo = '_tutorial_demo'; // 教程和演示
export const MediaTypeCustomerReviews = '_customer_reviews'; // 买家评价
export const MediaTypeBrandStory = '_brand_story'; // 品牌故事
export const MediaTypePromotionalCampaigns = '_promotional_campaigns'; // 促销活动
export const MediaTypeSocialMediaPromotion = '_social_media_promotion'; // 社交媒体推广
export const MediaTypeTrialSamples = '_trial_samples'; // 试用和样品
export const MediaTypeRecommendations = '_recommendations'; // 推荐和搭配
export const MediaTypeUserGeneratedContent = '_user_generated_content'; // 用户生成内容

export interface Media extends PowerModel, MediaSet {
  title: string;
  subTitle?: string;
  coverImageId?: number;
  resourceUrl?: string;
  description?: string;
  mediaType?: number;
  viewedCount?: number;
}

export interface ListMediaPageRequest {
  ids?: number[];
  likeName?: string;
  storeIds?: number[];
  pageIndex?: number;
  pageSize?: number;
}

export interface ListMediaPageReply {
  list: Media[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listMedias(request: ListMediaPageRequest) {
  return axios.get<ListMediaPageReply>(
    `${PrefixUriAdmin + UriMarket + UriMedia}/page-list`,
    {
      params: request,
    }
  );
}

export function createMedia(request: Media) {
  return axios.post<Media>(`${PrefixUriAdmin + UriMarket + UriMedia}`, request);
}

export function updateMedia(request: Media) {
  return axios.put<Media>(
    `${PrefixUriAdmin + UriMarket + UriMedia}/${request.id}`,
    request
  );
}

export interface DeleteMediaRequest {
  id: number;
}

export interface DeleteMediaReply {
  id: number;
}

export function deleteMedia(request: DeleteMediaRequest) {
  return axios.delete<DeleteMediaReply>(
    `${PrefixUriAdmin + UriMarket + UriMedia}/${request.id}`
  );
}
