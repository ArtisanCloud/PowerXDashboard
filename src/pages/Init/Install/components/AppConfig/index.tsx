import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';

const AppConfig = (Props: { required: boolean; config: API.AppConfig }) => {
  const rowGutter = 32;
  const rowWidthSize = 'xl';
  return (
    <ProForm.Group>
      <Row gutter={rowGutter}>
        <Col>
          <ProFormText
            name={'name'}
            label={'系统名称'}
            tooltip={'比如 - PowerX后台系统'}
            placeholder={'如：PowerX后台系统'}
            width={rowWidthSize}
            initialValue={Props.config.name}
            rules={[{ required: Props.required }]}
          />
        </Col>
        <Col>
          <ProFormText
            name={'env'}
            label={'部署环境'}
            tooltip={'dev | test | production'}
            placeholder={'如：dev'}
            width={rowWidthSize}
            initialValue={Props.config.env}
            rules={[{ required: true }]}
          />
        </Col>
      </Row>

      <Row gutter={rowGutter}>
        <Col>
          <ProFormText
            name={'locale'}
            label={'本地化'}
            tooltip={'比如 - zh_CN | en_US'}
            width={rowWidthSize}
            initialValue={Props.config.locale}
            placeholder={'当前系统默认zh_CN'}
          />
        </Col>
        <Col>
          <ProFormText
            name={'timezone'}
            label={'时差'}
            width={rowWidthSize}
            tooltip={"比如 - 'Asia/Shanghai' | 'America/New_York'"}
            initialValue={Props.config.timezone}
            placeholder={"当前系统默认 'Asia/Shanghai'"}
          />
        </Col>
      </Row>
    </ProForm.Group>
  );
};

export default AppConfig;
