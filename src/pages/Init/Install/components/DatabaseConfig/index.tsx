import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Col, message, Row } from 'antd';
import { ValidateDatabase } from '@/services/boot/BootController';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { useState } from 'react';

export default (Props: { required: boolean; config: API.DatabaseConfig }) => {
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const [host, setHost] = useState(Props.config.connections!.pgsql.host);
  const [port, setPort] = useState(Props.config.connections!.pgsql.port);
  const [database, setDatabase] = useState(
    Props.config.connections!.pgsql.database,
  );
  const [username, setUsername] = useState(
    Props.config.connections!.pgsql.username,
  );
  const [password, setPassword] = useState(
    Props.config.connections!.pgsql.password,
  );

  const rowGutter = 32;
  const rowWidthSize = 'xl';

  const handleClick = async () => {
    setIsValidating(true);
    setIsValidated(false);
    // 调用后台api，code换token
    try {
      let queries: API.RequestValidateDatabase = {
        database: {
          connections: {
            pgsql: {
              host: host,
              port: port,
              database: database,
              username: username,
              password: password,
            },
          },
        },
      };

      console.log(queries);
      const rs = await ValidateDatabase(queries);

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
      <Row gutter={rowGutter}>
        <Col>
          <ProFormText
            name="dbHost"
            label="启动数据库服务地址"
            tooltip="比如 - 127.0.0.1"
            placeholder="如：127.0.0.1"
            initialValue={Props.config.connections!.pgsql.host}
            rules={[{ required: Props.required }]}
            width={rowWidthSize}
            fieldProps={{
              onChange: (e) => {
                setHost(e.target.value);
              },
            }}
          />
        </Col>
        <Col>
          <ProFormText
            name="dbPort"
            label="数据库端口"
            tooltip="5432"
            placeholder="如：5432"
            initialValue={Props.config.connections!.pgsql.port}
            rules={[{ required: Props.required }]}
            width={rowWidthSize}
            fieldProps={{
              onChange: (e) => {
                setPort(e.target.value);
              },
            }}
          />
        </Col>
        <Col>
          <ProFormText
            name="database"
            label="数据库名称"
            tooltip="输入自己的库名"
            placeholder="如：powerx"
            initialValue={Props.config.connections!.pgsql.database}
            rules={[{ required: Props.required }]}
            width={rowWidthSize}
            fieldProps={{
              onChange: (e) => {
                setDatabase(e.target.value);
              },
            }}
          />
        </Col>
      </Row>

      <Row gutter={rowGutter}>
        <Col>
          <ProFormText
            name="dbUserName"
            label="数据库用户名称"
            tooltip="powerxdev"
            placeholder="如：powerxdev"
            initialValue={Props.config.connections!.pgsql.username}
            rules={[{ required: Props.required }]}
            width={rowWidthSize}
            fieldProps={{
              onChange: (e) => {
                setUsername(e.target.value);
              },
            }}
          />
        </Col>
        <Col>
          <ProFormText.Password
            name="dbPassword"
            label="数据库用户密码"
            tooltip="powerxdev"
            placeholder="如：powerxdev"
            initialValue={Props.config.connections!.pgsql.password}
            rules={[{ required: Props.required }]}
            width={rowWidthSize}
            fieldProps={{
              onChange: (e) => {
                setPassword(e.target.value);
              },
            }}
          />
        </Col>
      </Row>
      <Row gutter={rowGutter}>
        <Col>
          <ProFormText
            name="dbPrefix"
            label="表前缀设置"
            tooltip="最终表的名称：ac_account, ac_order等"
            disabled={true}
            width={rowWidthSize}
            placeholder="如：ac_"
            initialValue={Props.config.connections!.pgsql.prefix}
          />
        </Col>
        <Col>
          <ProFormText
            name="dbSchemaDefault"
            label="数据库默认摘要"
            tooltip="如果您的数据库存在schema，请设置"
            disabled={true}
            placeholder="默认是public"
            width={rowWidthSize}
            initialValue={Props.config.connections!.pgsql.schemas!.default}
            rules={[{ required: Props.required }]}
          />
        </Col>
        <Col>
          <ProFormText
            name="dbSSLMode"
            label="SSL模式"
            tooltip="默认使用prefer"
            disabled={true}
            width={rowWidthSize}
            placeholder="如：prefer"
            initialValue={Props.config.connections!.pgsql.ssl_mode}
          />
        </Col>
      </Row>
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
