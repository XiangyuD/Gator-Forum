import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest, history } from 'umi';
import { getCreatedGroup } from '@/services/getGroupInfo';
import styles from './style.less';
import React, { useCallback } from 'react';

const { Paragraph } = Typography;
// a user can create at most 5 groups
const userName = history.location.search.substring(1);


const CardList = () => {
  const { data, loading } = useRequest(
    async() => {
      const result = await getCreatedGroup({
        userName: userName,
      });
      return result;
    },
    {
      formatResult: result => result,
    }
  );
    
  console.log(data);
  const list = [];
  if(typeof(data) != 'undefined') {
    const communities = data.Communities;
    const members = data.NumberOfMember;
    const posts = data.NumberOfPost;
    const size = Object.keys(communities).length;
    for(let i=0; i<size; i++) {
      list.push({
        id: communities[i].ID,
        groupName: communities[i].Name,
        description: communities[i].Description,
        createdAt: communities[i].CreateDay,
        numberOfMember: members[i],
        numberOfPost: posts[i],
        groupAvatar: 'http://167.71.166.120:8001/resources/groupfiles/'+communities[i].Name+'/avatar.png',
      });
    }
  }

  console.log(list);

  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        Please select a group.
      </p>
    </div>
  );

  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;
      history.push('/form/createGroup');
    },
  );

  const onManagement = async(values) => {
    history.push({
      pathname: '/group/management',
      search: values.toString(),
    });
  }

  const nullData = {};
  return (
    <PageContainer content={content} >
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
          dataSource={[nullData, ...list]}
          renderItem={(item) => {
            if (item && item.id) {
              return (
                <List.Item key={item.id} onClick={(e) => onManagement(item.id, e)}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[<p>Members: {item.numberOfMember}</p>, <p>Posts: {item.numberOfPost}</p>,  <p>{item.createdAt.substring(0,10)}</p>]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.groupAvatar} />}
                      title={<a onClick={(e) => onManagement(item.id, e)}>{item.groupName}</a>}
                      description={
                        <Paragraph
                          className={styles.item}
                          ellipsis={{
                            rows: 2,
                          }}
                        >
                          {item.description}
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }

            return (
              <List.Item>
                <Button type="dashed" className={styles.newButton} key="create" onClick = {onMenuClick}>
                  <PlusOutlined /> Create
                </Button>
              </List.Item>
            );
          }}
        />
      </div>
    </PageContainer>
  );
};

export default CardList;
