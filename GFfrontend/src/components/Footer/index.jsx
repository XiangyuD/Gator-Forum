import { useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'Gator Forum by Road Center 2022',
  });
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright="Gator Forum by Road Center 2022"
      links={[
        //pending: these three links are the same. Should we keep only 1 of them?
        {
          key: 'Ant Design Pro',
          title: 'Gator Forum',
          href: 'https://github.com/fongziyjun16/SE',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/fongziyjun16/SE',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: 'Road Center',
          href: 'https://github.com/fongziyjun16/SE',
          blankTarget: true,
        },
      ]}
    />
  );
};
