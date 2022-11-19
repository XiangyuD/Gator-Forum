import React from 'react';
import { List } from 'antd';
const passwordStrength = {
  strong: <span className="strong">strong</span>,
  medium: <span className="medium">medium</span>,
  weak: <span className="weak">weak</span>,
};

const SecurityView = () => {
  const getData = () => [
    {
      title: 'password',
      description: (
        <>
          current password strength：
          {passwordStrength.strong}
        </>
      ),
      actions: [<a key="Modify">edit</a>],
    },
    {
      title: 'phone',
      description: `35*******7`,
      actions: [<a key="Modify">edit</a>],
    },
    {
      title: 'email',
      description: `*******@ufl.edu`,
      actions: [<a key="Modify">edit</a>],
    },
  ];

  const data = getData();
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </>
  );
};

export default SecurityView;
