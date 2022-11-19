import React from 'react';
import { List } from 'antd';
import { history } from 'umi';

const username = history.location.search.substring(1);

const passwordStrength = {
  strong: <span className="strong">strong</span>,
  medium: <span className="medium">medium</span>,
  weak: <span className="weak">weak</span>,
};

const SecurityView = () => {
  const onEdit = async() => {
    history.push({
      pathname: '/form/changePassword',
      search: username,
    });
  }

  const getData = () => [
    {
      title: 'password',
      description: (
        <>
          current password strength:
          {passwordStrength.strong}
        </>
      ),
      actions: [<a key="Modify" onClick={onEdit}>Edit</a>],
    },
    // {
    //   title: 'phone',
    //   description: `35*******7`,
    //   actions: [<a key="Modify">edit</a>],
    // },
    // {
    //   title: 'email',
    //   description: `*******@ufl.edu`,
    //   actions: [<a key="Modify">edit</a>],
    // },
  ];

  const data = getData();
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} />
          </List.Item>
        )}
      />
    </>
  );
};

export default SecurityView;
