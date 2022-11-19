import { Space } from 'antd';
import { EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { history, useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
//import NoticeIconView from '../NoticeIcon';
import { search } from '@/services/search';

const GlobalHeaderRight = () => {
  const { initialState } = useModel('@@initialState');
  console.log("i am here");

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="Search..."
        defaultValue=""
        options={[]} //can be changed to history searches
        onSearch={(value) => {
          history.push({
            pathname: '/search',
            search: value});
        }}
      />
     
      {/* <NoticeIconView /> */}
      <Avatar menu />
      <SelectLang className={styles.action} />
    </Space>
  );
};

export default GlobalHeaderRight;
