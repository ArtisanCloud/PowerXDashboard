import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';

export default (Props: { required: boolean; config: API.WeComConfig }) => {
  const rowGutter = 32;
  return (
    <ProForm.Group>
      <Row gutter={rowGutter}>
        <Col>
          <ProFormText
            name="corpID"
            label="企业微信账号"
            tooltip="请到微信商户号后台配置获取"
            placeholder="如：ww45xxxxxxxxxxxxxxx"
            rules={[{ required: Props.required }]}
          />
        </Col>
        <Col>
          <ProFormText
            name="appOAuthCallbackURL"
            label="企业微信Oauth回调地址"
            tooltip="请到微信商户号后台配置获取"
            placeholder="如：http://power.artisancloud.cn"
            initialValue={Props.config.app_oauth_callback_url}
            rules={[{ required: Props.required }]}
          />
        </Col>
      </Row>

      <Row gutter={rowGutter}>
        <Col>
          <ProFormDigit
            name="weComAgentID"
            label="企微应用账号"
            tooltip="请到微信商户号后台配置获取"
            placeholder="如：10000001"
            rules={[{ required: Props.required }]}
          />
        </Col>
        <Col>
          <ProFormText.Password
            name="weComSecret"
            label="企微应用账号密钥"
            tooltip="请到微信商户号后台配置获取"
            rules={[{ required: Props.required }]}
          />
        </Col>
      </Row>
      <Row gutter={rowGutter}>
        <Col>
          <ProFormTextArea
            name="appCertPublicKey"
            label="企微应用证书公钥"
            tooltip="请到微信商户号后台配置获取"
            placeholder="如：|
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            rules={[{ required: Props.required }]}
          />
        </Col>
      </Row>

      <Row gutter={rowGutter}>
        <Col>
          <ProFormText.Password
            name="appMessageAESKey"
            label="企微应用AES密钥"
            tooltip="请到微信商户号后台配置获取"
            rules={[{ required: Props.required }]}
          />
        </Col>
        <Col>
          <ProFormText
            width={'lg'}
            name="appMessageCallbackURL"
            label="企微应用消息回调地址"
            tooltip="请保证host替换成你想要的域名，后面URI为 wechat/api/weCom/app"
            placeholder="https://{host}/wechat/api/weCom/app"
            initialValue={'https://{host}/wechat/api/weCom/app'}
            rules={[{ required: Props.required }]}
          />
        </Col>
        <Col>
          <ProFormText.Password
            width={'lg'}
            name="appMessageToken"
            label="企微应用消息Token"
            tooltip="请到微信商户号后台配置获取"
            rules={[{ required: Props.required }]}
          />
        </Col>
      </Row>

      {/*<ProFormText.Password*/}
      {/*  width={'lg'}*/}
      {/*  name="customerMessageAESKey"*/}
      {/*  label="企微客户联系人AES密钥"*/}
      {/*  tooltip="请到微信商户号后台配置获取"*/}
      {/*  rules={[{ required: Props.required }]}*/}
      {/*/>*/}
      {/*<ProFormText*/}
      {/*  width={'lg'}*/}
      {/*  name="customerMessageCallbackURL"*/}
      {/*  label="企微客户联系人消息回调地址"*/}
      {/*  tooltip="请保证host替换成你想要的域名，后面URI为 wechat/api/weCom/customer"*/}
      {/*  placeholder="https://{host}/wechat/api/weCom/customer"*/}
      {/*  initialValue={'https://{host}/wechat/api/weCom/customer'}*/}
      {/*  rules={[{ required: Props.required }]}*/}
      {/*/>*/}
      {/*<ProFormText.Password*/}
      {/*  width={'lg'}*/}
      {/*  name="customerMessageToken"*/}
      {/*  label="企微客户联系人消息Token"*/}
      {/*  tooltip="请到微信商户号后台配置获取"*/}
      {/*  rules={[{ required: Props.required }]}*/}
      {/*/>*/}

      {/*<ProFormText.Password*/}
      {/*  width={'lg'}*/}
      {/*  name="employeeMessageAESKey"*/}
      {/*  label="企微内部联系人AES密钥"*/}
      {/*  tooltip="请到微信商户号后台配置获取"*/}
      {/*  rules={[{ required: Props.required }]}*/}
      {/*/>*/}
      {/*<ProFormText*/}
      {/*  width={'lg'}*/}
      {/*  name="employeeMessageCallbackURL"*/}
      {/*  label="企微内部联系人消息回调地址"*/}
      {/*  tooltip="请保证host替换成你想要的域名，后面URI为 wechat/api/weCom/employee"*/}
      {/*  placeholder="https://{host}/wechat/api/weCom/employee"*/}
      {/*  initialValue={'https://{host}/wechat/api/weCom/employee'}*/}
      {/*  rules={[{ required: Props.required }]}*/}
      {/*/>*/}
      {/*<ProFormText.Password*/}
      {/*  width={'lg'}*/}
      {/*  name="employeeMessageToken"*/}
      {/*  label="企微内部联系人消息Token"*/}
      {/*  tooltip="请到微信商户号后台配置获取"*/}
      {/*  rules={[{ required: Props.required }]}*/}
      {/*/>*/}

      {/*	<ProFormText*/}
      {/*		name="authCallbackHost"*/}
      {/*		label="授权回调配置"*/}
      {/*		tooltip="比如 - http://powerx-dev.artisancloud.cn"*/}
      {/*		placeholder="如：http://powerx-dev.artisancloud.cn"*/}
      {/*	/>*/}
      {/*	<ProFormText*/}
      {/*		name="notifyURL"*/}
      {/*		label="微信回调地址"*/}
      {/*		tooltip="如：https://powerx.artisancloud.cn/wechat/notify"*/}
      {/*		placeholder="如：https://powerx.artisancloud.cn/wechat/notify"*/}
      {/*	/>*/}
      {/*	<ProFormText*/}
      {/*		name="mchID"*/}
      {/*		label="服务器端口"*/}
      {/*		tooltip="8080"*/}
      {/*		placeholder="如：8080"*/}
      {/*	/>*/}
      {/*	<ProFormText*/}
      {/*		name="mchAPIV3Key"*/}
      {/*		label="商户好API V3密钥"*/}
      {/*		tooltip="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"*/}
      {/*		placeholder="如：xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"*/}
      {/*	/>*/}
      {/*	<ProFormTextArea*/}
      {/*		name="wxCertPath"*/}
      {/*		label="微信商户号证书配置信息"*/}
      {/*		tooltip="请到微信商户号后台配置获取"*/}
      {/*		placeholder="|*/}
      {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
      {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
      {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
      {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"*/}
      {/*	/>*/}
      {/*	<ProFormTextArea*/}
      {/*		name="wxKeyPath"*/}
      {/*		label="微信商户号密钥配置信息"*/}
      {/*		tooltip="请到微信商户号后台配置获取"*/}
      {/*		placeholder="|*/}
      {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
      {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
      {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
      {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"*/}
      {/*	/>*/}
      {/*	<ProFormText*/}
      {/*		name="wxPayNotifyURL"*/}
      {/*		label="微信商户号支付回调地址"*/}
      {/*		tooltip="如：https://powerx.artisancloud.cn/wechat/notify"*/}
      {/*		placeholder="如：https://powerx.artisancloud.cn/wechat/notify"*/}
      {/*	/>*/}
    </ProForm.Group>
  );
};
