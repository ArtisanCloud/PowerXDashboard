import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
// import {useEffect, useState} from "react";
// import {Ping} from "@/services/detect/DetectController";
// import {useRequest} from "@@/exports";
// import {LoginByCode} from "@/services/user/UserController";

const HomePage: React.FC = () => {
  // // ping backend via useRequest
  // const {data, error, loading} = useRequest(() => {
  // 	return Ping();
  // });
  //
  // if (loading) {
  // 	return <div>loading...</div>;
  // }
  // if (error) {
  // 	return <div>{error.response.status}</div>;
  // }
  // return <div>{data}</div>;

  // // ping backend via useEffect
  // const [rs, setRS] = useState<API.RSPing>();
  // useEffect(() => {
  // 	const HandlePing = async () => {
  // 		const rs = await Ping()
  // 		// Update the document title using the browser API
  // 		setRS(rs)
  // 	};
  // 	HandlePing();
  //
  // 	return () => {
  // 		console.log(rs)
  // 	};
  //
  // }, []);

  return (
    <PageContainer ghost>
      <div className={styles.container}>初始化Root 待开发</div>
    </PageContainer>
  );
};

export default HomePage;
