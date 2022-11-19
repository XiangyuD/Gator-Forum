import { request } from 'umi';

export async function getGroupPosts(params) {
  //only for created groups, return entire information
  return request('/api/article/getarticlelistbycommunityid?CommunityID='+params.id+'&PageNO='+params.pageNO+'&PageSize='+params.pageSize, {
  //return request('/api/getGroupPosts', {  
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function getCreatedGroup(params) {
  //only return group basic information, number of member,number of lists
  return request('/api/community/getcommunitiesbycreator?username='+params.userName+'&pageNO=1&pageSize=20', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function getJoinedGroup(params) {
  //only return group basic information, group link
  return request('/api/community/getcommunityidbymember?name='+params.name+'&pageNO=1&pageSize=20', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function getGroupBasic(params) {
  //only for created groups, return entire information
  return request('/api/community/getone?id='+params.groupID+'&username='+params.username+'&pageNO='+params.pageNO+'&pageSize='+params.pageSize, {
  //return request('/api/getGroupBasic', {  
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}
