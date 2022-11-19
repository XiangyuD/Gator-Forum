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
import ArticleListContent from '@/pages/group/post/components/articleContent';
import StandardFormRow from '@/pages/homepage/components/StandardFormRow';
import { getReply } from '@/services/getPost';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 10;
const postid = history.location.search.substring(1);
const pageNo = 1;

const Reply = () => {
  const [form] = Form.useForm();
  const { data, reload, loading, loadMore, loadingMore } = useRequest(
    async() => {
      const result = await getReply({
        PageNO: pageNo,
        PageSize: pageSize,
        ID: postid,
      });
      return result;
    },
    {
      loadMore: true,
      formatResult: result => result,
    },
  );
  console.log(data)
  const list = data?.ArticleComments || [];
  //const list = data || [];
  //console.log(list);

  const IconText = ({ type, text }) => {
    switch (type) {
      case 'star-o':
        return (
          <span>
            <StarOutlined
              style={{
                marginRight: 8,
              }}
            />
            {text}
          </span>
        );

      case 'like-o':
        return (
          <span>
            <LikeOutlined
              style={{
                marginRight: 8,
              }}
            />
            {text}
          </span>
        );

      case 'message':
        return (
          <span>
            <MessageOutlined
              style={{
                marginRight: 8,
              }}
            />
            {text}
          </span>
        );

      default:
        return null;
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
      <Card bordered={false}>
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
          )}
        />
      </Card>
  );
};

export default Reply;
