import {
  ContactsOutlined,
  LikeOutlined,
  LoadingOutlined,
  MessageOutlined,
  StarOutlined,
  StarTwoTone,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Form, List, Row, Select, Tag, Tabs } from 'antd';
import React from 'react';
import { useRequest, history } from 'umi';
import ArticleListContent from './articleContent/index';
import { getPersonalCollection, removeCollection } from '@/services/user';
import styles from './style.less';
import { deletePost } from '@/services/groupManagement';
import { useHistoryTravel } from 'ahooks';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 10;
const pageNO = 1;
const username = history.location.search.substring(1);

const Post = () => {
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
  if(typeof(data.ArticleFavorites)!='undefined') {
    const favorites = data.ArticleFavorites;
    const size = Object.keys(favorites).length;
    for(let i=0; i<size; i++) {
      list.push({
        id: favorites.ArticleID,
        
      })
    }
  }

  const IconText = ({ type, text, value }) => {
    const icon = {
      type: type,
      text: text,
      value: value,
    };
    switch (type) {
      case 'star-o':
        return (
          <span>
            <StarTwoTone
              style={{
                marginRight: 8,
              }}
              onClick={(e) => onCollection(icon, e)}
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

      case 'edit-o':
        return (
          <span>
            <EditOutlined
              style={{
                marginRight: 8,
              }}
              onClick={(e) => onEdit(icon, e)}
            />
          </span>
        );
      
      case 'delete-o':
        return (
          <span>
            <DeleteOutlined
              style={{
                marginRight: 8,
              }}
              onClick={(e) => onDelete(icon, e)}
            />
          </span>
        )

      default:
        return null;
    }
  };

  const onCollection = async(values) => {
    console.log(values);
    const id = values.value;
    const result = await removeCollection({
      username: username,
      postid: id,
    });
    if(result.message === 'Ok') {
      location. reload();
    }
    else {
      
    }
  }

  const onDelete = async(values) => {
    const id = values.value;
    const result = await deletePost({
      postid: id,
    });
  }

  const onEdit = async(values) => {
    const id = values.value;
    history.push({
      pathname: '/form/updatePost',
      search: id,
    });
  }

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
              key={item.id}
              actions={[
                <IconText key="collection" type="star-o" value={item.id} text={item.collection} />,
                <IconText key="like" type="like-o" value={item.id} text={item.like} />,
                <IconText key="reply" type="message" value={item.id} text={item.reply} />,
                <IconText key="edit" type="edit-o" value={item.id}/>,
                <IconText key="delete" type="delete-o" value={item.id}/>,
              ]}
              //extra={<div className={styles.listItemExtra} />}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} href={'/group/post?'+item.id}>
                    {item.title}
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

export default Post;
