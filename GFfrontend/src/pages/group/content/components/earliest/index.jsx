import { LikeOutlined, LoadingOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, List, Row, Select, Tag, Tabs } from 'antd';
import React from 'react';
import { useRequest, history } from 'umi';
import ArticleListContent from '@/pages/group/content/components/articleContent';
import StandardFormRow from '@/pages/homepage/components/StandardFormRow';
import { getGroupPosts } from '@/services/getGroupInfo';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 10;
const pageNO = 1;
const groupID = history.location.search.substring(1);

const Earliest = () => {
  const [form] = Form.useForm();
  const { data, reload, loading, loadMore, loadingMore } = useRequest(
    async() => {
      const result = await getGroupPosts({
        id: groupID,
        type: 'lattest',
        pageNO: pageNO,
        pageSize: pageSize,
      });
      return result;
    },
    {
      formatResult: result => result,
      loadMore: true,
    },
  );

  console.log(data);
  const list = [];
  if(typeof(data.ArticleList)!='undefined') {
    const articleList = data.ArticleList;
    const countComment = data.CountComment;
    const countFavorite = data.CountFavorite;
    const countLike = data.CountLike;
    const size = Object.keys(articleList).length;
    for(let i=0; i<size; i++) {
      list.push({
        id: articleList[i].ID,
        name: articleList[i].Username,
        title: articleList[i].Title,
        createdAt: articleList[i].CreateDay,
        content: articleList[i].Content,
        collection: countFavorite[i],
        like: countLike[i],
        reply: countComment[i],
        avatar: 'http://167.71.166.120:8001/resources/userfiles/'+ articleList[i].Username+'/avatar.png',
      });
    }
  }

  //const list = data?.list || [];

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

  const clickPost = async(values) => {
    history.push({
      pathname: '/group/post',
      search: values.toString(),
    });
  }

  return (
    <>
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
              key={item.id}
              actions={[
                <IconText key="collection" type="star-o" text={item.collection} />,
                <IconText key="like" type="like-o" text={item.like} />,
                <IconText key="reply" type="message" text={item.reply} />,
              ]}
              onClick={e => clickPost(item.id, e)}
              //extra={<div className={styles.listItemExtra} />}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} onClick={e => clickPost(item.id, e)}>
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

export default Earliest;
