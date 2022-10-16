import { PageContainer } from '@ant-design/pro-components';
import { UseApp } from '@/models/global';
import * as URIConstant from '@/constants/uri';
import { history } from 'umi';
import ProCard from '@ant-design/pro-card';

const RootInitPage: React.FC = () => {
  const { rootInitialized } = UseApp();
  console.log('root init page status', rootInitialized);
  if (rootInitialized) {
    history.push(URIConstant.URI_HOME);
  }

  return (
    <PageContainer ghost>
      <ProCard
        title="初始化系统管理员"
        extra="请扫码"
        tooltip="请初始化系统管理员"
        style={{ maxWidth: 300 }}
        headerBordered
      >
        系统安装完毕后，需要初始化一个Root级别的超级管理员，可以设置系统权限功能等。
      </ProCard>
    </PageContainer>
  );
};

export default RootInitPage;
