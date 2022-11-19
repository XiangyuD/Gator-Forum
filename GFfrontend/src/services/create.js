import { request } from 'umi';

export async function createGroup(body) {
  return request('/api/community/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    credentials: 'include',
  });
}

export async function createPost(body) {
  return request('/api/article/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    credentials: 'include',
  });
}
