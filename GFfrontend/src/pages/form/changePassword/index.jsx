import { Card, message } from 'antd';
import ProForm, {
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { history, useRequest, useModel, useIntl } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { changePassword } from '@/services/user';
import styles from './style.less';

const username = history.location.search.substring(1);

const Password = () => {

  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const intl = useIntl();

  const onFinish = async (values) => {
    const oldpassword = values.oldpassword;
    const password = values.newpassword;
    const passwordRepeat = values.passwordRepeat;
    
    if(password === passwordRepeat) {
      const result = await changePassword({
        Username: username,
        Password: oldpassword,
        NewPassword: password,
      });
  
      console.log(result);
  
  
      if(result.code === 200) {
        const defaultChangePasswordMessage = intl.formatMessage({
          id: 'changePassword',
          defaultMessage: 'Password changed successfully!',
        });
        message.success(defaultChangePasswordMessage);
  
        history.push({
          pathname: '/account/settings',
          search: username,
        });
      }
      else {
        const defaultChangePasswordMessage = intl.formatMessage({
          id: 'changePasswordFailed',
          defaultMessage: 'Failed! Please check your old password.',
        });
        message.success(defaultChangePasswordMessage);
      }
    }
    else {
      const defaultChangePasswordFailedMessage = intl.formatMessage({
        id: 'changePasswordFailed',
        defaultMessage: 'New Password doens\'t match, please try again',
      });
      message.success(defaultChangePasswordFailedMessage);
    }
    
  };

  return (
    <PageContainer content="Change password.">
      <Card bordered={false}>
        <ProForm
          hideRequiredMark
          style={{
            margin: 'auto',
            marginTop: 8,
            maxWidth: 600,
          }}
          name="basic"
          layout="vertical"
          initialValues={{
            public: '1',
          }}
          onFinish={onFinish}
        >
          <ProFormText.Password
            width="md"
            label="oldPassword"
            name="oldpassword"
            rules={[
              {
                required: true,
                message: 'Please input old password.',
              },
            ]}
            placeholder=""
          />
          <ProFormText.Password
            width="md"
            label="Password"
            name="newpassword"
            rules={[
              {
                required: true,
                message: 'Please input a new password.',
              },
            ]}
            placeholder=""
          />

          <ProFormText.Password
            label="Repeat password"
            width="md"
            name="passwordRepeat"
            rules={[
              {
                required: true,
                message: 'Please input your new password again.',
              },
            ]}
            placeholder=""
          />
          </ProForm>
      </Card>
    </PageContainer>
  );
};

export default Password;
