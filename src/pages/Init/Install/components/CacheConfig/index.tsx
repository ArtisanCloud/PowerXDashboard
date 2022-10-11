import { ProForm, ProFormText } from '@ant-design/pro-components';

export default (Props: { required: boolean }) => {
  return (
    <ProForm.Group>
      <ProFormText
        name="cacheHost"
        label="启动缓存服务地址"
        tooltip="比如 - 127.0.0.1:6379"
        placeholder="如：127.0.0.1:6379"
        initialValue={'127.0.0.1:6379'}
        rules={[{ required: Props.required }]}
      />

      <ProFormText
        name="cacheDB"
        label="缓存数据库名"
        tooltip="输入库名"
        placeholder="如：1"
        initialValue={'1'}
        rules={[{ required: Props.required }]}
      />
      <ProFormText.Password
        name="password"
        label="缓存用户密码"
        tooltip="powerxdev"
        placeholder="如：powerxdev"
      />
    </ProForm.Group>
  );
};
