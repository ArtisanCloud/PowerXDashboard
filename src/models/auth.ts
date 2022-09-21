// hook useAuthUser for handling current auth.js user
import { useCallback, useState } from 'react';

export default () => {
  const [user, setUser] = useState<API.Employee>();
  const setAuthUser = useCallback((authUser: API.Employee) => {
    setUser(authUser);
  }, []);
  return {
    user,
    setAuthUser,
  };
};
