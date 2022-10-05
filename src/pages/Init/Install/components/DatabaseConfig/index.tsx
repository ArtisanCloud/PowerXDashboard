import { ProForm, ProFormText } from '@ant-design/pro-components';

export default () => {
  return (
    <ProForm.Group>
      <ProFormText
        name="dbHost"
        label="启动数据库服务地址"
        tooltip="比如 - 127.0.0.1"
        placeholder="如：127.0.0.1"
        initialValue={'127.0.0.1'}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="dbPort"
        label="数据库端口"
        tooltip="5432"
        placeholder="如：5432"
        initialValue={'5432'}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="database"
        label="数据库名称"
        tooltip="输入自己的库名"
        placeholder="如：powerx"
        initialValue={'powerx'}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="dbUserName"
        label="用户名称"
        tooltip="powerxdev"
        placeholder="如：powerxdev"
        initialValue={'powerxdev'}
        rules={[{ required: true }]}
      />
      <ProFormText.Password
        name="dbPassword"
        label="数据库用户密码"
        tooltip="powerxdev"
        placeholder="如：powerxdev"
        initialValue={'powerxdev'}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="prefix"
        label="表前缀设置"
        tooltip="最终表的名称：ac_account, ac_order等"
        placeholder="如：ac_"
        initialValue={'ac_'}
      />
      <ProFormText
        name="schemaDefault"
        label="数据库默认摘要"
        tooltip="如果你的数据库存在schema，请设置"
        placeholder="默认是public"
        initialValue={'public'}
        rules={[{ required: true }]}
      />
    </ProForm.Group>
  );
};
