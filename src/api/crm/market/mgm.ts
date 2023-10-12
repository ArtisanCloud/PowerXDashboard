import { PowerModel } from '@/api/common';
import axios from 'axios';
import { Pagination } from '@/types/global';
import { PrefixUriAdmin } from '@/api';
import { UriMarket } from '@/api/crm/market/media';

const UriMGMRule = '/mgms';

export const MGMSceneDirectRecruitment = '_direct_recruitment'; // 产品展示
export const MGMSceneIndirectRecruitment = '_indirect_recruitment'; // 教程和演示
export const MGMSceneTeamPerformanceReward = '_team_performance_reward'; // 买家评价
export const MGMSceneLevelUpgradeReward = '_level_upgrade_reward'; // 品牌故事
export const MGMSceneMonthlyRecruitmentCompetition =
  '_monthly_recruitment_competition'; // 促销活动
export const MGMSceneProductPromotionReward = '_product_promotion_reward'; // 社交媒体推广
export const MGMSceneVIPMemberReward = '_vip_member_reward'; // 试用和样品

export interface MGMRule extends PowerModel {
  name: string;
  commissionRate1: number;
  commissionRate2?: number;
  scene?: number;
  description?: string;
}

export interface ListMGMRulePageRequest extends Pagination {
  ids?: number[];
  likeName?: string;
  storeIds?: number[];
}

export interface ListMGMRulePageReply extends Pagination {
  list: MGMRule[];
}

export function listMGMRules(request: ListMGMRulePageRequest) {
  return axios.get<ListMGMRulePageReply>(
    `${PrefixUriAdmin + UriMarket + UriMGMRule}/page-list`,
    {
      params: request,
    }
  );
}

export function createMGMRule(request: MGMRule) {
  return axios.post<MGMRule>(
    `${PrefixUriAdmin + UriMarket + UriMGMRule}`,
    request
  );
}

export function updateMGMRule(request: MGMRule) {
  return axios.put<MGMRule>(
    `${PrefixUriAdmin + UriMarket + UriMGMRule}/${request.id}`,
    request
  );
}

export interface DeleteMGMRuleRequest {
  id: number;
}

export interface DeleteMGMRuleReply {
  id: number;
}

export function deleteMGMRule(request: DeleteMGMRuleRequest) {
  return axios.delete<DeleteMGMRuleReply>(
    `${PrefixUriAdmin + UriMarket + UriMGMRule}/${request.id}`
  );
}
