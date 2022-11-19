import { Avatar } from 'antd';
import React from 'react';
import moment from 'moment';
import styles from './index.less';

const ArticleListContent = ({ data: { content, avatar, owner } }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

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

  return  (
  <div className={styles.listContent}>
    <div className={styles.description}>{content}</div>
    <div className={styles.extra}>
      <Avatar src={avatar} size="small" />
      <a onClick={e => clickUser(owner, e)}>{owner}</a>
    </div>
  </div>
  );
}

export default ArticleListContent;
