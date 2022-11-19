import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import cookie from "react-cookies";
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
//import { login } from '@/services/ant-design-pro/api';
import { login } from '@/services/login';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import styles from './index.less';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    console.log('userInfo:');
    console.log(userInfo);
    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values) => {
    console.log(values);
    
    try {
      // 登录
      const msg = await login({ ...values, type }); //后端
      const token = msg.message;
      console.log(token);
      if (msg.code == 200) {
        const userInfo = {
          name: values.username,
        };
        cookie.save('token', token);
        cookie.save('username', values.username);
        //nickname = msg.Nickname;
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        
        console.log(userInfo);
        //await fetchUserInfo(); //successful, wait for user info; this was not implemented
        await setInitialState((s) => ({ ...s, currentUser: userInfo}));
        
        /** 此方法会跳转到 redirect 参数所在的位置 */
        // if (!history) return;
        // const { query } = history.location;
        // const { redirect } = query;
        // history.push(redirect || '/');
        history.push("/homepage");
        return;
      }

      console.log(msg); // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };

  const { code, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="gator" src="/gator_t.jpg" />}
          title="Gator Forum"
          subTitle={intl.formatMessage({
            id: 'pages.layouts.userLayout.title',
          })}
          initialValues={{
            autoLogin: true,
          }}
          actions={[]}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              })}
            />
          </Tabs>

          {code !== 200 && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                //id: 'pages.login.accountLogin.errorMessage',
                id: 'loginFailed',
                defaultMessage: 'Input doesn\'t match our records. Try cat/007',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  //id: 'pages.login.username.placeholder',
                  id:'username empty',
                  defaultMessage: 'Username: cat',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        //id="pages.login.username.required"
                        id="username required"
                        defaultMessage="Please input username!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'password placeholder',
                  defaultMessage: 'Password: 007',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="password required"
                        defaultMessage="Please input password!"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
