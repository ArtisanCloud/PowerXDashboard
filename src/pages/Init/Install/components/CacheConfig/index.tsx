import {
  ProForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useState } from 'react';
import { ValidateRedis } from '@/services/boot/BootController';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { Button, message } from 'antd';

export default (Props: { required: boolean; config: API.CacheConfig }) => {
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const [host, setHost] = useState(Props.config.connections!.redis.host);
  const [db, setDB] = useState(Props.config.connections!.redis.db);
  const [password, setPassword] = useState(
    Props.config.connections!.redis.password,
  );
  const [sslEnabled, setSSLEnabled] = useState<boolean>(false);

  const rowWidthSize = 'xl';

  const handleClick = async () => {
    setIsValidating(true);
    setIsValidated(false);
    // 调用后台api，code换token
    try {
      let queries: API.RequestValidateRedis = {
        redis: {
          host: host,
          db: db,
          password: password,
          ssl_enabled: sslEnabled,
        },
      };

      console.log(queries);
      const rs = await ValidateRedis(queries);

      if (rs.meta.return_code === API_RETURN_CODE_INIT) {
        message.success('测试成功');
        setIsValidated(true);
      } else {
        message.error(rs.meta.result_message);
      }
    } catch (e: any) {
      console.log(e);
    }

    setIsValidating(false);
  };

  return (
    <ProForm.Group>
      <ProFormText
        name="cacheHost"
        label="启动缓存服务地址"
        tooltip="比如 - 127.0.0.1:6379"
        placeholder="如：127.0.0.1:6379"
        initialValue={Props.config.connections?.redis.host}
        rules={[{ required: Props.required }]}
        width={rowWidthSize}
        fieldProps={{
          onChange: (e) => {
            setHost(e.target.value);
          },
        }}
      />

      <ProFormText
        name="cacheDB"
        label="缓存数据库名"
        tooltip="输入库名"
        placeholder="如：1"
        initialValue={Props.config.connections?.redis.db}
        rules={[{ required: Props.required }]}
        width={rowWidthSize}
        fieldProps={{
          onChange: (e) => {
            setDB(parseInt(e.target.value));
          },
        }}
      />
      <ProFormText.Password
        name="cachePassword"
        label="缓存用户密码"
        tooltip="powerxdev"
        placeholder="如：powerxdev"
        width={rowWidthSize}
        initialValue={Props.config.connections?.redis.password}
        fieldProps={{
          onChange: (e) => {
            setPassword(e.target.value);
          },
        }}
      />
      <ProFormCheckbox
        name="sslEnabled"
        label="开启ssl"
        tooltip="开启ssl"
        initialValue={Props.config.connections?.redis.ssl_enabled}
        width={rowWidthSize}
        fieldProps={{
          onChange: (e) => {
            setSSLEnabled(e.target.value);
          },
        }}
      />
      <div style={{ marginTop: 30, marginBottom: 30 }}>
        <Button
          type="dashed"
          key={'validateDatabase'}
          style={{
            borderColor: isValidated ? 'green' : 'red',
            color: isValidated ? 'green' : 'red',
          }}
          loading={isValidating}
          onClick={handleClick}
        >
          验证配置
        </Button>
      </div>
    </ProForm.Group>
  );
};
