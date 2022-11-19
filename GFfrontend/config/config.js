// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import { stubFalse } from 'lodash';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: false,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 0,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/form',
      icon: 'form',
      routes: [
        {
          path: '/form',
          redirect: '/form/basic-form',
        },
        {
          icon: 'smile',
          path: '/form/basic-form',
          component: './form/basic-form',
        },
        {
          path: '/form/createGroup',
          component: './form/createGroup',
        },
        {
          name: 'Post',
          path: '/form/createPost',
          component: './form/createPost',
        },
        {
          path: '/form/changePassword',
          component: './form/changePassword',
        },
      ],
    },
    {
      path: '/homepage',
      icon: 'table',
      name: 'home',
      hideInMenu: true,
      routes: [
        {
          path: '/homepage',
          name: 'homepage',
          component: './homepage',
          routes: [
            {
              name: 'Gator',
              path: '/homepage',
              redirect: '/homepage',
            },
          ],
        },
      ],
    },
    {
      name: 'result',
      icon: 'CheckCircleOutlined',
      path: '/result',
      routes: [
        {
          path: '/result',
          redirect: '/result/success',
        },
        {
          name: 'success',
          icon: 'smile',
          path: '/result/success',
          component: './result/success',
        },
        {
          name: 'Group Deleted',
          path: '/result/success/deleteGroup',
          component: './result/success/deleteGroup',
        },
        {
          name: 'fail',
          icon: 'smile',
          path: '/result/fail',
          component: './result/fail',
        },
      ],
    },
    {
      name: 'exception',
      icon: 'warning',
      path: '/exception',
      routes: [
        {
          path: '/exception',
          redirect: '/exception/403',
        },
        {
          name: '403',
          icon: 'smile',
          path: '/exception/403',
          component: './exception/403',
        },
        {
          name: '404',
          icon: 'smile',
          path: '/exception/404',
          component: './exception/404',
        },
        {
          name: '500',
          icon: 'smile',
          path: '/exception/500',
          component: './exception/500',
        },
      ],
    },
    {
      name: 'account',
      icon: 'user',
      path: '/account',
      routes: [
        {
          path: '/account',
          redirect: '/account/center',
        },
        {
          name: 'Personal Center',
          icon: 'smile',
          path: '/account/center',
          component: './account/center',
        },
        {
          path: '/account/view',
          component: './account/view',
        },
        {
          name: 'Settings',
          icon: 'smile',
          path: '/account/settings',
          component: './account/settings',
        },
        {
          name:'Group Management',
          path: '/account/selectGroups/created',
          component:'./account/selectGroups/created',
        },
        {
          name: 'My Groups',
          path: '/account/selectGroups/joined',
          component:'./account/selectGroups/joined',
        },
      ],
    },
    {
      name: ' ',
      path: '/search',
      routes: [
        {
          path: '/search',
          name:' ',
          component: './search',
        },
      ],
    },
    {
      name: 'group',
      path: '/group',
      routes: [
        {
          path: '/group/content',
          component: './group/content',
        },
        {
          path: '/group/post',
          component: './group/post',
        },
        {
          path: '/group/management',
          component: './group/management',
        },
      ],
    },
    {
      name: 'list',
      path: '/list',
      routes: [
        {
          path: '/list/search/articles',
          component: './list/search/articles',
        },
        {
          path: '/list/card-list',
          component: './list/card-list',
        },
      ],
    },
    {
      path: '/',
      redirect: '/homepage',
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'pre'], //'dev'
  //proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
