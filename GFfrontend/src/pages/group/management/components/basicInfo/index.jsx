/*
updateGroupInfo, deleteGroup do not work
*/
import React, { useCallback, useRef } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Form, Button, Input, Upload, message } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { ProFormInstance } from '@ant-design/pro-form';
import { useIntl, useRequest, history, useModel } from 'umi';
import { getBasicInfo, updateGroupInfo, deleteGroup } from '@/services/groupManagement';  
import styles from './BaseView.less';
import { result } from 'lodash';


const groupID = history.location.search.substring(1);
// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <>
    <div className={styles.avatar_title}></div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          change your avatar
        </Button>
      </div>
    </Upload>
  </>
);

const BasicInfo = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [form] = Form.useForm();
  const intl = useIntl();

  const { data, loading } = useRequest(
    async() => {
      const result = await getBasicInfo({
          id: groupID,
          username: currentUser.name,
      });
      console.log(result);
      return result;
      },
      {
        formatResult: result => result,
      }
    );
  
  let list =  [];
  console.log(data);
  if(typeof(data) != 'undefined') {
    const community = data.community;
    list = {
      groupId: community.ID,
      owner: community.Creator,
      name: community.Name,
      description: community.Description,
      createdAt: community.CreateDay.substring(0,10),
    };
  }

  const getAvatarURL = () => {
    if (list) {
      if (list.avatar) {
        return list.avatar;
      }
    }
    return '';
  };

  const onFinish = async (values) => {
    console.log(values);
    const result = await updateGroupInfo({
      ID: parseInt(groupID, 10),
      Description: values.description,
    });
    console.log(result);  
    if(result.code === 200) {
      const defaultgroupUpdateMessage = intl.formatMessage({
        id: 'groupUpdate',
        defaultMessage: 'Group Info Updated!',
      });
      message.success(defaultgroupUpdateMessage);
    }
    else {
      const defaultgroupUpdateMessage = intl.formatMessage({
        id: 'groupUpdateFailed',
        defaultMessage: 'Group Info Update Failed! Please try again!',
      });
      message.error(defaultgroupUpdateMessage);
    }
      
  }

  const onDelete = async () => {
    const result = await deleteGroup({ 
      id: groupID,
    });
    console.log(result);
    if(result === 'Delete Successfully') {
      const defaultgroupDeleteMessage = intl.formatMessage({
        id: 'groupDelete',
        defaultMessage: 'Group Deleted!',
      });
      message.success(defaultgroupDeleteMessage);
      history.push({
        pathname:'/account/selectGroups/created',
        search: currentUser.name,
      });
    }
    else {
      const defaultgroupDeleteMessage = intl.formatMessage({
        id: 'groupDeleteFailed',
        defaultMessage: 'Group Info Delete Failed! Please try again!',
      });
      message.error(defaultgroupDeleteMessage);
    }
  };

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            {/*begin change*/}
            <Form layout='vertical' form={form} onFinish={onFinish}>

              <Form.Item 
                label="Group ID" 
                name='id' 
                initialValue={list.groupId} 
              >
                <Input disabled={true} />
              </Form.Item>

              <Form.Item 
                label="Group Owner" 
                name='owner' 
                initialValue={list.owner} 
              >
                <Input disabled={true} />
              </Form.Item>

              <Form.Item 
                label="Group Name" 
                name='name' 
                initialValue={list.name} 
                required
                tooltip='Please input a group name.'
              >
                <Input />
              </Form.Item>

              <Form.Item 
                label="Group Description" 
                name='description' 
                initialValue={list.description} 
                required
                tooltip='Please input group description.'
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item 
                label="Created At" 
                name='createdAt' 
                initialValue={list.createdAt} 
              >
                <Input disabled={true}/>
              </Form.Item>

              <Form.Item>
                <Button htmlType='submit' type='primary'>
                  Update
                </Button>
                <Button type='button' onClick={onDelete}>
                  Delete
                </Button>
              </Form.Item>
              
            </Form>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BasicInfo;
