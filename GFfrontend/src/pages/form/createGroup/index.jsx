import { Card, message, Alert, Tabs } from 'antd';
import ProForm, {
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useIntl, history, useRequest, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { createGroup } from '@/services/create';
import styles from './style.less';
import { MaskLayer } from '@antv/l7';

const groupForm = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const intl = useIntl();
  const onFinish = async (values) => {
    const params = {
      Name: values.title,
      Description: values.content,
    };

    try {
      const msg = await createGroup({...params});
      console.log(msg);

      if(msg.code === 200) { //redirect to group page
        const id = msg.new_community_id;
        console.log(id);
        history.push({
          pathname: '/group/content',
          search: msg.new_community_id.toString(),
        });
      }
      else {
        const countMaximum = intl.formatMessage({
          id: 'createGroup.failure.countMaximum',
          defaultMessage: 'You already own 5 groups.',
        });
        message.error(countMaximum);
      }

    }
    catch(error){
      message.error("error");
    }
  };

  return (
    <PageContainer content="">
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
          <ProFormText
            width="md"
            label="Group Name"
            name="title"
            rules={[
              {
                required: true,
                message: 'Please enter a name for your group',
              },
            ]}
            placeholder="Please enter a name for your group"
          />

          <ProFormTextArea
            label="Group Description"
            width="xl"
            name="content"
            rules={[
              {
                required: true,
                message: 'Please enter a description for your group',
              },
            ]}
            placeholder="Please enter a description for your group"
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default groupForm;
