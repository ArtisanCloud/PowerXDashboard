import { PageContainer } from '@ant-design/pro-components';
import { UseApp } from '@/models/global';
import * as URIConstant from '@/constants/uri';
import { history } from 'umi';
import { ProCard } from '@ant-design/pro-components';
import useScript from '@/utils/script';
import RegisterRootForm from '@/pages/Init/Root/components/RegisterRootForm';

const RootInitPage: React.FC = () => {
  const { rootInitialized } = UseApp();
  console.log('root init page status', rootInitialized);
  if (rootInitialized) {
    history.push(URIConstant.URI_HOME);
  }

  useScript(
    'https://wwcdn.weixin.qq.com/node/wework/wwopen/js/wwLogin-1.2.7.js',
  );
  useScript('/public/js/wxLogin.js');

  // const bEnableWeComAuth: boolean = false
  const disableWeComAuth: boolean = BASE_URL
    ? BASE_URL.includes('localhost')
    : true;
  // console.log(BASE_URL,disableWeComAuth)
  return (
    <PageContainer
      header={{
        title: '初始化系统管理员',
        ghost: true,
      }}
    >
      <ProCard
        tabs={{
          type: 'card',
        }}
        title="请初始化系统管理员"
        extra="系统安装完毕后，需要初始化一个Root级别的超级管理员，可以设置系统权限功能等。"
        tooltip="如果当前域名是localhost，则不能使用企业微信授权初始化Root"
        direction="column"
      >
        <ProCard.TabPane key="base" tab="账号密码注册Root">
          <RegisterRootForm />
        </ProCard.TabPane>
        <ProCard.TabPane
          key="wecom"
          tab="微信授权登陆注册Root"
          disabled={disableWeComAuth}
        >
          <div id="qrcode-container"></div>
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  );
};

export default RootInitPage;
