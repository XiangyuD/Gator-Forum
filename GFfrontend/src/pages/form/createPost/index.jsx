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
import { createPost } from '@/services/create';
import styles from './style.less';
import cookie from "react-cookies";

const groupID = history.location.search.substring(1);

const BasicForm = () => {

  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const intl = useIntl();
  const groupName = cookie.load("groupName");

  const onFinish = async (values) => {
    try {
      console.log(values);   
      const result = await createPost({
        Title: values.title,
        TypeID: 5,
        CommunityID: parseInt(groupID),
        Content: values.content,
      });

      console.log(result);
      

      if(result.message === '200') {
        cookie.remove('groupName');
        cookie.save('groupID', groupID);
        const defaultcreatePostSuccessMessage = intl.formatMessage({
          id: 'createPost',
          defaultMessage: 'Post submitted successfully!',
        });
        message.success(defaultcreatePostSuccessMessage);

        const postid = result.articleID;
        console.log(postid);

        history.push({
          pathname: '/group/post',
          search: postid.toString(),
        });
        return;
      }
      else {
        const defaultcreatePostFailedMessage = intl.formatMessage({
          id: 'createPostFailed',
          defaultMessage: 'Post submitted failed! Please try again.',
        });
        message.error(defaultcreatePostFailedMessage);
        return;
      }
    }catch (error) {
      const defaultcreatePostFailedMessage = intl.formatMessage({
        id: 'createPostFailed',
        defaultMessage: 'Failed!',
      });
      message.error(defaultcreatePostFailedMessage);
    }
    
    
  };

  return (
    <PageContainer content="What's in your mind?">
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
          }}
          onFinish={onFinish}
        >
          <ProFormText
            width="xl"
            label="Group ID"
            name="groupID"
            rules={[
              {
                required: true,
              },
            ]}
            placeholder=""
            initialValue={groupID}
            disabled={true}
          />

          <ProFormText
            width="xl"
            label="Group Name"
            name="groupName"
            rules={[
              {
                required: true,
              },
            ]}
            placeholder=""
            initialValue={groupName}
            disabled={true}
          />

          <ProFormText
            width="xl"
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: 'Please input a title for your post.',
              },
            ]}
            placeholder=""
          />

          <ProFormTextArea
            label="Content"
            width="xl"
            name="content"
            rules={[
              {
                required: true,
                message: 'Please add content for your post.',
              },
            ]}
            placeholder=""
          />
          </ProForm>
      </Card>
    </PageContainer>
  );
};

export default BasicForm;
