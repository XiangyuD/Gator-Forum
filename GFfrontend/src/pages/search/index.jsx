import { LikeOutlined, LoadingOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, List, Row, Select, Tag } from 'antd';
import React, {useState} from 'react';
import { useRequest, history } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import ArticleListContent from '@/pages/homepage/components/ArticleListContent';
import StandardFormRow from '@/pages/homepage/components/StandardFormRow';
import TagSelect from '@/pages/homepage/components/TagSelect';
import { search } from '@/services/search';
import Article from './components/article';
import Group from './components/group';
import User from './components/user';
import styles from './style.less';
import { wrapConstructor } from 'lodash-decorators/utils';

const operationTabList = [
  {
    key: 'article',
    tab: (<span>Article </span>),
  },
  {
    key: 'user',
    tab: (<span>User </span>),
  },
  {
    key: 'group',
    tab: (<span>Group </span>),
  },
];

const searchResults = () => {
  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState('article');

  const renderChildrenByTabKey = (tabValue) => {
    if (tabValue === 'article') {
      return <Article />;
    }

    if (tabValue === 'user') {
      return <User />;
    }

    if (tabValue === 'group') {
      return <Group />;
    }

    return null;
  };
  
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

    return (
      <GridContent key={location.pathname}>
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={(_tabKey) => {
                setTabKey(_tabKey);
              }}
            >
              {renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  };
  
  export default searchResults;
