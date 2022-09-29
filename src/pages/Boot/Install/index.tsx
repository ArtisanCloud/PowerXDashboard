import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import { UseApp } from '@/models/global';
import { history } from 'umi';
import * as URIConstant from '@/constants/uri';

const HomePage: React.FC = () => {
  const { sysInstalled } = UseApp();
  if (sysInstalled) {
    history.push(URIConstant.URI_HOME);
  }

  return (
    <PageContainer ghost>
      <div className={styles.container}>安装系统 待开发</div>
    </PageContainer>
  );
};

export default HomePage;
