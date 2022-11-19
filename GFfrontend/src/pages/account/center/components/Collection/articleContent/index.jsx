import { Avatar } from 'antd';
import { useModel, history } from 'umi';
import React from 'react';
import moment from 'moment';
import styles from './index.less';

const ArticleListContent = ({ data: { ID, Content, UpdatedAt, Owner } }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const clickPost = (values) => {
    history.push({
      pathname: '/group/post',
      search: values.toString(),
    });
    return;
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

  return (
    <div className={styles.listContent}>
      <div className={styles.description} onClick = {e => clickPost(ID, e)}>{Content}</div>
      <div className={styles.extra}>
        <img src={'http://167.71.166.120:8001/resources/userfiles/'+Owner+'/avatar.png'} style={{ width: '25px', height: '25px', borderRadius: '25px' }} />
        <a onClick={(e) => clickUser(Owner, e)}> {Owner} </a>
        <em>last updated at {moment(UpdatedAt).format('YYYY-MM-DD')}</em>
      </div>
    </div>
)};

export default ArticleListContent;
