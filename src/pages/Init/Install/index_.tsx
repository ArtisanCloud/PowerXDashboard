import {
  FormInstance,
  PageContainer,
  ProForm,
} from '@ant-design/pro-components';
import { Divider, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { UseApp } from '@/models/global';
import { history } from 'umi';
import * as URIConstant from '@/constants/uri';
import AppConfig from '@/pages/Init/Install/components/AppConfig';
import ServerConfig from '@/pages/Init/Install/components/ServerConfig';
import JWTConfig from '@/pages/Init/Install/components/JWTConfig';
import LogConfig from '@/pages/Init/Install/components/LogConfig';
import DatabaseConfig from '@/pages/Init/Install/components/DatabaseConfig';
import CacheConfig from '@/pages/Init/Install/components/CacheConfig';
import WeComConfig from '@/pages/Init/Install/components/WeComConfig';

const InstallPage: React.FC = () => {
  const { sysInstalled } = UseApp();
  const formRef = useRef<FormInstance>();
  const fieldRequired = true;
  const [formData, setFormData] = useState<API.RequestInstallSystem>({
    appConfig: {
      name: 'PowerX后台系统',
      env: 'dev',
      locale: 'zh_CN',
      timezone: 'Asia/Shanghai',
      server: {
        host: '127.0.0.1',
        port: '8080',
      },
      jwt: {
        public_key: '',
        private_key: '',
      },
      log: {
        log_path: '/var/log/ArtisanCloud/PowerX-dev',
      },
      database: {
        connections: {
          pgsql: {
            host: '127.0.0.1',
            port: '5432',
            database: 'powerx',
            username: 'powerxdev',
            password: 'powerxdev',
            prefix: 'ac_',
            schemas: {
              default: 'public',
            },
          },
        },
      },
      cache: {
        connections: {
          redis: {
            host: '127.0.0.1:6379',
            password: '',
            db: 1,
            ssl_enabled: false,
          },
        },
      },
      wecom: {
        app_oauth_callback_url: 'http://power.artisancloud.cn',
      },
    },
  });

  // 如果系统已经被安装，则直接跳转到系统首页
  useEffect(() => {
    console.log('system install page status', sysInstalled);
    if (sysInstalled) {
      history.push(URIConstant.URI_HOME);
    }
  }, [sysInstalled]);

  // 转化单层form数据为formData
  const convertFormData = (values: any) => {
    console.log('convert install system form data to object', values);
    // app config
    formData.appConfig.name = values.name;
    formData.appConfig.env = values.env;
    formData.appConfig.locale = values.locale;
    formData.appConfig.timezone = values.timezone;

    // server config
    formData.appConfig.server!.host = values.host;
    formData.appConfig.server!.port = values.port;

    // jwt config
    formData.appConfig.jwt!.public_key = values.publicKey;
    formData.appConfig.jwt!.private_key = values.privateKey;

    // log config
    formData.appConfig.log!.log_path = values.log_path;

    // database config
    formData.appConfig.database!.connections!.pgsql.host = values.dbHost;
    formData.appConfig.database!.connections!.pgsql.port = values.dbPort;
    formData.appConfig.database!.connections!.pgsql.database = values.database;
    formData.appConfig.database!.connections!.pgsql.username =
      values.dbUserName;
    formData.appConfig.database!.connections!.pgsql.password =
      values.dbPassword;
    formData.appConfig.database!.connections!.pgsql.prefix = values.dbPrefix;
    formData.appConfig.database!.connections!.pgsql.schemas!.default =
      values.dbSchemaDefault;

    // cache config
    formData.appConfig.cache!.connections!.redis.host = values.cacheHost;
    formData.appConfig.cache!.connections!.redis.db = values.cacheDB;
    formData.appConfig.cache!.connections!.redis.password =
      values.cachePassword;

    // weCom config
    formData.appConfig.wecom!.corp_id = values.corpID;
    formData.appConfig.wecom!.app_oauth_callback_url =
      values.appOAuthCallbackURL;
    formData.appConfig.wecom!.wecom_agent_id = values.weComAgentID;
    formData.appConfig.wecom!.wecom_secret = values.weComSecret;
    formData.appConfig.wecom!.app_cert_public_key = values.appCertPublicKey;
    formData.appConfig.wecom!.app_message_aes_key = values.appMessageAESKey;
    formData.appConfig.wecom!.app_message_callback_url =
      values.appMessageCallbackURL;
    formData.appConfig.wecom!.app_message_token = values.appMessageToken;

    setFormData(formData);

    console.log(formData);
  };

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
            convertFormData(values);
            // console.log(formData)
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

          <ServerConfig
            required={fieldRequired}
            config={formData.appConfig.server!}
          />

          <Divider orientation={'center'}>JWT 配置信息</Divider>

          <JWTConfig
            required={fieldRequired}
            config={formData.appConfig.jwt!}
          />

          <Divider orientation={'center'}>日志配置</Divider>

          <LogConfig
            required={fieldRequired}
            config={formData.appConfig.log!}
          />

          <Divider orientation={'center'}>Postgres 数据库配置</Divider>

          <DatabaseConfig
            required={fieldRequired}
            config={formData.appConfig.database!}
          />

          <Divider orientation={'center'}>Redis 缓存配置</Divider>

          <CacheConfig
            required={fieldRequired}
            config={formData.appConfig.cache!}
          />

          {/*<Divider orientation={'center'}>微信配置</Divider>*/}

          {/*<WechatConfig required={fieldRequired} config={formData.appConfig.system!}/>*/}

          <Divider orientation={'center'}>企业微信配置</Divider>

          <WeComConfig
            required={fieldRequired}
            config={formData.appConfig.wecom!}
          />

          <Divider orientation={'center'}></Divider>
        </ProForm>
      </Space>
    </PageContainer>
  );
};
export default InstallPage;
