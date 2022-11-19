import { request } from 'umi';

export async function getBasicInfo(params) {
    console.log(params);
    return request('/api/community/getone?id='+params.id+'&username='+params.username+'&pageNO=1&pageSize=20', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
}

export async function getAnalysis(params) {
    return request('/api/getAnalysis', {
        params,
    });
}

export async function getMember(params) {
    console.log(params);
    return request('/api/community/getmember?id='+params.CommunityID+'&pageNO=1&pageSize=20', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
}


export async function getNotification(params) {
    return request('/api/getNotification', {
        params,
    });
}

export async function updateGroupInfo(body) {
    return request('/api/community/update', {
        data: body,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
}

export async function deleteGroup(params) {
    console.log("params");
    return request('/api/community/delete?id='+params.id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
}

export async function deleteMember(params) {
    return request('/api/deleteMember', {
        data: params,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}


export async function deletePost(params) {
    return request('/api/deletePost', {
        data: params,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
