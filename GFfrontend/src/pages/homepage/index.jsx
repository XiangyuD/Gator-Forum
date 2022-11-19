import { LikeOutlined, LoadingOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, List, Row, Select, Tag } from 'antd';
import React, { useState } from 'react';
import { useRequest, useModel, history } from 'umi';
import ArticleListContent from './components/ArticleListContent';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import { queryList } from '@/services/getList';
import { createLike } from '@/services/user';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 20;
const pageNumber = 1;


const Articles = () => {
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const { data, reload, loading, loadMore, loadingMore } = useRequest(
    async() => {
      const result = await queryList({
        PageNO: pageNumber,
        PageSize: pageSize,
      });
      return result;
    },
    {
      formatResult: result => result,
      loadMore: true,
    }    
  );

  //console.log(data);
  const list = [];
  if(typeof(data.ArticleList)!='undefined') {
    const articleList = data.ArticleList;
    const communityList = data.CommunityList;
    const collection = data.CountFavorite;
    const like = data.CountLike;
    const reply = data.CountComment;
    const size = Object.keys(articleList).length;
    for(let i=0; i<size; i++) {
      let j = size - 1 - i;
      list.push({
        id: articleList[j].ID,
        name: articleList[j].Username,
        title: articleList[j].Title,
        group: communityList[j].Name,
        createdAt: articleList[j].CreateDay,
        content: articleList[j].Content,
        collection: collection[j],
        like: like[j],
        reply: reply[j],
        groupID: communityList[j].ID,
        avatar: 'http://167.71.166.120:8001/resources/userfiles/'+ articleList[j].Username+'/avatar.png',
      });
    }
  }
  console.log(list);

  const IconText = ({ value, type, text }) => {
    switch (type) {
      case 'star-o':
        return (
          <span>
            <StarOutlined
              style={{
                marginRight: 8,
              }}
              onClick = {e => clickPost(value, e)}
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
              onClick = {e => clickPost(value, e)}
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
              onClick = {e => clickPost(value, e)}
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

  const clickPost = (values) => {
    history.push({
      pathname: '/group/post',
      search: values.toString(),
    });
    return;
  }

  return (
    <>
      <Card bordered={false}>
        <Form
          layout="inline"
          form={form}
          initialValues={
            {
              //owner: ['wjh', 'zxx'],
            }
          }
          onValuesChange={reload}
        >
        <TagSelect expandable>
          <TagSelect.Option value="cat1">Sports</TagSelect.Option>
          <TagSelect.Option value="cat2">Professors</TagSelect.Option>
          <TagSelect.Option value="cat3">Courses</TagSelect.Option>
          <TagSelect.Option value="cat4">Daily Life</TagSelect.Option>
          <TagSelect.Option value="cat5">Movies</TagSelect.Option>
        </TagSelect>
        </Form>
      </Card>
      <Card
        style={{
          marginTop: 10,
        }}
        bordered={false}
        bodyStyle={{
          padding: '8px 32px 32px 32px',
        }}
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
                <IconText key="collection" type="star-o" value = {item.id} text={item.collection}  onClick = {e => clickPost(item.id, e)}/>,
                <IconText key="like" type="like-o" value = {item.id} text={item.like} onClick = {e => clickPost(item.id, e)}/>,
                <IconText key="reply" type="message" value = {item.id} text={item.reply} onClick = {e => clickPost(item.id, e)}/>,
              ]}
              style={{marginLeft:'30px', marginRight:'30px'}}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle}  onClick={(e) => clickPost(item.id, e)}>
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

export default Articles;
