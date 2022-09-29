import { UseAuthUser } from '@/models/global';
import { NavLink } from 'umi';
import * as URIConstant from '@/constants/uri';

export default () => {
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
