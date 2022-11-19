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
import StandardFormRow from '@/pages/homepage/components/StandardFormRow';
import ArticleListContent from '../articleContent';
import { getLike } from '@/services/getPost';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 10;
const postid = history.location.search.substring(1);

const Like = () => {
  const [form] = Form.useForm();
  const { data, reload, loading, loadMore, loadingMore } = useRequest(
    async() => {
      const result = await getLike({
        ID: postid,
      });
      return result;
    },
    {
      loadMore: true,
      formatResult: result => result,
    },
  );
  
  console.log(data);
  const list = [];
  if(typeof(data[0])!='undefined') {
    var size = Object.keys(data).length;
    for(let i=0; i<size-1; i++) {
      list.push(data[i]);
    }
  }
  // const list = data?.list || [];
 console.log(list);

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
            <List.Item
              actions={[
                // <IconText key="like" type="like-o" text={item.likes} />,
              ]}
            >
              <ArticleListContent data={item} />
            </List.Item>
            // <div>
            //   <p>
            //   <img src={'http://167.71.166.120:8001/resources/userfiles/'+item.Username+'/avatar.png'} style={{ width: '30px', height: '30px', borderRadius: '30px' }} />
            //   {item.Username}
            //   </p>
            // </div>
          )}
        />
      </Card>
    </>
  );
};

export default Like;
