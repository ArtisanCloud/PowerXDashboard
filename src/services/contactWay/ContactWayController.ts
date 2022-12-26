/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v1/queryUserList */
/** 此处后端没有提供注释 GET /api/v1/queryContactWayGroupList */
export async function QueryContactWayList(params :API.RequestQueryContactWayList) {
  return request<API.ResponseQueryContactWayList>('/admin/api/contactWay/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}