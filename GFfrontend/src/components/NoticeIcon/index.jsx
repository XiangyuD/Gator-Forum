import { useEffect, useState } from 'react';
import { Tag, message } from 'antd';
import { groupBy } from 'lodash';
import moment from 'moment';
import { useModel, useRequest } from 'umi';
import { getNotices } from '@/services/ant-design-pro/api';
import NoticeIcon from './NoticeIcon';
import styles from './index.less';

const getNoticeData = (notices) => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return {};
  }

  const newNotices = notices.map((notice) => {
    const newNotice = { ...notice };

    if (newNotice.datetime) {
      newNotice.datetime = moment(notice.datetime).fromNow();
    }

    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }

    if (newNotice.extra && newNotice.status) {
      const color = {
        todo: '',
        processing: 'blue',
        urgent: 'red',
        doing: 'gold',
      }[newNotice.status];
      newNotice.extra = (
        <Tag
          color={color}
          style={{
            marginRight: 0,
          }}
        >
          {newNotice.extra}
        </Tag>
      );
    }

    return newNotice;
  });
  return groupBy(newNotices, 'type');
};

const getUnreadData = (noticeData) => {
  const unreadMsg = {};
  Object.keys(noticeData).forEach((key) => {
    const value = noticeData[key];

    if (!unreadMsg[key]) {
      unreadMsg[key] = 0;
    }

    if (Array.isArray(value)) {
      unreadMsg[key] = value.filter((item) => !item.read).length;
    }
  });
  return unreadMsg;
};

const NoticeIconView = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [notices, setNotices] = useState([]);
  const { data } = useRequest(getNotices);
  useEffect(() => {
    setNotices(data || []);
  }, [data]);
  const noticeData = getNoticeData(notices);
  const unreadMsg = getUnreadData(noticeData || {});

  const changeReadState = (id) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };

        if (notice.id === id) {
          notice.read = true;
        }

        return notice;
      }),
    );
  };

  const clearReadState = (title, key) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };

        if (notice.type === key) {
          notice.read = true;
        }

        return notice;
      }),
    );
    message.success(`${'Cleared!'} ${title}`);
  };

  return (
    <NoticeIcon
      className={styles.action}
      count={currentUser && currentUser.unreadCount}
      onItemClick={(item) => {
        changeReadState(item.id);
      }}
      onClear={(title, key) => clearReadState(title, key)}
      loading={false}
      clearText="Clear"
      viewMoreText="View More"
      onViewMore={() => message.info('Click to view more')}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={unreadMsg.notification}
        list={noticeData.notification}
        title="Comments"
        emptyText="Empty"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={unreadMsg.message}
        list={noticeData.message}
        title="Mentions"
        emptyText="Empty"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="event"
        title="Likes"
        emptyText="Empty"
        count={unreadMsg.event}
        list={noticeData.event}
        showViewMore
      />
    </NoticeIcon>
  );
};

export default NoticeIconView;
