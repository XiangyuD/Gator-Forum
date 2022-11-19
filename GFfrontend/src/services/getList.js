import { request } from 'umi';

/* 
query list from homepage;

params: 
1. count: the number of posts listed at once
2. type: 'hottest' or 'latest'
3. groupName: null or a string

return: a list, including [params] posts and each post should have:
1. postid
2. owner name and href of personal center
3. title of the post, href of the post
4. first 30 words of post content
5. create date of the post, latest update time by the owner
6. group name and group link
7. the number of collections, number of likes, number of replies
*/

export async function queryList(body) {
  return request('/api/article/getarticlelist?PageNO='+body.PageNO+'&PageSize='+body.PageSize, {
  //return request('/api/queryList', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    //data: JSON.stringify(body),
    credentials: 'include',
  });
}
