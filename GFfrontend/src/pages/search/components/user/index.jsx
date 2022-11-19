import { LikeOutlined, LoadingOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, List, Row, Select, Tag, Tabs } from 'antd';
import React from 'react';
import { useRequest, history } from 'umi';
import ArticleListContent from '@/pages/group/content/components/articleContent';
import StandardFormRow from '@/pages/homepage/components/StandardFormRow';
import { searchUser } from '@/services/search';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 10;
const pageNO = 1;
const search = history.location.search.substring(1);

const User = () => {
  const [form] = Form.useForm();
  const { data, reload, loading, loadMore, loadingMore } = useRequest(
    async() => {
      const result = await searchUser({
        PageNo: pageNO,
        PageSize: pageSize,
        SearchWords: search,
      });
      console.log(result);
      return result;
    },
    {
      formatResult: result => result,
      loadMore: true,
    }
  );
  
  console.log(data);
  let list =[];
  if(typeof(data.Users) != 'undefined') {
    if(data.Users!= null) list = data.Users;
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

  const clickUser = async(values) => {
    console.log(values);
    history.push({
      pathname: '/account/view',
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
            <div>
              <p>
              <img src={'http://167.71.166.120:8001/resources/userfiles/'+item.Username+'/avatar.png'} style={{ width: '25px', height: '25px', borderRadius: '25px' }} />
              <a onClick={e => clickUser(item.id,e)}>{item.Username} </a>
              </p>
            </div>
          )}
        />
      </Card>
    </>
  );
};
export default User;