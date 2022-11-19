import {
  ContactsOutlined,
  LikeOutlined,
  LoadingOutlined,
  MessageOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Typography, Button, Card, Col, Form, List, Row, Select, Tag, Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import { useRequest, history, useModel } from 'umi';
import ArticleListContent from '@/pages/group/content/components/articleContent';
import StandardFormRow from '@/pages/homepage/components/StandardFormRow';
import { searchGroup } from '@/services/search';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 10;
const pageNo = 1;
const search = history.location.search.substring(1);
const { Paragraph } = Typography;


const Group = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const { data, loading } = useRequest( async () => {
    const result = await searchGroup({
      Name: search,
      PageNO: pageNo,
      PageSize: pageSize,
    });
    return result;
  },
  {
    formatResult: result => result,
  }
  );

  console.log(data);
  let list =  [];
  if(typeof(data) != 'undefined') {
    if(data.Communities != null) list = data.Communities;
  }

  const nullData = {};

  const clickUser = (values) => {
    if(values === currentUser.name) {
      history.push({
        pathname: '/account/center',
        search: values,
      });
    }
    else {
      history.push({
        pathname: '/account/view',
        search: values,
      })
    }
  }


  return (
    <PageContainer >
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={[ ...list]}
          renderItem={(item) => {
            if (item && item.ID) {
              return (
                <List.Item key={item.ID}>
                  <Card
                    hoverable
                    className={styles.card}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={'http://167.71.166.120:8001/resources/groupfiles/'+item.Name+'/avatar.png'} />}
                      title={<p key='group' >{item.Name}</p>}
                      description={
                        <Paragraph
                          className={styles.item}
                          ellipsis={{
                            rows: 3,
                          }}
                        >
                          {item.Description}
                    
                          <p> Created At: {item.CreateDay.substring(0,10)}</p>
                        </Paragraph>
                      }
                      onClick={() => {
                        history.push({
                          pathname: '/group/content',
                          search: item.ID.toString(),
                        });
                      }}
                    />
                  </Card>
                </List.Item>
              );
            }

            return (
              <List.Item>
              </List.Item>
            );
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Group;