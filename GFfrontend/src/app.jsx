import { PageLoading } from '@ant-design/pro-layout';
import { history, Link, useModel } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
//mport { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { currentUser as queryCurrentUser } from './services/user';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import cookie from "react-cookies";
import { login } from './services/login';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      //const msg = await queryCurrentUser();
      //return msg;
      // const result = {
      //   name: 'link',
      // }
      const name = cookie.load('username');
      if(typeof(name) === 'undefined') {
        history.push(loginPath);
      }
      else {
        const result = {
          name: name,
        }
        return result;
      }
      
    } catch (error) {
      history.push(loginPath);
    }

    return undefined;
  }; 
  
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    // const currentUser = {
    //   name: 'link',
    // }
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState }) => {
  console.log(initialState);
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history; 
      
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>Others</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
