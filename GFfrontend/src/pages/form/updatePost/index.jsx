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
import { getPost, updatePost } from '@/services/getPost';
import styles from './style.less';

const postid = history.location.search.substring(1);

const updatePost = () => {

  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const intl = useIntl();

  const {data} = () => useRequest(
    async() => {
      const result = await getPost({
        //username: currentUser.username,
        ID: postid,
      });
      //console.log(result);
      return result;
    },
    {
      formatResult: result => result,
      loadMore: true,
    }
  );

  const list = data || [];

  const onFinish = async (values) => {
    const date = new Date();
    
    const result = updatePost({
      groupName: groupName,
      postid: postid,
      userName: currentUser.name,
      title: values.title,
      content: values.content,
      time: date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate(),
    });

    console.log(result);


    if(result.message === 'Ok') {
      const defaultupdatePostSuccessMessage = intl.formatMessage({
        id: 'updatePost',
        defaultMessage: 'Post updated successfully!',
      });
      message.success(defaultupdatePostSuccessMessage);

      const postid = result.postid;

      history.push({
        pathname: '/group/post',
        search: postid,
      });
    }
    
  };

  return (
    <PageContainer content="Update post.">
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
          onFinish={onFinish}
        >
          <ProFormText
            width="md"
            label="Group Name"
            name="group"
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
            width="md"
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: 'Please input a title for your post.',
              },
            ]}
            placeholder=""
            initialValue={title}
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
            initialValue={content}
          />
          </ProForm>
      </Card>
    </PageContainer>
  );
};

export default updatePost;
