

/*
  i. owner: a owner
  ii. group_name
  iii. groups_avatar: group photo
  iv. description
  v. createdAt: create time
  vi. group id
*/

const avatars = [
    '/heroes/Ashe_0.jpeg',
    '/heroes/Janna_0.jpeg',
    '/heroes/Karma_0.jpeg',
    '/heroes/Ahri_0.jpeg',
    '/heroes/Lulu_0.jpeg',
    '/heroes/Lux_0.jpeg',
    '/heroes/Morgana_0.jpeg',
    '/heroes/Neeko_0.jpeg',
    '/heroes/Sona_0.jpeg',
    '/heroes/Soraka_0.jpeg',
  ];
  const users = [
    'Ashe',
    'Janna',
    'Karma',
    'Ahri',
    'Lulu',
    'Lux',
    'Morgana',
    'Neeko',
    'Sona',
    'Soraka',
  ];

const date = new Date();


function basicInfo(groupName) {
    const result = {
        groupId: 7,
        owner: 'Lux',
        name: groupName,
        avatar: '/heroes/Lux_0.jpeg',
        description: 'Let\'s light it up',
        createdAt: date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
    };
    return result;
}

function getBasicInfo(req, res) {
    const params = req.query;
    const groupName = params.groupName;
    const result = basicInfo(groupName);
    return res.json({
        data: {
            list:result,
        },
    });
}

function analysis(groupName) {

}

function getAnalysis(req, res) {
    const params = req.query;
    const groupName = params.groupName;
    const result = analysis(groupName);
    return res.json({
        data: {
            list:result,
        },
    });
}

function member(groupName) { 
    const result = [];
    for(let i=0; i<10; i++) {
        result.push({
            avatar: avatars[i%10],
            user: users[i%10],
        });
    }
    return result;
}

function getMember(req, res) {
    const params = req.query;
    const groupName = params.groupName;
    const result = member(groupName);
    return res.json({
        data: {
            list:result,
        },
    });
}
 
function notification(groupName) {

}

function getNotification(req, res) {
    const params = req.query;
    const groupName = params.groupName;
    const result = notification(groupName);
    return res.json({
        data: {
            list:result,
        },
    });
}

export default {
    'GET /api/getBasicInfo': getBasicInfo,
    'GET /api/getAnalysis': getAnalysis,
    'GET /api/getMember': getMember,
    'GET /api/getNotification': getNotification,
    'POST /api/updateGroupInfo': async (req, res) => {
        console.log("copy");
        res.send({
          message: 'Ok',
        });
      },
    'POST /api/deleteGroup': async (req, res) => {
        res.send({
          message: 'Ok',
        });
      },
      'POST /api/deleteMember': async (req, res) => {
        res.send({
          message: 'Ok',
        });
      },
  };
  