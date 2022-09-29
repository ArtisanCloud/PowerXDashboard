import { UseApp, UseAuthUser } from '@/models/global';
import { NavLink } from 'umi';
import * as URIConstant from '@/constants/uri';
import { history } from '@@/core/history';

export default () => {
  const { sysInstalled, rootInitialized } = UseApp();
  console.log('home page check sys status', sysInstalled, rootInitialized);
  if (!sysInstalled) {
    history.push(URIConstant.URI_BOOT_INSTALL);
    return <div></div>;
  }
  if (!rootInitialized) {
    history.push(URIConstant.URI_ROOT_INIT);
    return <div></div>;
  }

  const AuthUser = UseAuthUser();

  return (
    <div>
      <div> Welcome! I am PowerX Dashboard</div>
      <ul>
        {AuthUser ? (
          <li>
            <NavLink to="dashboard">进入系统</NavLink>
          </li>
        ) : (
          <li>
            <NavLink to={URIConstant.URI_LOGIN}>请先登录</NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};
