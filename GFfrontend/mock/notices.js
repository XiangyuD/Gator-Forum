const getNotices = (req, res) => {
  res.json({
    data: [
      {
        id: '000000001',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: 'Caroline @Silvia',
        description: 'Hey,look here!',
        datetime: '',
        type: 'notification',
      }, 
      {
        id: '000000006',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: 'Caroline commented you',
        description: 'Cool!',
        datetime: '',
        type: 'message',
        clickClose: true,
      },
      {
        id: '000000009',
        title: 'Caroline liked this comment',
        description: 'So beautiful',
        extra: '',
        status: '',
        type: 'event',
      },
    ],
  });
};

export default {
  'GET /api/notices': getNotices,
};
