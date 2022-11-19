import { List, Switch } from 'antd';
import React, { Fragment } from 'react';
import { getNotification } from '@/services/groupManagement'

const Notification = () => {
  const getData = () => {
    const Action = <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />;
    return [
      {
        title: 'Allow notification',
        description: '',
        actions: [Action],
      },
    
    ];
  };

  const data = getData();
  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default Notification;
