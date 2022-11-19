import React, { useState, useRef, useLayoutEffect } from 'react';
import { history } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import Analysis from './components/analysis';
import BasicInfo from './components/basicInfo';
import Member from './components/member';
import Post from './components/post';
import Notification from './components/notification';
import styles from './style.less';
import { UmiContext } from '@/.umi/plugin-model/helpers/constant';
const { Item } = Menu;

const groupID = history.location.search.substring(1);
console.log(groupID);

const Settings = () => {
  const menuMap = {
    base: 'Basic Information',
    //analysis: 'Analysis',
    member: 'Member List',
    post: 'Post List',
    //notification: 'Notification',
  };
  const [initConfig, setInitConfig] = useState({
    mode: 'inline',
    selectKey: 'base',
  });
  const dom = useRef();

  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }

      let mode = 'inline';
      const { offsetWidth } = dom.current;

      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      setInitConfig({ ...initConfig, mode: mode });
    });
  };

  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);

  const getMenu = () => {
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  const renderChildren = () => {
    const { selectKey } = initConfig;

    switch (selectKey) {
      case 'base':
        return <BasicInfo />;

      case 'analysis':
        return <Analysis />;

      case 'member':
        return <Member />;

      case 'post':
        return <Post />

      case 'notification':
        return <Notification />;

      default:
        return null;
    }
  };

  return (
    <GridContent>
      <div
        className={styles.main}
        ref={(ref) => {
          if (ref) {
            dom.current = ref;
          }
        }}
      >
        <div className={styles.leftMenu}>
          <Menu
            mode={initConfig.mode}
            selectedKeys={[initConfig.selectKey]}
            onClick={({ key }) => {
              setInitConfig({ ...initConfig, selectKey: key });
            }}
          >
            {getMenu()}
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
          {renderChildren()}
        </div>
      </div>
    </GridContent>
  );
};

export default Settings;
