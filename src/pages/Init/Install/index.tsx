import { FormInstance, PageContainer } from '@ant-design/pro-components';
import { Button, message, notification } from 'antd';
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
import { StepsForm } from '@ant-design/pro-form/es/layouts/StepsForm';
import { waitTime } from '@/utils/format';
import { InstallSystem } from '@/services/boot/BootController';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { URI_ROOT_INIT } from '@/constants/uri';
import ProCard from '@ant-design/pro-card';

const InstallPage: React.FC = () => {
  const { sysInstalled, updateGlobalSystemInstalled } = UseApp();
  const formRef = useRef<FormInstance>();
  const fieldRequired = true;
  const [formData, setFormData] = useState<API.RequestInstallSystem>({
    appConfig: {
      name: 'PowerX后台系统',
      env: 'local',
      locale: 'zh_CN',
      timezone: 'Asia/Shanghai',
      server: {
        host: '0.0.0.0',
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
            ssl_mode: 'prefer',
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
    formData.appConfig.log!.log_path = values.logPath;

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
    formData.appConfig.database!.connections!.pgsql.ssl_mode = values.dbSSLMode;

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
    // console.log(formData);
  };

  return (
    <PageContainer
      header={{
        title: '安装PowerX系统',
      }}
    >
      <StepsForm<{
        name: string;
      }>
        stepsProps={{
          type: 'default',
          direction: 'vertical',
          responsive: false,
          size: 'small',
        }}
        formRef={formRef}
        onFinish={async (values) => {
          convertFormData(values);
          // console.log(formData)
          console.log(JSON.stringify(formData));
          const hide = message.loading('处理中');
          const res: API.ResponseSystemInstalledStatus = await InstallSystem(
            formData,
          );
          hide();
          if (res.meta.return_code === API_RETURN_CODE_INIT) {
            let installResult: boolean = true;
            for (const result of res.data) {
              if (result.status !== 'success') {
                notification['error']({
                  message: result.name,
                  description: result.errMsg,
                  duration: null,
                });
                installResult = false;
              }
            }
            if (installResult) {
              // 设置系统状态在本地
              updateGlobalSystemInstalled(true);

              // 跳转初始化root页面
              history.push(URI_ROOT_INIT);
              notification['success']({
                message: '安装系统成功',
                description: '请继续配置Root账号，使用企业微信扫码配置',
                duration: null,
              });
              message.success('安装成功');
              return true;
            }
          }
          return false;
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        submitter={{
          render: (props) => {
            if (props.step === 0) {
              return (
                <Button type="primary" onClick={() => props.onSubmit?.()}>
                  下一步 {'>'}
                </Button>
              );
            }

            if (props.step >= 1 && props.step <= 5) {
              return [
                <Button key="pre" onClick={() => props.onPre?.()}>
                  返回上一步
                </Button>,
                <Button
                  type="primary"
                  key="goToTree"
                  onClick={() => props.onSubmit?.()}
                >
                  下一步 {'>'}
                </Button>,
              ];
            }

            return [
              <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                {'<'} 返回第二步
              </Button>,
              <Button
                type="primary"
                key="goToTree"
                onClick={() => props.onSubmit?.()}
              >
                提交 √
              </Button>,
            ];
          },
        }}
      >
        {/*---- APP Config ----*/}
        <StepsForm.StepForm<{
          appConfig: string;
        }>
          name="appConfig"
          title="App 配置信息"
          onFinish={async ({ appConfig }) => {
            console.log(appConfig);
            await waitTime(1000);
            return true;
          }}
        >
          <AppConfig required={fieldRequired} config={formData.appConfig} />
        </StepsForm.StepForm>

        {/*---- Server Config ----*/}
        <StepsForm.StepForm<{
          serverConfig: string;
        }>
          name="serverConfig"
          title="服务器启动信息"
        >
          <ServerConfig
            required={fieldRequired}
            config={formData.appConfig.server!}
          />
        </StepsForm.StepForm>

        {/*---- JWT Config ----*/}
        <StepsForm.StepForm<{
          jwtConfig: string;
        }>
          name="jwtConfig"
          title="JWT 配置信息"
        >
          <JWTConfig
            required={fieldRequired}
            config={formData.appConfig.jwt!}
          />
        </StepsForm.StepForm>

        {/*---- Log Config ----*/}
        <StepsForm.StepForm<{
          logConfig: string;
        }>
          name="logConfig"
          title="日志配置"
        >
          <LogConfig
            required={fieldRequired}
            config={formData.appConfig.log!}
          />
        </StepsForm.StepForm>

        {/*---- Database Config ----*/}
        <StepsForm.StepForm<{
          databaseConfig: string;
        }>
          name="databaseConfig"
          title="Postgres 数据库配置"
        >
          <DatabaseConfig
            required={fieldRequired}
            config={formData.appConfig.database!}
          />
        </StepsForm.StepForm>

        {/*---- Cache Config ----*/}
        <StepsForm.StepForm<{
          cacheConfig: string;
        }>
          name="cacheConfig"
          title="Redis 缓存配置"
        >
          <CacheConfig
            required={fieldRequired}
            config={formData.appConfig.cache!}
          />
        </StepsForm.StepForm>

        {/*<Divider orientation={'center'}>微信配置</Divider>*/}

        {/*<WechatConfig required={fieldRequired} config={formData.appConfig.system!}/>*/}

        {/*---- WeCom Config ----*/}
        <StepsForm.StepForm<{
          weComConfig: string;
        }>
          name="weComConfig"
          title="企业微信配置"
        >
          <WeComConfig
            required={fieldRequired}
            config={formData.appConfig.wecom!}
          />
        </StepsForm.StepForm>
      </StepsForm>

      <ProCard direction="column" ghost gutter={[0, 16]}>
        <ProCard style={{ height: 200 }} />
      </ProCard>
    </PageContainer>
  );
};
export default InstallPage;
