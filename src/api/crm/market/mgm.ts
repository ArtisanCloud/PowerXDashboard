import axios from 'axios';
import { PrefixUriAdmin } from '@/api';
import { UriMarket } from '@/api/crm/market/media';
import { PowerModel } from '@/api/common';

export const UriMGM = 'mgm';

export interface MGMConfig extends PowerModel {
  commissionRate1: number;
  commissionRate2: number;
}

export function configMGM(request: MGMConfig) {
  return axios.post<MGMConfig>(
    `${PrefixUriAdmin + UriMarket + UriMGM}/config`,
    request
  );
}

export type fetchMGMConfigReply = MGMConfig;

export function fetchMGMConfig() {
  return axios.get<fetchMGMConfigReply>(
    `${PrefixUriAdmin + UriMarket + UriMGM}/config`
  );
}
