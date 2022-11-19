/*

A user has:
1. username and password
2. created groups
3. joined groups
4. user profile
5. following user
6. followers
7. likes, collections, replies
8.
*/
const date = new Date();
const titles = [
  'I hold a bow of true ice. I hold my heart.',
  'Heavy winds approaching!',
  'How noble.',
  "Don't you trust me?",
  "You'll see more with your eyes closed.",
  "Let's light it up",
  'Justice is never blind!',
  'Tricky tricky! You got the wrong Neeko!',
  'This is no ordinary instrument. More like an old friend.',
  'To heal and protect.',
];

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
const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];
const contents = [
  "Iceborn warmother of the Avarosan tribe, Ashe commands the most populous horde in the north. Stoic, intelligent, and idealistic, yet uncomfortable with her role as leader, she taps into the ancestral magics of her lineage to wield a bow of True Ice. With her people's belief that she is the mythological hero Avarosa reincarnated, Ashe hopes to unify the Freljord once more by retaking their ancient, tribal lands.",
  "Armed with the power of Runeterra's gales, Janna is a mysterious, elemental wind spirit who protects the dispossessed of Zaun. Some believe she was brought into existence by the pleas of Runeterra's sailors who prayed for fair winds as they navigated treacherous waters and braved rough tempests. Her favor and protection has since been called into the depths of Zaun, where Janna has become a beacon of hope to those in need. No one knows where or when she will appear, but more often than not, she's come to help.",
  'No mortal exemplifies the spiritual traditions of Ionia more than Karma. She is the living embodiment of an ancient soul reincarnated countless times, carrying all her accumulated memories into each new life, and blessed with power that few can comprehend. She has done her best to guide her people in recent times of crisis, though she knows that peace and harmony may come only at a considerable cost—both to her, and to the land she holds most dear.',
  'Innately connected to the latent power of Runeterra, Ahri is a vastaya who can reshape magic into orbs of raw energy. She revels in toying with her prey by manipulating their emotions before devouring their life essence. Despite her predatory nature, Ahri retains a sense of empathy as she receives flashes of memory from each soul she consumes.',
  'The yordle mage Lulu is known for conjuring dreamlike illusions and fanciful creatures as she roams Runeterra with her fairy companion Pix. Lulu shapes reality on a whim, warping the fabric of the world, and what she views as the constraints of this mundane, physical realm. While others might consider her magic at best unnatural, and at worst dangerous, she believes everyone could use a touch of enchantment.',
  "Luxanna Crownguard hails from Demacia, an insular realm where magical abilities are viewed with fear and suspicion. Able to bend light to her will, she grew up dreading discovery and exile, and was forced to keep her power secret, in order to preserve her family's noble status. Nonetheless, Lux's optimism and resilience have led her to embrace her unique talents, and she now covertly wields them in service of her homeland.",
  'Conflicted between her celestial and mortal natures, Morgana bound her wings to embrace humanity, and inflicts her pain and bitterness upon the dishonest and the corrupt. She rejects laws and traditions she believes are unjust, and fights for truth from the shadows of Demacia—even as others seek to repress it—by casting shields and chains of dark fire. More than anything else, Morgana truly believes that even the banished and outcast may one day rise again.',
  'Hailing from a long lost tribe of vastaya, Neeko can blend into any crowd by borrowing the appearances of others, even absorbing something of their emotional state to tell friend from foe in an instant. No one is ever sure where—or who—Neeko might be, but those who intend to do her harm will soon witness her true colors revealed, and feel the full power of her primordial spirit magic unleashed upon them.',
  "Sona is Demacia's foremost virtuoso of the stringed etwahl, speaking only through her graceful chords and vibrant arias. This genteel manner has endeared her to the highborn, though others suspect her spellbinding melodies to actually emanate magic—a Demacian taboo. Silent to outsiders but somehow understood by close companions, Sona plucks her harmonies not only to soothe injured allies, but also to strike down unsuspecting enemies.",
  "A wanderer from the celestial dimensions beyond Mount Targon, Soraka gave up her immortality to protect the mortal races from their own more violent instincts. She endeavors to spread the virtues of compassion and mercy to everyone she meets—even healing those who would wish harm upon her. And, for all Soraka has seen of this world's struggles, she still believes the people of Runeterra have yet to reach their full potential.",
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
]; // 当前用户信息

const groups = [
  'ADC',
  'Support',
  'Support',
  'Assasin',
  'Support',
  'Mage',
  'Support',
  'Mage',
  'Support',
  'Support',
];

const currentUserDetail = {
  name: users[3],
  birthday: '1998-03-18',
  sex: 'Female',
  avatar: avatars[3],
  email: users[3] + '@lol.uni',
  signature: titles[3],
  major: 'Mage',
  country: 'Dermacia',
  province: '',
  city:'',
  grade: 'Difficulty',
  phone: '123456789',
  interests: [
    {
      key: '0',
      label: 'Essence theft',
    },
  ],
  courses: [
    {
      key: '0',
      label: 'Orb of Deception',
    },
    {
      key: '1',
      label: 'Fox-fire',
    },
    {
      key: '2',
      label: 'Charm',
    },
  ],
};


const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req, res) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */

let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return access;
}; // 代码中会兼容本地 service mock 以及部署站点的静态数据

export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': (req, res) => {
    if (!getAccess()) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: 'Please Login!',
        success: true,
      });
      return;
    }

    res.send({
      success: true,
      data: {
        name: 'Silvia',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          {
            key: '0',
            label: '很有想法的',
          },
          {
            key: '1',
            label: '专注设计',
          },
          {
            key: '2',
            label: '辣~',
          },
          {
            key: '3',
            label: '大长腿',
          },
          {
            key: '4',
            label: '川妹子',
          },
          {
            key: '5',
            label: '海纳百川',
          },
        ],
        notifyCount: 12,
        unreadCount: 3,
        country: 'China',
        access: getAccess(),
        geographic: {
          province: {
            label: '浙江省',
            key: '330000',
          },
          city: {
            label: '杭州市',
            key: '330100',
          },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',
      },
    });
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/user/login': async (req, res) => {
    console.log(req.body);
    const { password, username, type } = req.body; 
    await waitTime(2000);

    if (password === 'ant.design' && username === 'admin') {
      res.send({
        status: 'ok',
        code: 200,
        type,
        currentAuthority: 'admin',
        Nickname: 'Tommy',
      });
      access = 'admin';
      return;
    }

    if (password === 'ant.design' && username === 'user') {
      res.send({
        status: 'ok',
        code: 200,
        type,
        currentAuthority: 'user',
      });
      access = 'user';
      return;
    }

    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      access = 'admin';
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
    access = 'guest';
  },
  'POST /api/login/outLogin': (req, res) => {
    access = '';
    res.send({
      data: {},
      success: true,
    });
  },
  'POST /api/register': (req, res) => {
    res.send({
      status: 'ok',
      currentAuthority: 'user',
      success: true,
    });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Forbidden',
      message: 'Forbidden',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'POST /api/checkMember': (req, res) => {
    res.send({
      message: 'Ok',
    });
  },

  'POST /api/quitGroup': (req, res) => {
    res.send({
      message: 'Ok',
    });
  },

  'POST /api/joinGroup': (req, res) => {
    res.send({
      message: 'Ok',
    });
  },

  'GET  /api/currentUserDetail': (req, res) => {
    return res.json({
      data: currentUserDetail,
    });
  },

  'GET /api/getPersonalCollection': (req, res) => {
    const result = [];
    for(let i=0; i<10; i++) {
      result.push({
        id: i,
        owner: users[i % 10],
        title: titles[i % 10],
        logo: avatars[i % 10],
        group: groups[i % 10],
        updatedAt: date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate(),
        collection: Math.ceil(Math.random() * 100) + 100,
        like: Math.ceil(Math.random() * 100) + 100,
        reply: Math.ceil(Math.random() * 10) + 10,
        content: contents[i % 10],
      });
    }
    return res.json({
      data: {
        list: result,
      },
    });
  },

  'GET  /api/getPersnalFollower': (req, res) => {
    const result = [];
    for(let i=0; i<10; i++) {
      result.push({
        avatar: avatars[i % 10],
        user: users[i %  10],
      });
    }
    return res.json({
      data: {
        list: result,
      }
    });
  },

  'GET  /api/getPersonalFollowing': (req, res) => {
    const result = [];
    for(let i=0; i<10; i++) {
      result.push({
        avatar: avatars[i % 10],
        user: users[i %  10],
      });
    }
    return res.json({
      data: {
        list: result,
      }
    });
  },

  'GET  /api/getPersonalBlacklist': (req, res) => {
    const result = [];
    for(let i=0; i<10; i++) {
      result.push({
        avatar: avatars[i % 10],
        user: users[i %  10],
      });
    }
    return res.json({
      data: {
        list: result,
      }
    });
  },

  'POST /api/removeFollower': (req, res) => {
    return res.json({
      message: 'Ok',
    });
  },

  'POST /api/removeFollowing': (req, res) => {
    return res.json({
      message: 'Ok',
    });
  },

  'POST /api/removeBlacklist': (req, res) => {
    return res.json({
      message: 'Ok',
    });
  },

  'POST /api/changePassword': (req, res) => {
    return res.json({
      message: 'Ok',
    });
  },

  'POST /api/removeCollection': (req, res) => {
    return res.json({
      message: 'Ok',
    });
  },

  'POST /api/removeLike': (req, res) => {
    return res.json({
      message: 'Ok',
    });
  },

  'GET /api/getRelation': (req, res) => {
    const result = {
      like: '1',
      collect: '1',
    }
    return res.json({
      data:{
        list: result,
      }
    });
  }
};
