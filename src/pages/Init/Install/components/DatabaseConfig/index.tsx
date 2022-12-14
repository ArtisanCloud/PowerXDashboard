import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';

export default (Props: { required: boolean; config: API.DatabaseConfig }) => {
  const rowGutter = 32;
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
          />
        </Col>
      </Row>

      <Row gutter={rowGutter}>
        <Col>
          <ProFormText
            name="dbUserName"
            label="用户名称"
            tooltip="powerxdev"
            placeholder="如：powerxdev"
            initialValue={Props.config.connections!.pgsql.username}
            rules={[{ required: Props.required }]}
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
          />
        </Col>
      </Row>
      <Row gutter={rowGutter}>
        <Col>
          <ProFormText
            name="dbPrefix"
            label="表前缀设置"
            tooltip="最终表的名称：ac_account, ac_order等"
            placeholder="如：ac_"
            initialValue={Props.config.connections!.pgsql.prefix}
          />
        </Col>
        <Col>
          <ProFormText
            name="dbSchemaDefault"
            label="数据库默认摘要"
            tooltip="如果您的数据库存在schema，请设置"
            placeholder="默认是public"
            initialValue={Props.config.connections!.pgsql.schemas!.default}
            rules={[{ required: Props.required }]}
          />
        </Col>
        <Col>
          <ProFormText
            name="dbSSLMode"
            label="SSL模式"
            tooltip="默认使用prefer"
            placeholder="如：prefer"
            initialValue={Props.config.connections!.pgsql.ssl_mode}
          />
        </Col>
      </Row>
    </ProForm.Group>
  );
};
