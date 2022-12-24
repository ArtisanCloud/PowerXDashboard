import { ProForm, ProFormText } from '@ant-design/pro-components';

export default (Props: { required: boolean; config: API.ServerConfig }) => {
  const rowWidthSize = 'xl';

  return (
    <ProForm.Group>
      <ProFormText
        name={'host'}
        label={'启动服务器地址'}
        tooltip={'比如 - 127.0.0.1'}
        placeholder={'如：127.0.0.1'}
        initialValue={Props.config.host}
        width={rowWidthSize}
        rules={[{ required: Props.required }]}
      />
      <ProFormText
        name={'port'}
        label={'服务器端口'}
        tooltip={'8080'}
        placeholder={'如：8080'}
        width={rowWidthSize}
        initialValue={Props.config.port}
        rules={[{ required: Props.required }]}
      />
    </ProForm.Group>
  );
};
