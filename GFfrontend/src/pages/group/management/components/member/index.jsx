import { getMember, deleteMember } from '@/services/groupManagement';
import {
    ContactsOutlined,
    LikeOutlined,
    LoadingOutlined,
    MessageOutlined,
    StarOutlined,
  } from '@ant-design/icons';
import { Button, Card, Col, Form, List, Row, Select, Tag, Tabs } from 'antd';
import React from 'react';
import { useRequest, history } from 'umi';
import ArticleListContent from '@/pages/group/content/components/articleContent';
import StandardFormRow from '@/pages/homepage/components/StandardFormRow';
import styles from './style.less';
  
const { Option } = Select;
const FormItem = Form.Item;
const groupID = history.location.search.substring(1);
const pageNo = 1;
const pageSize = 20;
  
const Member = () => {
    const [form] = Form.useForm();
    const { data, reload, loading, loadMore, loadingMore } = useRequest(
      async() => {
        const result = await getMember({
          CommunityID: parseInt(groupID, 10),
          PageNO: pageNo,
          PageSize: pageSize,
        });
        console.log(result);
        return result;
      },
      {
        formatResult: result => result,
        loadMore: true,
      }
    );
  
    let list =[];
    if(typeof(data.Members) != 'undefined') {
      list = data.Members;
    }

    const deleteUser = async (values) => {
      console.log(values);
      const user = values;
      const result = deleteMember({
        user: user,
        group: groupName,
      });
      if(result.message === 'Ok') {
        location.reload();   //refresh page
      }
      else {

      }
    };
  
    const formItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 24,
        },
        md: {
          span: 12,
        },
      },
    };
  
    const loadMoreDom = list.length > 0 && (
      <div
        style={{
          textAlign: 'center',
          marginTop: 16,
        }}
      >
        <Button
          onClick={loadMore}
          style={{
            paddingLeft: 48,
            paddingRight: 48,
          }}
        >
          {loadingMore ? (
            <span>
              <LoadingOutlined /> Loading...
            </span>
          ) : (
            'Load More'
          )}
        </Button>
      </div>
    );
  
    return (
      <>
        <Card
          // style={{
          //   marginTop: 24,
          // }}
          bordered={false}
          // bodyStyle={{
          //   padding: '8px 32px 32px 32px',
          // }}
        >
          <List
            size="large"
            loading={loading}
            rowKey="id"
            itemLayout="vertical"
            loadMore={loadMoreDom}
            dataSource={list}
            renderItem={(item) => (
              <div style={{fontSize: '15px', color: '#4F4F4F'}}>
                <p>
                <img src={'http://167.71.166.120:8001/resources/userfiles/'+item.Member+'/avatar.png'} style={{ width: '25px', height: '25px', borderRadius: '25px' }} />
                <a onClick={e => clickUser(item.name, e)} style={{marginLeft:'15px'}}>{item.Member}</a> joined at {item.JoinDay.substring(0,10)}
                {/* <Button onClick={e => deleteUser(item.Member, e)} style={{float:'right'}}>
                  Delete
                </Button> */}
                </p>
              </div>
            )}
          />
        </Card>
      </>
    );
  };
export default Member;