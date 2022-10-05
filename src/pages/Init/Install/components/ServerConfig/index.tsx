import { ProForm, ProFormText } from '@ant-design/pro-components';

export default () => {
  return (
    <ProForm.Group>
      <ProFormText
        name={'host'}
        label={'启动服务器地址'}
        tooltip={'比如 - 127.0.0.1'}
        placeholder={'如：127.0.0.1'}
        initialValue={'127.0.0.1'}
        rules={[{ required: true }]}
      />
      <ProFormText
        name={'port'}
        label={'服务器端口'}
        tooltip={'8080'}
        placeholder={'如：8080'}
        initialValue={'8080'}
        rules={[{ required: true }]}
      />
    </ProForm.Group>
  );
};
