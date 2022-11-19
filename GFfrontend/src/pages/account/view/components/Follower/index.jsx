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
import { getPersonalFollower, removeFollower } from '@/services/user';
  
const { Option } = Select;
const FormItem = Form.Item;
const username = history.location.search.substring(1);
console.log(username);
  
const Follower = () => {
    const [form] = Form.useForm();
    const { data, reload, loading, loadMore, loadingMore } = useRequest(
      async() => {
        const result = await getPersonalFollower({
          username: username,
        });
        return result;
      },
      {
        formatResult: result => result,
        loadMore: true,
      },
    );
  
    console.log(data);
    let list = [];
    if(typeof(data.Users) != 'undefined' && data.Users != null) {
      const users = data.Users;
      const size = Object.keys(users).length;
      for(let i=0; i<size; i++) {
        list.push({
          name: users[i],
          avatar: 'http://167.71.166.120:8001/resources/userfiles/'+ users[i]+'/avatar.png',
        });
      }
    }

    const onRemove = async (values) => {
      console.log(values);
      const user = values;
      const result = await removeFollower({
        username: username,
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
export default Follower;