import { PageContainer } from '@ant-design/pro-layout';
import { Input } from 'antd';
import { history } from 'umi';
const tabList = [
  {
    key: 'articles',
    tab: 'Latest posts',
  },
  {
    key: 'projects',
    tab: 'Recommoned discussion',
  },
  {
    key: 'applications',
    tab: 'Hot',
  },
];

const Search = (props) => {
  const handleTabChange = (key) => {
    const { match } = props;
    const url = match.url === '/' ? '' : match.url;

    switch (key) {
      case 'articles':
        history.push(`${url}/articles`);
        break;

      case 'applications':
        history.push(`${url}/applications`);
        break;

      case 'projects':
        history.push(`${url}/projects`);
        break;

      default:
        break;
    }
  };

  const handleFormSubmit = (value) => {
    // eslint-disable-next-line no-console
    console.log(value);
  };

  const getTabKey = () => {
    const { match, location } = props;
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');

    if (tabKey && tabKey !== '/') {
      return tabKey;
    }

    return 'articles';
  };

  return (
    <PageContainer
      content={
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <Input.Search
            placeholder="..."
            enterButton="Search"
            size="large"
            onSearch={handleFormSubmit}
            style={{
              maxWidth: 522,
              width: '100%',
            }}
          />
        </div>
      }
      tabList={tabList}
      tabActiveKey={getTabKey()}
      onTabChange={handleTabChange}
    >
      {props.children}
    </PageContainer>
  );
};

export default Search;
