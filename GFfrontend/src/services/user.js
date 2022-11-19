import { request } from 'umi';

/*
search something: 

input: values is a string

return: most related 10 articles, same properties as /api/queryList
*/

export async function currentUser() {
  return request('/api/user/current', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function logout(values) {
  return request('/api/user/logout', {
    data: values,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}


export async function checkMember(values) {
  return request('/api/checkMember', {
    params: values,
    method: 'POST',
  });
}


export async function quitGroup(values) {
  return request('/api/community/leave/'+values.id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function joinGroup(values) {
  return request('/api/community/join?id='+values.id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function queryCurrent(params) {
  return request('/api/user/getuserinfo?current_username='+params.username+'&target_username='+params.target, {
  //return request('/api/currentUserDetail', {  
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function userUpdate(body) {
  return request('/api/user/update', {
  //return request('/api/currentUserDetail', {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    data: body,
  });
}

export async function getPersonalCollection(params) {
  //return request('/api/getPersonalCollection');
  return request('/api/articlefavorite/get?pageno='+params.pageNO+'&pagesize='+params.pageSize, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}




export async function getPersonalFollower(values) {
  //return request('/api/getPersnalFollower');
  return request('/api/user/followers?username='+values.username, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function removeFollower(values) {  //let someone not follow me
  return request('/api/removeFollower', {
    params: values,
    method: 'POST',
  });
}

export async function getPersonalFollowing(values) {
  //return request('/api/getPersonalFollowing');
  return request('/api/user/followees?username='+values.username, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}
  
export async function removeFollowing(body) {   //not follow someone 
  return request('/api/user/unfollow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    data: body
  });
}

export async function addFollowing(body) {
  return request('/api/user/follow', {
    data: body,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function getPersonalBlacklist(values) {
  return request('/api/getPersonalBlacklist');
}

export async function removeBlacklist(values) {
  return request('/api/removeBlacklist', {
    params: values,
    method: 'POST',
  });
}

export async function addBlacklist(values) {
  return request('/api/addBlacklist', {
    params: values,
    method: 'POST',
  });
}

export async function changePassword(body) {
  return request('/api/user/password', {
    data: body,
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function removeLike(values) {
  return request('/api/articlelike/delete/'+values.id, {
    method: 'POST',
  });
}

export async function createLike(params) {
  return request('/api/articlelike/create/'+params.id, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function removeCollection(values) {
  return request('/api/articlefavorite/delete/'+values.id, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function createCollection(values) {
  return request('/api/articlefavorite/create/'+values.id, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function removeReply(values) {
  return request('/api/removeCollection', {
    params: values,
    method: 'POST',
  });
}

export async function createReply(body) {
  return request('/api/articlecomment/create', {
    data: body,
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


export async function getRelation(values) {
  return request('/api/getRelation', {
  });
}

