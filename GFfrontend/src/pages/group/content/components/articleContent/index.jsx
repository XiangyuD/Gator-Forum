import { Avatar } from 'antd';
import React from 'react';
import moment from 'moment';
import styles from './index.less';
import { useModel, history } from 'umi';
import cookie from "react-cookies";

const groupID = history.location.search.substring(1);

const ArticleListContent = ({ data: { id, content, avatar, createdAt, name } }) => {
    const { initialState } = useModel('@@initialState');
    const { currentUser } = initialState || {};

    const clickPost = async(values) => {
      cookie.save('groupID',values)
      history.push({
        pathname: '/group/post',
        search: values.toString(),
      });
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
      <div className={styles.description} onClick={e => clickPost(id, e)}>{content}</div>
      <div className={styles.extra}>
        <img src={avatar} style={{ width: '30px', height: '30px', borderRadius: '30px' }} />
        <a onClick={e => clickUser(name, e)}> {name} </a>
        <em>last updated at {moment(createdAt).format('YYYY-MM-DD HH:mm')}</em>
      </div>
    </div>
    );
}


export default ArticleListContent;
