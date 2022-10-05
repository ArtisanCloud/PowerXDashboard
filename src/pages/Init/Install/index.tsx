import {
  FormInstance,
  PageContainer,
  ProForm,
} from '@ant-design/pro-components';
import { Divider, Space } from 'antd';
import { useEffect, useRef } from 'react';

import { UseApp } from '@/models/global';
import { history } from 'umi';
import * as URIConstant from '@/constants/uri';
import AppConfig from '@/pages/Init/Install/components/AppConfig';
import ServerConfig from '@/pages/Init/Install/components/ServerConfig';
import JWTConfig from '@/pages/Init/Install/components/JWTConfig';
import LogConfig from '@/pages/Init/Install/components/LogConfig';
import DatabaseConfig from '@/pages/Init/Install/components/DatabaseConfig';
import CacheConfig from '@/pages/Init/Install/components/CacheConfig';
import WechatConfig from '@/pages/Init/Install/components/WechatConfig';

const InstallPage: React.FC = () => {
  const { sysInstalled } = UseApp();
  const formRef = useRef<FormInstance>();

  // 如果系统已经被安装，则直接跳转到系统首页
  useEffect(() => {
    console.log('system install page status', sysInstalled);
    if (sysInstalled) {
      history.push(URIConstant.URI_HOME);
    }
  }, [sysInstalled]);

  return (
    <PageContainer
      header={{
        title: '安装PowerX系统',
      }}
    >
      <Space
        style={{
          width: '100%',
          display: 'flex',
        }}
        align="baseline"
        direction="vertical"
      >
        <ProForm
          submitter={
            {
              // render: false,
            }
          }
          initialValues={{}}
          formRef={formRef}
          layout={'horizontal'}
          // labelCol={{ span: 150 }}
          labelAlign={'left'}
          onFinish={async (values) => {
            console.log(values);
            // const params = { ...values };
            // const hide = message.loading('处理中');
            // const res: CommonResp = await Create(params);
            // hide();
            // if (res.code === 0) {
            // 	history.push('/staff-admin/customer-growth/contact-way');
            // 	message.success('添加成功');
            // 	return true;
            // }
            //
            // if (res.message) {
            // 	message.error(res.message);
            // 	return false;
            // }
            //
            // message.error('添加失败');
            return false;
          }}
        >
          <Divider orientation={'center'}>App 配置信息</Divider>

          <AppConfig />

          <Divider orientation={'center'}>服务器启动信息</Divider>

          <ServerConfig />

          <Divider orientation={'center'}>JWT 配置信息</Divider>

          <JWTConfig />

          <Divider orientation={'center'}>日志配置</Divider>

          <LogConfig />

          <Divider orientation={'center'}>Postgres 数据库配置</Divider>

          <DatabaseConfig />

          <Divider orientation={'center'}>Redis 缓存配置</Divider>

          <CacheConfig />

          <Divider orientation={'center'}>微信配置</Divider>

          <WechatConfig />

          <Divider orientation={'center'}></Divider>
        </ProForm>
      </Space>
    </PageContainer>
  );
};

export default InstallPage;
