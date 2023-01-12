import {request} from '@umijs/max';

export async function ListConsumer(
    params: API.RequestListConsumer,
    options?: { [key: string]: any },
) {
    return request<API.ResponseListConsumer>(
        '/admin/api/customer/list',
        {
            method: 'GET',
            params: {
                ...params,
            },
            ...(options || {}),
        },
    );
}


