import { PageContainer } from '@ant-design/pro-components';
import { UseApp } from '@/models/global';
import * as URIConstant from '@/constants/uri';
import { history } from 'umi';
import ProCard from '@ant-design/pro-card';
import useScript from '@/utils/script';
import { Card } from 'antd';

const RootInitPage: React.FC = () => {
  const { rootInitialized } = UseApp();
  console.log('root init page status', rootInitialized);
  if (rootInitialized) {
    history.push(URIConstant.URI_HOME);
  }

  useScript(
    'https://wwcdn.weixin.qq.com/node/wework/wwopen/js/wwLogin-1.2.7.js',
  );
  // useScript("/public/js/wxLoginLib.js")
  useScript('/public/js/wxLogin.js');

  return (
    <PageContainer ghost>
      <ProCard
        title="初始化系统管理员"
        extra="请使用企业微信扫码"
        tooltip="请初始化系统管理员"
        style={{ maxWidth: 1200, textAlign: 'center' }}
        headerBordered
      >
        <Card>
          <div>
            系统安装完毕后，需要初始化一个Root级别的超级管理员，可以设置系统权限功能等。
          </div>
        </Card>
        <Card>
          <div id="qrcode-container"></div>
        </Card>
      </ProCard>
    </PageContainer>
  );
};

export default RootInitPage;
