import {
  ContactsOutlined,
  LikeOutlined,
  LikeTwoTone,
  LoadingOutlined,
  MessageOutlined,
  StarOutlined,
  StarTwoTone,
} from '@ant-design/icons';
import { Button, Card, Col, Form, List, Row, Select, Tag, Tabs } from 'antd';
import React from 'react';
import { useRequest, history } from 'umi';
import ArticleListContent from './articleContent/index';
import { getPersonalCollection, removeCollection } from '@/services/user';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 10;
const pageNO = 1;
const username = history.location.search.substring(1);

const Collection = () => {
  const [form] = Form.useForm();
  const { data, reload, loading, loadMore, loadingMore } = useRequest(
    async() => {
      const result = await getPersonalCollection({
        pageSize: pageSize,
        pageNO: pageNO,
      });
      return result;
    },
    {
      loadMore: true,
      formatResult: result => result,
    },
  );

  console.log(data);

  let list = [];
  if(typeof(data.articleDetails)!='undefined') {
    if(data.articleDetails !== null) list = data.articleDetails;
  }

  const clickPost = (values) => {
    history.push({
      pathname: '/group/post',
      search: values.toString(),
    });
    return;
  }

  const IconText = ({ id, type, text, value }) => {
    switch (type) {
      case 'star-o':
        return (
          <span>
            <StarTwoTone
              style={{
                marginRight: 8,
              }}
              onClick = {e => clickPost(id, e)}
            />
            {text}
          </span>
        );
      case 'like-o':
        if(value === false) {
          return (
            <span>
              <LikeOutlined
                style={{
                  marginRight: 8,
                }}
                onClick = {e => clickPost(id, e)}
              />
              {text}
            </span>
          );
        }
        else {
          return (
            <span>
              <LikeTwoTone
                style={{
                  marginRight: 8,
                }}
                onClick = {e => clickPost(id, e)}
              />
              {text}
            </span>
          );
        }
        

      case 'message':
        return (
          <span>
            <MessageOutlined
              style={{
                marginRight: 8,
              }}
              onClick = {e => clickPost(id, e)}
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
              key={item.ID}
              actions={[
                <IconText key="collection" type="star-o" id={item.ID} value={item.ID} text={item.NumFavorite} />,
                <IconText key="like" type="like-o" id={item.ID} value={item.Liked} text={item.NumLike} />,
                <IconText key="reply" type="message" id={item.ID} value={item.ID} text={item.NumComment} />,
              ]}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} href={'/group/post?'+item.ID}>
                    {item.Title}
                  </a>
                }
              />
              <ArticleListContent data={item} />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default Collection;
