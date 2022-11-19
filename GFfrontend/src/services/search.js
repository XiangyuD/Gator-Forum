import { request } from 'umi';

/*
search something: 

input: values is a string

return: most related 10 articles, same properties as /api/queryList
*/

export async function searchArticle(body) {
  return request('/api/article/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    data: body,
  });
}

export async function searchGroup(body) {
  return request('/api/community/getbyname', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    data: body,
  });
}

export async function searchUser(params) {
  return request('/api/user/getusersinfo?username='+params.SearchWords+'&pageNo='+params.PageNo+'&pageSize='+params.PageSize, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}