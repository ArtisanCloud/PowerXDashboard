import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';

export default (Props: { required: boolean; config: API.WXConfig }) => {
  const rowGutter = 32;
  return (
    <ProForm.Group>
      <Row gutter={rowGutter}>
        <Col>
          <ProFormText
            name="oauthCallbackURL"
            label="微信Oauth回调地址"
            tooltip="请到微信后台配置获取"
            placeholder="如：http://powerx.artisancloud.cn"
            initialValue={Props.config.auth_callback_host}
            rules={[{ required: Props.required }]}
          />
        </Col>
      </Row>
    </ProForm.Group>
  );
};
