// eslint-disable-next-line import/no-extraneous-dependencies
const city = require('./geographic/city.json');

const province = require('./geographic/province.json');

function getProvince(_, res) {
  return res.json({
    data: province,
  });
}

function getCity(req, res) {
  return res.json({
    data: city[req.params.province],
  });
}

function getCurrentUse(req, res) {
  return res.json({
    data: {
      name: 'Silvia',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'Silvia@ufl.edu',
      signature: '',
      title: 'UF23',
      group: 'INS:',
      tags: [
        {
          key: '0',
          label: 'dancing',
        },
        {
          key: '1',
          label: 'traveling',
        },
        {
          key: '2',
          label: 'cooking',
        },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      geographic: {
        province: {
          label: 'FL-Florida',
          key: '110000',
        },
        city: {
          label: 'Gaineville',
          key: '110100',
        },
      },
      address: '330 Newell Dr.',
      phone: '+1-3527918045',
    },
  });
} // 代码中会兼容本地 service mock 以及部署站点的静态数据

export default {
  // 支持值为 Object 和 Array
  'GET  /api/accountSettingCurrentUser': getCurrentUse,
  'GET  /api/geographic/province': getProvince,
  'GET  /api/geographic/city/:province': getCity,
};
