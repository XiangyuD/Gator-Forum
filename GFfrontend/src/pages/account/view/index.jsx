import { CalendarOutlined, PlusOutlined, HomeOutlined, ContactsOutlined, ClusterOutlined, PhoneOutlined, MailOutlined, WomanOutlined, ManOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Input, Row, Tag, message, Button } from 'antd';
import React, { useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Link, useRequest, history, useModel, useIntl } from 'umi';
import Follower from './components/Follower';
import Following from './components/Following';
import { addFollowing, queryCurrent, removeFollower, removeFollowing, addBlacklist, removeBlacklist } from '@/services/user';
import styles from './Center.less';
import { domainToASCII } from 'url';

/*other user's view of a user*/

const username = history.location.search.substring(1);

const operationTabList = [
  {
    key: 'follower',
    tab: (
      <span>
        Follower{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
        </span>
      </span>
    ),
  },
  {
    key: 'following',
    tab: (
      <span>
        Following{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
        </span>
      </span>
    ),
  },
];

const Center = () => {
  const [tabKey, setTabKey] = useState('follower'); //  获取用户信息
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const intl = useIntl();

  const { data, loading } = useRequest(
    async() => {
      const result = await queryCurrent({
        username: currentUser.name,
        target: username,
      });
      return result;
    },
    {
      formatResult: result => result,
    }
  ); //  渲染用户信息
  
  console.log(data);
  let visitedUser = [];
  if(typeof(data) != 'undefined') {
    const info = data.userInfo;
    visitedUser = {
      name: info.Username,
      birthday: info.Birthday.substring(0,10),
      email: info.Username+"@ufl.edu",
      gender: info.Gender,
      major: info.Department,
      avatar: 'http://167.71.166.120:8001/resources/userfiles/'+ info.Username+'/avatar.png',
      country: 'U.S',
      province: 'Florida',
      city: 'Gainesville',
      isFollowed: data.isFollowed,
      isFollowother: data.isFollowother,
    };
  }

  const unfollow = async() => {
    const result = await removeFollowing({
      username: visitedUser.name,
    });
    if(result.code === 200) {
      const defaultunfollowMessage = intl.formatMessage({
        id: 'unfollow',
        defaultMessage: 'Unfollowed!',
      });
      message.success(defaultunfollowMessage);
      location.reload();
    }
    else {
      message.error("Failed! Please try again.");
    }
  }

  const follow = async() => {
    const result = await addFollowing({
      username: visitedUser.name,
    });
    if(result.code === 200) {
      const defaultfollowMessage = intl.formatMessage({
        id: 'follow',
        defaultMessage: 'Followed!',
      });
      message.success(defaultfollowMessage);
      location.reload();
    }
    else {
      message.error('Failed! Please try again.');
    }
  }

  const onBlock = async () => {
    const result = await addBlacklist({
      username: username,
      visiteduser: visitedUser.name,
    });
    if(result.code === 200) {
      const defaultaddBlacklistMessage = intl.formatMessage({
        id: 'addBlacklist',
        defaultMessage: 'Blocked Successful!',
      });
      message.success(defaultaddBlacklistMessage);
    }
  }

  const removeBlock = () => {
    const result = removeBlacklist({
      username: username,
      visiteduser: visitedUser.name,
    });
    if(result.code === 200) {
      const defaultremoveBlacklistMessage = intl.formatMessage({
        id: 'removeBlacklist',
        defaultMessage: 'Unblocked Successful!',
      });
      message.success(defaultremoveBlacklistMessage);
    }
  }

  const renderButton = ({isFollowed, isFollowother}) => {
    if(isFollowed === true && isFollowother === true) {
      return (
        <div>
          <Button onClick={unfollow}>
            Mutual
          </Button>
          &nbsp;
          {/* <Button onClick={onBlock}>
            Block
          </Button>  */}
        </div>
      );
    }
    if(isFollowother === true) {
      return (
        <div>
          <Button onClick={unfollow}>
            Following
          </Button>
          {/* <Button onClick={onBlock}>
            Block
          </Button>  */}
        </div>
        
      )
    }
    // if(blacklist == true) {
      // return (
      //   <Button onClick={removeBlock}>
      //     Blocked
      //   </Button> 
      // )
    // }
    else {
      return (
        <div>
          <Button onClick={follow}>
            Follow
          </Button>
          {/* <Button onClick={onBlock}>
            Block
          </Button>  */}
        </div>

      )
    }
  }

  const renderGender = ({gender}) => {
    if(gender === 'Female') {
      return (
        <WomanOutlined/>
      );
    }
    else if(gender === 'Male') {
      return (
        <ManOutlined/>
      );
    }
    else {
      return;
    }
  }



  const renderUserInfo = ({ birthday, gender, email, major, grade, country, province, city, phone }) => {
    if(gender === 'Female') {
      return (
        <div className={styles.detail}>
          <p>
            <CalendarOutlined
              style={{
                marginRight: 8,
              }}
            />
            {birthday+'    '}
            <WomanOutlined/>
          </p>
          
          <p>
            <MailOutlined
              style={{
                marginRight: 8,
              }}
            />
            {email}
          </p>
          {/* <p>
            <PhoneOutlined
              style={{
                marginRight: 8,
              }}
            />
            {phone} 
          </p> */}
          <p>
            <ClusterOutlined
              style={{
                marginRight: 8,
              }}
            />
            {major+' '}{grade} 
          </p>
          <p>
            <HomeOutlined
              style={{
                marginRight: 8,
              }}
            />
            {country+' '}{province+' '}{city}
          </p>
        </div>
      );
    }
    else if (gender === 'Male') {
      return (
        <div className={styles.detail}>
          <p>
            <CalendarOutlined
              style={{
                marginRight: 8,
              }}
            />
            {birthday+'    '} 
            <ManOutlined/>
          </p>
          
          <p>
            <MailOutlined
              style={{
                marginRight: 8,
              }}
            />
            {email}
          </p>
          {/* <p>
            <PhoneOutlined
              style={{
                marginRight: 8,
              }}
            />
            {phone} 
          </p> */}
          <p>
            <ClusterOutlined
              style={{
                marginRight: 8,
              }}
            />
            {major+' '}{grade} 
          </p>
          <p>
            <HomeOutlined
              style={{
                marginRight: 8,
              }}
            />
            {country+' '}{province+' '}{city}
          </p>
        </div>
      );
    }
    else {
      return (
        <div className={styles.detail}>
          <p>
            <CalendarOutlined
              style={{
                marginRight: 8,
              }}
            />
            {birthday+'    '} 
          </p>
          
          <p>
            <MailOutlined
              style={{
                marginRight: 8,
              }}
            />
            {email}
          </p>
          {/* <p>
            <PhoneOutlined
              style={{
                marginRight: 8,
              }}
            />
            {phone} 
          </p> */}
          <p>
            <ClusterOutlined
              style={{
                marginRight: 8,
              }}
            />
            {major+' '}{grade} 
          </p>
          {/* <p>
            <HomeOutlined
              style={{
                marginRight: 8,
              }}
            />
            {country+' '}{province+' '}{city}
          </p> */}
        </div>
      );
    }
  }; // 渲染tab切换

  const renderChildrenByTabKey = (tabValue) => {
    if (tabValue === 'follower') {
      return <Follower />;
    }

    if (tabValue === 'following') {
      return <Following />;
    }

    return null;
  };

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
            loading={loading}
          >
            {!loading && visitedUser && (
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={visitedUser.avatar} />
                  <div className={styles.name}>{visitedUser.name}</div>
                  <div>{visitedUser?.signature}</div>
                  {renderButton(visitedUser)}
                </div>
                {renderUserInfo(visitedUser)}
              </div>
            )}
          </Card>
        </Col>
        <Col lg={17} md={24}>
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

export default Center;
