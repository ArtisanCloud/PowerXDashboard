import {
  FormInstance,
  PageContainer,
  ProForm,
} from '@ant-design/pro-components';
import { Divider, Space } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const fieldRequired = false;
  const [formData, setFormData] = useState<API.RequestInstallSystem>({
    appConfig: {
      name: 'PowerX后台系统123',
      env: '',
      locale: '',
      timezone: '',
    },
  });

  // 如果系统已经被安装，则直接跳转到系统首页
  useEffect(() => {
    console.log('system install page status', sysInstalled);
    if (sysInstalled) {
      history.push(URIConstant.URI_HOME);
    }
  }, [sysInstalled]);

  const convertFormData = useCallback((values: any) => {
    console.log(values);
    formData.appConfig.name = 'test';
    setFormData(formData);
  }, []);

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
          initialValues={{ formData }}
          formRef={formRef}
          layout={'horizontal'}
          // labelCol={{ span: 150 }}
          labelAlign={'left'}
          // onValuesChange={(changedValue, values) => {
          // 	console.log(changedValue,values);
          // }}
          onFinish={async (values) => {
            console.log(values);
            convertFormData(values);
            console.log(formData);
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

          <AppConfig required={fieldRequired} config={formData.appConfig} />

          <Divider orientation={'center'}>服务器启动信息</Divider>

          <ServerConfig required={fieldRequired} />

          <Divider orientation={'center'}>JWT 配置信息</Divider>

          <JWTConfig required={fieldRequired} />

          <Divider orientation={'center'}>日志配置</Divider>

          <LogConfig required={fieldRequired} />

          <Divider orientation={'center'}>Postgres 数据库配置</Divider>

          <DatabaseConfig required={fieldRequired} />

          <Divider orientation={'center'}>Redis 缓存配置</Divider>

          <CacheConfig required={fieldRequired} />

          <Divider orientation={'center'}>微信配置</Divider>

          <WechatConfig required={fieldRequired} />

          <Divider orientation={'center'}></Divider>
        </ProForm>
      </Space>
    </PageContainer>
  );
};

export default InstallPage;
