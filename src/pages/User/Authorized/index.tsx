import { useSearchParams } from 'umi';
// import {useRequest} from 'umi';
import { Test } from '@/services/user/UserController';

const TestTTT = async () => {
  const obj = Test();
  console.log(obj);
};

// const ProcessLogin = async (code: string, state?: string) => {
// 	const {data, error, loading} = useRequest(() => {
// 		return LoginByCode({code: code, state: state});
// 	});
// 	if (loading) {
// 		return <div>loading...</div>;
// 	}
// 	if (error) {
// 		return <div>{error.message}</div>;
// 	}
// 	return <div>{data}</div>;
// };

const AuthorizedUser: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = '' + searchParams.get('code');
  // const state = searchParams.get('state');

  if (code !== '') {
    // console.log(code)
    // return ProcessLogin(code);
    return TestTTT();
  } else {
    return <div>未授权成功</div>;
  }
};

export default AuthorizedUser;
