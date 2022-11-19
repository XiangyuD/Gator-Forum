import { PlusOutlined, TeamOutlined, CrownOutlined, CalendarOutlined, FormOutlined, FrownOutlined, SmileOutlined  } from '@ant-design/icons';
import { Button, Avatar, Card, Col, Divider, Input, Row, Tag, message } from 'antd';
import React, { useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Link, useRequest, history, useModel } from 'umi';
import Earliest from './components/earliest';
import Latest from './components/latest';
import styles from './Center.less';
import { getGroupBasic } from '@/services/getGroupInfo';
import { checkMember, quitGroup, joinGroup } from '@/services/user';
import { countReset } from 'console';
import cookie from 'react-cookies';


const groupID = history.location.search.substring(1);
console.log(groupID);
const pageNo = 1;
const pageSize = 10;

const operationTabList = [
  {
    key: 'earliest',
    tab: <span>Earliest </span>,
  },
  {
    key: 'latest',
    tab: <span>Latest </span>,
  },
];

const TagList = ({ tags }) => {
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

  return null;
};


const Center = () => {
  const [tabKey, setTabKey] = useState('latest');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  cookie.remove('groupID');
  cookie.save('groupID', groupID);

  const { data, loading } = useRequest( async() => {
    const result = await getGroupBasic({
      groupID: groupID,
      username: currentUser.name,
      pageNO: pageNo,
      pageSize: pageSize,
    });
    return result;
    },
    {
      formatResult: result => result,
      loadMore: true,
    }
  );

  console.log(data);
  let list = [];
  if(typeof(data.community) != 'undefined') {
    const community = data.community;
    list = {
      id: community.ID,
      groupOwner: community.Creator,
      groupName: community.Name,
      groupDescription: community.Description, 
      createdAt: community.CreateDay, 
      groupMember: data.count,
      ifexit: data.ifexit,
      avatar: 'http://167.71.166.120:8001/resources/groupfiles/'+community.Name+'/avatar.png',
    };
  }

  const onJoin = async(values) => {
    const result = await joinGroup({
      id: values,
    });
    if(result === 'Join Successfully') {
      message.success(result);
      location.reload();
    }
    else {
      message.success('Quit Failed! Please try again.');
    }
  };

  const onQuit = async(values) => {
    //console.log(values);
    if(list.groupMember === 1) {
      message.error("You cannot quit the group. If you want to, you could delete this group.");
      return;
    }
    const result = await quitGroup({
      id: values,
    });
    console.log(result);
    if(result === 'Leave Successfully') {
      message.success('Quit Successfully!');
      location.reload();
    }
    else {
      message.success('Quit Failed! Please try again.');
    }
  };

  const onPost = async() => {
    cookie.remove('groupName');
    cookie.save('groupName', list.groupName);
    history.push({
      pathname: '/form/createPost',
      search: groupID,
    })
  };

  const renderGroupInfo = ({id, groupOwner, groupName, groupDescription, createdAt, groupMember, ifexit }) => {
    if(ifexit === true) {
      return (
        <div className={styles.detail}>
          <h1>{groupName}</h1>
          <p style={{fontSize:'15px'}}>{groupDescription}</p>
          <p style={{fontSize:'15px'}}>
            <CrownOutlined
              style={{
                marginRight: 8,
              }}
            />
            {groupOwner}
            <TeamOutlined
              style={{
                marginRight: 8,
                marginLeft: 20,
              }}
            />
            {groupMember}
            <CalendarOutlined
              style={{
                marginRight: 8,
                marginLeft: 20,
              }}
            />
            Created at {createdAt.substring(0,10)}
          </p>
          <Button onClick={e => onQuit(id, e)} style={{display: 'inline-block'}}>
            <FrownOutlined/>
              Quit
          </Button> 
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={onPost} style={{display: 'inline-block'}}>
            <FormOutlined />
            Post
          </Button>
        </div>
      );
    }
    else {
      return (
        <div className={styles.detail}>
          <h1>{groupName}</h1>
          <p style={{fontSize:'15px'}}>{groupDescription}</p>
          <p style={{fontSize:'15px'}}>
            <CrownOutlined
              style={{
                marginRight: 8,
              }}
            />
            {groupOwner}
            <TeamOutlined
              style={{
                marginRight: 8,
                marginLeft: 20,
              }}
            />
            {groupMember}
            <CalendarOutlined
              style={{
                marginRight: 8,
                marginLeft: 20,
              }}
            />
            Created at {createdAt}
          </p>
          <Button onClick={e => onJoin(id, e)}>
            <SmileOutlined/>
              Join
          </Button>
        </div>
      );
    }
    
  };

  // 渲染tab切换

  const renderChildrenByTabKey = (tabValue) => {
    if (tabValue === 'earliest') {
      return <Earliest />;
    }

    if (tabValue === 'latest') {
      return <Latest />;
    }

    return null;
  };

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={24} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
            loading={loading}
          >
            {!loading && list && (
              // <div>
              <div className={styles.avatarHolder}>
                <img
                  alt=""
                  src={list.avatar}
                  style={{ width: '100px', height: '100px', borderRadius: '100px' }}
                />
                {renderGroupInfo(list)}
              </div>
              // {/* </div> */}
            )}
          </Card>

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
