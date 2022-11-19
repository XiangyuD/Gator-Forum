import { CalendarOutlined, PlusOutlined, HomeOutlined, ContactsOutlined, ClusterOutlined, PhoneOutlined, MailOutlined, WomanOutlined, ManOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Input, Row, Tag } from 'antd';
import React, { useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Link, useRequest, history } from 'umi';
import Follower from './components/Follower';
import Following from './components/Following';
import Collection from './components/Collection';
import Blacklist from './components/Blacklist';
import { queryCurrent } from '@/services/user';
import styles from './Center.less';
import { domainToASCII } from 'url';

const username = history.location.search.substring(1);

const operationTabList = [
  {
    key: 'collection',
    tab: (
      <span>
        Collection{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
        </span>
      </span>
    ),
  },
  // {
  //   key: 'post',
  //   tab: (
  //     <span>
  //       Post{' '}
  //       <span
  //         style={{
  //           fontSize: 14,
  //         }}
  //       >
  //       </span>
  //     </span>
  //   ),
  // },
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
  // {
  //   key: 'blacklist',
  //   tab: (
  //     <span>
  //       Blacklist{' '}
  //       <span
  //         style={{
  //           fontSize: 14,
  //         }}
  //       >
  //       </span>
  //     </span>
  //   ),
  // },
];

const CourseList = ({ tags }) => {
  const ref = useRef(null);
  const [newTags, setNewTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const showInput = () => {
    setInputVisible(true);

    if (ref.current) {
      // eslint-disable-next-line no-unused-expressions
      ref.current?.focus();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...newTags];

    if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
      tempsTags = [
        ...tempsTags,
        {
          key: `new-${tempsTags.length}`,
          label: inputValue,
        },
      ];
    }

    setNewTags(tempsTags);
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className={styles.tags}>
      <div className={styles.tagsTitle}> Courses </div>
      {(tags || []).concat(newTags).map((item) => (
        <Tag key={item.key}>{item.label}</Tag>
      ))}
      {inputVisible && (
        <Input
          ref={ref}
          type="text"
          size="small"
          style={{
            width: 78,
          }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag
          onClick={showInput}
          style={{
            borderStyle: 'dashed',
          }}
        >
          <PlusOutlined />
        </Tag>
      )}
    </div>
  );
};

const InterestList = ({ tags }) => {
  const ref = useRef(null);
  const [newTags, setNewTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const showInput = () => {
    setInputVisible(true);

    if (ref.current) {
      // eslint-disable-next-line no-unused-expressions
      ref.current?.focus();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...newTags];

    if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
      tempsTags = [
        ...tempsTags,
        {
          key: `new-${tempsTags.length}`,
          label: inputValue,
        },
      ];
    }

    setNewTags(tempsTags);
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className={styles.tags}>
      <div className={styles.tagsTitle}> Interests </div>
      {(tags || []).concat(newTags).map((item) => (
        <Tag key={item.key}>{item.label}</Tag>
      ))}
      {inputVisible && (
        <Input
          ref={ref}
          type="text"
          size="small"
          style={{
            width: 78,
          }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag
          onClick={showInput}
          style={{
            borderStyle: 'dashed',
          }}
        >
          <PlusOutlined />
        </Tag>
      )}
    </div>
  );
};

const Center = () => {
  const [tabKey, setTabKey] = useState('collection'); //  获取用户信息

  const { data, loading } = useRequest(
    async() => {
      const result = await queryCurrent({
        username: username,
        target: username,
      });
      return result;
    },
    {
      formatResult: result => result,
    }
  ); //  渲染用户信息
  
  console.log(data);
  let currentUser = [];
  if(typeof(data) != 'undefined') {
    const info = data.userInfo;
    currentUser = {
      name: info.Username,
      birthday: info.Birthday.substring(0,10),
      email: info.Username+'@ufl.edu',
      gender: info.Gender,
      major: info.Department,
      grade: 1,
      avatar: 'http://167.71.166.120:8001/resources/userfiles/'+ info.Username+'/avatar.png',
      country: 'U.S',
      province: 'Florida',
      city: 'Gainesville',
    };
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
          <p>
            <PhoneOutlined
              style={{
                marginRight: 8,
              }}
            />
            {phone} 
          </p>
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
  }; // 渲染tab切换

  const renderChildrenByTabKey = (tabValue) => {
    if (tabValue === 'collection') {
      return <Collection />;
    }

    // if (tabValue === 'post') {
    //   return <Post />;
    // }

    if (tabValue === 'follower') {
      return <Follower />;
    }

    if (tabValue === 'following') {
      return <Following />;
    }

    // if (tabValue == 'blacklist') {
    //   return <Blacklist />
    // }

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
            {!loading && currentUser && (
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={currentUser.avatar} />
                  <div className={styles.name}>{currentUser.name}</div>
                  <div>{currentUser?.signature}</div>
                </div>
                {renderUserInfo(currentUser)}
                <Divider dashed />
                <CourseList tags={currentUser.courses || []} />
                <Divider
                  style={{
                    marginTop: 16,
                  }}
                  dashed
                />
                <InterestList tags={currentUser.interests || []} />
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
