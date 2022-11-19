import { getPersonalFollowing, removeFollowing } from '@/services/user';
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
const username = history.location.search.substring(1);
  
const Following = () => {
    const [form] = Form.useForm();
    const { data, reload, loading, loadMore, loadingMore } = useRequest(
      () => {
        return getPersonalFollowing({
          username: username,
        });
      },
      {
        loadMore: true,
      },
    );
  
    const list = data?.list || [];
    console.log(list);

    const onUnfollow = async (values) => {
      console.log(values);
      const user = values;
      const result = await removeFollowing({
        username: username,
        unfollowinguser: user,
      });
      if(result.code === 200) {
        
        message.success("Unfollowed Successfully!");
        location.reload();   //refresh page

      }
      else {
        message.error("Failed! Please try again.");
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
              <div>
                <p>
                <img src={item.avatar} style={{ width: '25px', height: '25px', borderRadius: '25px' }} />
                <a onClick={e => clickUser(item.name, e)} style={{marginLeft:'15px'}}>{item.name}</a>
                </p>
              </div>
            )}
          />
        </Card>
      </>
    );
  };
export default Following;