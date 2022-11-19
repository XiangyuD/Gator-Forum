import { DingdingOutlined } from '@ant-design/icons';
import { Button, Card, Steps, Result, Descriptions } from 'antd';
import { Fragment } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import styles from './index.less';
const { Step } = Steps;
const desc1 = (
  <div className={styles.title}>
    <div
      style={{
        margin: '8px 0 4px',
      }}
    >
      <span>Silvia</span>
      <DingdingOutlined
        style={{
          marginLeft: 8,
          color: '#00A0E9',
        }}
      />
    </div>
    <div>2022-01-26 12:32</div>
  </div>
);
const desc2 = (
  <div
    style={{
      fontSize: 12,
    }}
    className={styles.title}
  >
    <div
      style={{
        margin: '8px 0 4px',
      }}
    >
      <span>Maomao Zhou</span>
      <a href="">
        <DingdingOutlined
          style={{
            color: '#00A0E9',
            marginLeft: 8,
          }}
        />
        <span>Push</span>
      </a>
    </div>
  </div>
);

const extra = (
  <Fragment>
    <Button type="primary">Homepage</Button>
    <Button>View my posts</Button>
    
  </Fragment>
);
export default () => (
  <GridContent>
    <Card bordered={false}>
      <Result
        status="success"
        title="Group Deleted"
        //subTitle="Can display post title and a few contents"
        //extra={extra}
        style={{
          marginBottom: 16,
        }}
      >
      </Result>
    </Card>
  </GridContent>
);
