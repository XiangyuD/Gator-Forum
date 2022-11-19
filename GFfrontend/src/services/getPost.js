import { request } from 'umi';

export async function getPost(params) {
  //ID: article id
  //username
  return request('/api/article/getone?id='+params.ID+'&currentUser='+params.user, {
  //return request('/api/getPost', {
    //params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function updatePost(params) {
  //ID: article id
  //username
  return request('/api/article/getone?id='+params.ID, {
  //return request('/api/updatePost', {
    //params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function getCollection(params) {
  return request('/api/articlefavorite/getfavoriteofarticle?articleID='+params.ID, {
  //return request('/api/getCollection', {  
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function getReply(params) {
  return request('/api/articlecomment/getbyarticleid?id='+params.ID+"&pageno="+params.PageNO+"&pagesize="+params.PageSize, {
  //return request('/api/getReply', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export async function getLike(params) {
  return request('/api/articlelike/getlikelist?articleID='+params.ID, {
  //return request('/api/getLike', {  
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

