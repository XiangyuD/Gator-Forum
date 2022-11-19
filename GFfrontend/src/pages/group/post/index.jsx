/*
A post have:
0. postid
1. title
2. content
3. owner(owner name, owner avatar)
4. last updated at
5. replies_count and replies (each reply has owner(name and avatar), likes, content, createdAt and replies)
6. likes_count and likes(users who like this post)
7. collections_count and collections(users who collect this post)
*/

/*
url: /group/post?postid
*/
import ProForm, {ProFormText, ProFormTextArea,} from '@ant-design/pro-form';
import { PlusOutlined, TeamOutlined, CrownOutlined, CalendarOutlined, LikeOutlined, LikeTwoTone, MessageOutlined, StarOutlined, StarTwoTone, MessageTwoTone } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Input, Row, Tag, Form, Modal, message } from 'antd';
import React, { useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Link, useRequest, history, useModel } from 'umi';
import Like from './components/like';
import Reply from './components/reply';
import Collection from './components/collection';
import styles from './Center.less';
import { getPost } from '@/services/getPost';
//import { currentUser } from '@/services/ant-design-pro/api';
import { createReply, removeLike, getRelation, createLike, createCollection, removeCollection } from '@/services/user';
import cookie from "react-cookies";


const postid = history.location.search.substring(1);

const operationTabList = ({NumComment, NumLike, NumFavorite}) => {
  if(typeof(NumComment) === 'undefined') return;
  const tabList = [
    {
      key: 'reply',
      tab: <span> Replies{' '+NumComment} </span>,
    },
    {
      key: 'like',
      tab: <span> Likes{' '+NumLike}</span>,
    },
    {
      key: 'collection',
      tab: <span> Collections{' '+NumFavorite}</span>
    },
  ];
  return tabList;
}


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
  const [tabKey, setTabKey] = useState('reply');
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const groupID = cookie.load('groupID');
  console.log(groupID);

  const { data: postContents, reload, loading, loadMore, loadingMore } = useRequest(
    async() => {
      const result = await getPost({
        user: currentUser.name,
        ID: postid,
      });
      //console.log(result);
      return result;
    },
    {
      formatResult: result => result,
      loadMore: true,
    }
  );
  //console.log(postContents);
  const list = postContents || [];
  console.log(list);

  // if(typeof(postContents[0])!='undefined') {
  //   list = postContents;
  // }

  // console.log(list);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async(values) => {
    console.log(values);
    const result = await createReply ({
      ArticleID: parseInt(postid, 10),
      Content: values.goal,
    });
    console.log(result);
    if(result === 'Create Successfully') {
      message.success("Comment submitted!");
      setIsModalVisible(false);
      location.reload(true);
    }
    else {
      message.error("Failed! Please try again!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onLike = async(values) => {
    if(values === true) {
      const result = await removeLike({
        //username: currentUser.name,
        id: postid,
      });
      //console.log(result);
      if(result === '200') {
        message.success("Cancel Liked");
        location.reload(true);
      }
    }
    else {
      const result = await createLike({
        id: postid,
      });
      //console.log(result);
      if(result === '200') {
        message.success("Liked");
        location.reload(true);
      }
    }
  }

  const onCollection = async(values) => {
    if(values === true) {
      const result = await removeCollection({
        //username: currentUser.name,
        id: postid,
      });
      if(result === '200') {
        message.success("Cancelled!");
        location.reload(true);
      }
    }
    else {
      const result = await createCollection({
        id: postid,
      });
      if(result === '200') {
        message.success("Collected");
        location.reload(true);
      }

    }
  }

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

  const renderPostInfo = ({ Title, Content, Owner, UpdatedAt}) => {
    return (
      <div className={styles.listContent}>
        <div className={styles.title}>{Title}</div>
        <p style={{fontSize: '15px', marginTop:'25px', color: '#4F4F4F',}}>
          <img
            alt=""
            src={'http://167.71.166.120:8001/resources/userfiles/'+Owner+'/avatar.png'}
          />
          <a onClick={e => clickUser(Owner, e)}> {Owner}</a> updated at {UpdatedAt.substring(0,10)}
        </p>


        <div className={styles.description}> {Content} 
        </div>
      </div>
    );
  };
  
  const renderButtonInfo = ({Liked, Favorited}) => {
    if(Liked === true && Favorited === true) {
      return (
        <div style={{marginRight: '50px'}}>
          <div>
            <p style={{float:'right'}}>   
                <MessageOutlined 
                    style={{marginRight: '20px'}}  
                    onClick={showModal}
                  />
                  <Modal title="Basic Modal" visible={isModalVisible} destroyOnClose = {true} footer={null}>
                    <ProForm
                      hideRequiredMark
                      style={{
                        margin: 'auto',
                        marginTop: 8,
                        maxWidth: 600,
                      }}
                      name="basic"
                      layout="vertical"
                      initialValues={{
                        public: '1',
                      }}
                      onFinish={handleOk}
                      onReset={handleCancel}
                    >
                      <ProFormTextArea
                        label="Comment"
                        width="xl"
                        name="goal"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your comment.',
                          },
                        ]}
                        placeholder=""
                      />
                    </ProForm>
                </Modal>         
                <LikeTwoTone style={{marginRight: '20px'}} onClick={(e) => onLike(Liked, e)}/>
                <StarTwoTone onClick={(e) => onCollection(Favorited, e)}/>
              </p>
          </div>
        </div>
      );
    }
    else if(Liked === true && Favorited === false) {
      return (
        <div style={{marginRight: '50px'}}>
          <div>
            <p style={{float:'right'}}>
              <MessageOutlined 
                  style={{marginRight: '20px'}}  
                  onClick={showModal}
                />
                <Modal title="Basic Modal" visible={isModalVisible} destroyOnClose = {true} footer={null}>
                    <ProForm
                      hideRequiredMark
                      style={{
                        margin: 'auto',
                        marginTop: 8,
                        maxWidth: 600,
                      }}
                      name="basic"
                      layout="vertical"
                      initialValues={{
                        public: '1',
                      }}
                      onFinish={handleOk}
                      onReset={handleCancel}
                    >
                      <ProFormTextArea
                        label="Comment"
                        width="xl"
                        name="goal"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your comment.',
                          },
                        ]}
                        placeholder=""
                      />
                    </ProForm>
                </Modal>
              <LikeTwoTone style={{marginRight: '20px'}} onClick={(e) => onLike(Liked, e)}/>
              
              <StarOutlined onClick={(e) => onCollection(Favorited, e)}/>
            </p>
            
          </div>
        </div>
      );
    }
    else if(Liked === false && Favorited === true) {
      return (
        <div style={{marginRight: '50px'}}>
          <div  >
            <p style={{float:'right'}}>
              <MessageOutlined 
                  style={{marginRight: '20px'}}  
                  onClick={showModal}
                />
                <Modal title="Basic Modal" visible={isModalVisible} destroyOnClose = {true} footer={null}>
                    <ProForm
                      hideRequiredMark
                      style={{
                        margin: 'auto',
                        marginTop: 8,
                        maxWidth: 600,
                      }}
                      name="basic"
                      layout="vertical"
                      initialValues={{
                        public: '1',
                      }}
                      onFinish={handleOk}
                      onReset={handleCancel}
                    >
                      <ProFormTextArea
                        label="Comment"
                        width="xl"
                        name="goal"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your comment.',
                          },
                        ]}
                        placeholder=""
                      />
                    </ProForm>
                </Modal>
              <LikeOutlined style={{marginRight: '20px'}} onClick={(e) => onLike(Liked, e)} />
              
              <StarTwoTone onClick={(e) => onCollection(Favorited, e)}/>
            </p>
          </div>
        </div>
      );
    }
    else {
      return (
        <div style={{marginRight: '50px'}}>
          <div style={{float:'right'}}>
            <p style={{float:'right'}}>
              <MessageOutlined 
                  style={{marginRight: '20px'}}  
                  onClick={showModal}
                />
                <Modal title="Basic Modal" visible={isModalVisible} destroyOnClose = {true} footer={null}>
                    <ProForm
                      hideRequiredMark
                      style={{
                        margin: 'auto',
                        marginTop: 8,
                        maxWidth: 600,
                      }}
                      name="basic"
                      layout="vertical"
                      initialValues={{
                        public: '1',
                      }}
                      onFinish={handleOk}
                      onReset={handleCancel}
                    >
                      <ProFormTextArea
                        label="Comment"
                        width="xl"
                        name="goal"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your comment.',
                          },
                        ]}
                        placeholder=""
                      />
                    </ProForm>
                </Modal>
              <LikeOutlined style={{marginRight: '20px'}} onClick={(e) => onLike(Liked, e)}/>
              
              <StarOutlined onClick={(e) => onCollection(Favorited, e)}/>
            </p>
            
          </div>
        </div>
      );
    }
  }

  // 渲染tab切换

  const renderChildrenByTabKey = (tabValue) => {
    if (tabValue === 'reply') {
      return <Reply />;
    }

    if (tabValue === 'like') {
      return <Like />;
    }

    if (tabValue === 'collection') {
        return <Collection />;
    }

    return null;
  };

  const clickGroup = () => {
    if(typeof(groupID) === 'undefined') {
      history.push({
        pathname:'/account/center',
        search: currentUser.name,
      });
      return;
    }
    else {
      history.push({
        pathname: '/group/content',
        search: groupID,
      });
    }
    
  }

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={24} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 0,
            }}
            loading={loading}
          >
            {!loading && list && (
              <div>
                <a onClick={clickGroup}> Return</a>
                {renderPostInfo(list)}
                
                {renderButtonInfo(list)}
              </div>
            )}
          </Card>

          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList(list)}
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
