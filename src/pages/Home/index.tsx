import {UseApp, UseAuthUserInfo} from '@/models/global';
import {NavLink} from 'umi';
import * as URIConstant from '@/constants/uri';
import {history} from '@@/core/history';
import styles from './index.less'

export default () => {
    const {sysInstalled, rootInitialized} = UseApp();
    // console.log('home page check sys status', sysInstalled, rootInitialized);
    if (!sysInstalled) {
        history.push(URIConstant.URI_INSTALL);
        return <div></div>;
    }
    if (!rootInitialized) {
        history.push(URIConstant.URI_ROOT_INIT);
    return <div></div>;
  }

  const { AuthUser } = UseAuthUserInfo();
  // console.log("home auth user", AuthUser)

  return (
      <div className={styles.container}>
          <div style={{marginTop: "20%", fontSize: "32px"}}> Welcome! I am PowerX Dashboard</div>
          <div style={{margin: "80px", fontSize: "24px"}}>
              {AuthUser ? (
                  <NavLink to="dashboard">进入系统</NavLink>
              ) : (
                  <NavLink to={URIConstant.URI_LOGIN}>请先登录</NavLink>
              )}
          </div>
      </div>
  );
};
