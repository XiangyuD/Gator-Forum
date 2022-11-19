import { Avatar } from 'antd';
import React from 'react';
import moment from 'moment';
import { history, useModel } from 'umi';
import styles from './index.less';

const ArticleListContent = ({data: { id, content, avatar, createdAt, name, group, groupID },}) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const clickGroup = () => {
    history.push({
      pathname: '/group/content',
      search: groupID.toString(),
    });
  }

  const clickUser = async(values) => {
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

  const clickPost = (values) => {
    history.push({
      pathname: '/group/post',
      search: values.toString(),
    });
    return;
  }

  return ( 
  <div className={styles.listContent}>
    <div className={styles.description} onClick = {e => clickPost(id, e)}>{content}</div>
    <div className={styles.extra}>
      <img src={avatar} style={{ width: '30px', height: '30px', borderRadius: '30px' }} />
      <a onClick={(e) => clickUser(name, e)}> {name}</a> posted on
      <a onClick={clickGroup}> {group}</a>
      <em> {moment(createdAt).format('YYYY-MM-DD')}</em>
      
    </div>
  </div>
)};

export default ArticleListContent;
