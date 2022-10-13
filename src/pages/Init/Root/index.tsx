import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import { UseApp } from '@/models/global';
import * as URIConstant from '@/constants/uri';
import { history } from 'umi';

const RootInitPage: React.FC = () => {
  const { rootInitialized } = UseApp();
  console.log('root init page status', rootInitialized);
  if (rootInitialized) {
    history.push(URIConstant.URI_HOME);
  }

  return (
    <PageContainer ghost>
      <div className={styles.container}>初始化Root 待开发</div>
    </PageContainer>
  );
};

export default RootInitPage;