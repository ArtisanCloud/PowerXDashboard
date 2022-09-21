// hook useAuthUser for handling current auth.js user
import { useCallback, useState } from 'react';

const UseAuthUser = () => {
  const [AuthUser, setUser] = useState<API.Employee>();
  const SetAuthUser = useCallback((authUser: API.Employee) => {
    setUser(authUser);
  }, []);
  return {
    AuthUser,
    SetAuthUser,
  };
};

export default UseAuthUser;
