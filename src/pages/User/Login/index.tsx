import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';

const Login: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <div>QR Code</div>
      </div>
    </PageContainer>
  );
};

export default Login;
