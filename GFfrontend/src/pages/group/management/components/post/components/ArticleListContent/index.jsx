import { Button } from 'antd';
import React from 'react';
import moment from 'moment';
import styles from './index.less';
import { group } from 'console';
import { deletePost } from '@/services/groupManagement';
import {history} from 'umi';

const groupID = history.location.search.substring(1);

const ArticleListContent = ({ data: { content, avatar, createdAt, name,  id, title }, }) => {
  const group_href = '/group/content?' + groupID;
  
  const onDelete = async(values) => {
    const postid = values;
    const result = deletePost(values);
    if(result.message === 'Ok') {
      location.reload();
    }
    else {

    }
  };


  return ( 
    <div>
      <div style = {{display:'inline-block'}}>
        <div >
          <div className={styles.extra}>
            <img src={avatar} style={{ width: '25px', height: '25px', borderRadius: '25px' }} />
            <a href=''> {name}&nbsp;&nbsp;&nbsp;&nbsp; </a>  
            <a className={styles.listItemMetaTitle} href={"/group/post?" + id}>
              {title}&nbsp;&nbsp;&nbsp;&nbsp;
            </a>
            <em>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</em> 
          </div>     
        </div>
        <div className={styles.description}>{content}</div>
      </div>
      <div style={{display: 'inline-block', float: 'right'}}>
        <Button onClick={(e) => onDelete(id, e)}>
          Delete
        </Button>
      </div>

    </div>
  
)};

export default ArticleListContent;
