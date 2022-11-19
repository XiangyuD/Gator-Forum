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
import { history, useRequest } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { fakeSubmitForm } from './service';
import styles from './style.less';

const BasicForm = () => {
  const { run } = useRequest(fakeSubmitForm, {
    manual: true,
    onSuccess: () => {
      //message.success('提交成功');
      history.push('/result/success');
    },
  });

  const onFinish = async (values) => {
    run(values);
  };

  return (
    <PageContainer content="What do you want to share?">
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
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: '请输入标题',
              },
            ]}
            placeholder=""
          />

          <ProFormTextArea
            label="Content"
            width="xl"
            name="goal"
            rules={[
              {
                required: true,
                message: '请输入目标描述',
              },
            ]}
            placeholder=""
          />
          <ProFormRadio.Group
            options={[
              {
                value: '1',
                label: 'Public',
              },
              {
                value: '2',
                label: 'Private',
              },
            ]}
            label="Share with"
            help=""
            name="publicType"
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default BasicForm;
