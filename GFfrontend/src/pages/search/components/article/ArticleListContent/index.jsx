import { Avatar } from 'antd';
import React from 'react';
import moment from 'moment';
import { history, useModel } from 'umi';
import styles from './index.less';

const ArticleListContent = ({data: { ID, Content, Username},}) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const clickPost = async(values) => {
    history.push({
      pathname: '/group/post',
      search: values.toString(),
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

  return ( 
  <div className={styles.listContent}>
    <div className={styles.description} onClick={e => clickPost(ID, e)}>{Content}</div>
    <div className={styles.extra}>
      <img src={ 'http://167.71.166.120:8001/resources/userfiles/'+ Username+'/avatar.png'} style={{ width: '25px', height: '25px', borderRadius: '25px' }} />
      <a onClick={(e) => clickUser(Username, e)}> {Username}</a> posted
    </div>
  </div>
)};

export default ArticleListContent;
