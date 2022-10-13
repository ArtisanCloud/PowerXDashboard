import { ProForm, ProFormText } from '@ant-design/pro-components';

export default (Props: { required: boolean; config: API.LogConfig }) => {
  return (
    <ProForm.Group>
      <ProFormText
        width={'lg'}
        name="logPath"
        label="日志存储路径"
        tooltip="比如 - 系统路径，请确保有权限修改，比如0644"
        placeholder="/var/log/ArtisanCloud/PowerX-dev"
        initialValue={Props.config.log_path}
        rules={[{ required: Props.required }]}
      />
    </ProForm.Group>
  );
};
