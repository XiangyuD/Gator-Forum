import { CloseCircleOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Result } from 'antd';
import { Fragment } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import styles from './index.less';
const Content = (
  <Fragment>
    <div className={styles.title}>
      <span>Your contents include following errors or violations:</span>
    </div>
    <div
      style={{
        marginBottom: 16,
      }}
    >
      <CloseCircleOutlined
        style={{
          marginRight: 8,
        }}
        className={styles.error_icon}
      />
      <span>Your account has been blocked.</span>
      <a
        style={{
          marginLeft: 16,
        }}
      >
        <span>Unblock account</span>
        <RightOutlined />
      </a>
    </div>
    <div>
      <CloseCircleOutlined
        style={{
          marginRight: 8,
        }}
        className={styles.error_icon}
      />
      <span>Not qualified</span>
      <a
        style={{
          marginLeft: 16,
        }}
      >
        <span>Upgrade now</span>
        <RightOutlined />
      </a>
    </div>
  </Fragment>
);
export default () => (
  <GridContent>
    <Card bordered={false}>
      <Result
        status="error"
        title="Error!"
        subTitle="Sorry for the inconvenience. Please modify your contents and try submitting again."
        extra={
          <Button type="primary">
            <span>Modify</span>
          </Button>
        }
        style={{
          marginTop: 48,
          marginBottom: 16,
        }}
      >
        {Content}
      </Result>
    </Card>
  </GridContent>
);
