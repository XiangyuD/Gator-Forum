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
import ArticleListContent from './ArticleListContent';
import StandardFormRow from '@/pages/homepage/components/StandardFormRow';
import { searchArticle } from '@/services/search';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 10;
const pageNo = 1;
const search = history.location.search.substring(1);
console.log(search);

const Article = () => {
  const [form] = Form.useForm();
  const { data, reload, loading, loadMore, loadingMore } = useRequest(
    async() => {
      const result = await searchArticle({
        PageNo: pageNo,
        PageSize: pageSize,
        SearchWords: search,
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
  if(typeof(data.Articles)!='undefined') {
    if(data.Articles != null) list = data.Articles;
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

  const onPost = async(values) => {
    console.log(values);
    history.push({
      pathname: '/group/post',
      search: values.toString(),
    });
  }

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
              ]}
              //extra={<div className={styles.listItemExtra} />}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} onClick={e => onPost(item.ID,e)}>
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

export default Article;
