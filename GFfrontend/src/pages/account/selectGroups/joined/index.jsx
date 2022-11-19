import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest, history } from 'umi';
import { getJoinedGroup } from '@/services/getGroupInfo';
import styles from './style.less';

const { Paragraph } = Typography;
const user = history.location.search.substring(1);


const Joined = () => {
  const { data, loading } = useRequest( async () => {
    const result = await getJoinedGroup({
      name: user,
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
    list = data;
  }

  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        Please select a group.
      </p>
    </div>
  );

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
          dataSource={[ ...list]}
          renderItem={(item) => {
            if (item && item.ID) {
              return (
                <List.Item key={item.ID}>
                  <Card
                    hoverable
                    className={styles.card}
                    //actions={[<p># Group Members: {item.numberOfMember}</p>, <p># Posts: {item.numberOfPost}</p>,  <p>Created At: {item.CreateDay}</p>]}
                    //actions={[<p>Created At: {item.CreateDay}</p>]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={'http://167.71.166.120:8001/resources/groupfiles/'+item.Name+'/avatar.png'} />}
                      title={<p key='group'>{item.Name}</p>}
                      description={
                        <Paragraph
                          className={styles.item}
                          ellipsis={{
                            rows: 3,
                          }}
                        >
                          {item.Description}
                          <p>Created At: {item.CreateDay.substring(0, 10)}</p>
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

export default Joined;
