import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET queryContactWayGroupList */
export async function QueryContactWayGroupList() {
  return request<API.ResponseQueryContactWayGroupList>('/admin/api/contactWay/group/list', {
    method: 'GET',
  });
}


export async function UpdateContactWayGroup(
  data: API.RequestUpdateContactWayGroup,
) {
  return request<API.ResponseUpdateContactWayGroup>(
    '/admin/api/contactWay/group/update',
    {
      method: 'PUT',
      data: data,
    },
  );
}

