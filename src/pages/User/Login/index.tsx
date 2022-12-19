import { PageContainer } from '@ant-design/pro-components';
import { UseAuthUserInfo } from '@/models/global';
import * as URIConstant from '@/constants/uri';
import { history } from 'umi';
import { ProCard } from '@ant-design/pro-components';
import useScript from '@/utils/script';
import LoginEmployeeForm from '@/pages/User/Login/components/LoginForm';

const RootInitPage: React.FC = () => {
  const { AuthUser } = UseAuthUserInfo();
  if (AuthUser) {
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
        title: '员工登陆',
        ghost: true,
      }}
    >
      <ProCard
        tabs={{
          type: 'card',
        }}
        title="请选择一个员工的登陆方式"
        extra="如果登陆有问题，请联系超级管理员"
        tooltip="如果当前域名是localhost，则不能使用企业微信授权"
        direction="column"
      >
        <ProCard.TabPane key="base" tab="账号密码登陆">
          <LoginEmployeeForm />
        </ProCard.TabPane>
        <ProCard.TabPane
          key="wecom"
          tab="员工微信授权登陆"
          disabled={disableWeComAuth}
        >
          <div id="wx-qrcode-container"></div>
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  );
};

export default RootInitPage;
