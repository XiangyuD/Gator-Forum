import { request } from 'umi';

/** 登录接口 POST /api/login/account */
export async function login(body, options) {
    console.log(body);
    return request('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }