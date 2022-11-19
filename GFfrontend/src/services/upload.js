import { request } from 'umi';

export async function uploadLogoImg(params) {
    console.log(JSON.stringify(params));
    return request('/api/file/upload', {
      method: 'POST',
      body: params,
      credentials: 'include',
    });
  }